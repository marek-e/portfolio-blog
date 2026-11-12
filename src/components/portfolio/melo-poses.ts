export function createMeloPoses(runner: HTMLElement) {
  const direction = runner.querySelector<HTMLElement>('[data-melo-direction]')!;
  const canvas = runner.querySelector<HTMLCanvasElement>('[data-melo-character]')!;
  const context = canvas.getContext('2d');
  const art = runner.querySelector<HTMLElement>('[data-melo-idle-art]')!;
  const feedback = runner.querySelector<HTMLElement>('[data-melo-feedback]')!;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = false;
  let moving = false;
  let handSign = false;
  let facing = 1;
  let angle = 0;
  let timer = 0;
  let blinkTimer = 0;
  let feedbackTimer = 0;
  let hasBlinked = false;
  let cast: Animation | null = null;
  let wanted = 'idle';
  let displayed = 'idle';
  let orientation = 1;
  let runFrame = 1;
  let runLean = 0;
  let disposed = false;

  const paint = (image: HTMLImageElement, pose: string) => {
    if (!context || disposed) return;
    context.save();
    context.clearRect(0, 0, 512, 512);
    if (pose === 'run' || pose.startsWith('turn-')) {
      context.translate(256, 481);
      context.scale(orientation, 1);
      if (pose === 'run') context.rotate((runLean * Math.PI) / 180);
      context.translate(-256, -481);
    }
    if (pose === 'run') context.drawImage(image, runFrame * 512, 0, 512, 512, 0, 0, 512, 512);
    else context.drawImage(image, 0, 0, 512, 512);
    context.restore();
    displayed = pose;
    runner.dataset.pose = pose;
    runner.dataset.meloPainted = '';
  };
  const show = (pose: string) => {
    wanted = pose;
    const image = runner.querySelector<HTMLImageElement>(
      pose === 'run' ? '[data-melo-sprite]' : `.melo-${pose}`
    )!;
    if (image.complete && image.naturalWidth) {
      paint(image, pose);
      return;
    }
    image.loading = 'eager';
    void image.decode().then(
      () => {
        if (wanted === pose) paint(image, pose);
      },
      () => {}
    );
  };
  const clearBlink = () => {
    window.clearTimeout(blinkTimer);
    blinkTimer = 0;
    if (wanted === 'blink') show('idle');
  };
  const canBlink = () =>
    active && !moving && !handSign && angle === 0 && !document.hidden && !reducedMotion.matches;
  const queueBlink = (): void => {
    if (blinkTimer || disposed || !canBlink()) return;
    blinkTimer = window.setTimeout(
      () => {
        blinkTimer = 0;
        if (!canBlink()) return;
        hasBlinked = true;
        show('blink');
        blinkTimer = window.setTimeout(() => {
          blinkTimer = 0;
          show('idle');
          queueBlink();
        }, 100);
      },
      hasBlinked ? 6800 + Math.random() * 3000 : 3200
    );
  };
  const cancel = () => {
    window.clearTimeout(timer);
    window.clearTimeout(feedbackTimer);
    feedback.style.opacity = '0';
    clearBlink();
    cast?.cancel();
    cast = null;
  };
  const orient = (value: number) => {
    runner.dataset.facing = String(value);
    direction.style.transform = `scaleX(${value})`;
    orientation = value;
  };
  const rest = () => {
    show(handSign ? 'seal' : 'idle');
    queueBlink();
  };
  const turnTo = (target: number) => {
    cancel();
    const step = () => {
      angle += Math.sign(target - angle);
      if (angle === 0) {
        if (moving) show('idle');
        else rest();
      } else {
        orient(Math.sign(angle));
        show(Math.abs(angle) === 5 ? 'run' : `turn-${Math.abs(angle) - 1}`);
      }
      if (angle !== target) timer = window.setTimeout(step, 25);
    };
    step();
  };

  return {
    setFrame(frame: number, lean = 0) {
      runFrame = frame;
      runLean = lean;
      if (displayed === 'run') {
        const image = runner.querySelector<HTMLImageElement>('[data-melo-sprite]')!;
        paint(image, 'run');
      }
    },
    setActive(value: boolean) {
      active = value;
      clearBlink();
      queueBlink();
    },
    setRunning(value: boolean) {
      if (moving === value) return;
      moving = value;
      if (reducedMotion.matches) {
        cancel();
        angle = 0;
        rest();
        return;
      }
      turnTo(value ? facing * 5 : 0);
    },
    setDirection(value: number) {
      if (value === facing) return;
      facing = value;
      if (reducedMotion.matches) {
        orient(value);
        return;
      }
      if (moving) turnTo(value * 5);
      else orient(value);
    },
    setHandSign(value: boolean, immediate = false) {
      if (handSign === value) return;
      handSign = value;
      runner.toggleAttribute('data-hand-sign', value);
      clearBlink();
      if (moving || (angle !== 0 && !immediate && !reducedMotion.matches)) return;
      cancel();
      angle = 0;
      if (immediate || reducedMotion.matches) {
        rest();
        return;
      }
      show('raise');
      timer = window.setTimeout(rest, value ? 80 : 60);
    },
    acknowledge() {
      window.clearTimeout(feedbackTimer);
      feedback.style.opacity = '0.65';
      feedbackTimer = window.setTimeout(() => (feedback.style.opacity = '0'), 100);
    },
    cast() {
      cancel();
      angle = 0;
      show('seal');
      cast = art.animate(
        [
          { transform: 'translateY(0) scale(1)' },
          { transform: 'translateY(1%) scale(0.97)', offset: 0.5 },
          { transform: 'translateY(0) scale(1)' },
        ],
        { duration: 200, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }
      );
    },
    reset() {
      moving = false;
      angle = 0;
      cancel();
      orient(facing);
      rest();
    },
    destroy() {
      disposed = true;
      cancel();
    },
  };
}
