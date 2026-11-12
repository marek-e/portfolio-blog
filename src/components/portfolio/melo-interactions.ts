import type { createMeloPoses } from './melo-poses';

export function createMeloInteractions(
  runway: HTMLElement,
  runner: HTMLElement,
  poses: ReturnType<typeof createMeloPoses>,
  settleForFocus: () => void
) {
  const trigger = runner.querySelector<HTMLButtonElement>('[data-melo-trigger]')!;
  const clones = Array.from(runway.querySelectorAll<HTMLElement>('[data-melo-clone]'));
  const bursts = Array.from(runway.querySelectorAll<HTMLElement>('[data-melo-burst]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let active = false;
  let running = false;
  let keyboardFocus = false;
  let hovered = false;
  let casting = false;
  let effectId = 0;
  let animations: Animation[] = [];
  const timers = new Set<number>();

  const schedule = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      callback();
    }, delay);
    timers.add(timer);
  };
  const updatePose = () => {
    const focused = document.activeElement === trigger && keyboardFocus;
    poses.setHandSign(active && !running && (hovered || focused || casting), focused);
  };
  const reset = () => {
    effectId++;
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
    animations.forEach((animation) => animation.cancel());
    animations = [];
    casting = false;
    runner.removeAttribute('data-casting');
    trigger.setAttribute('aria-busy', 'false');
    clones.forEach((clone) => {
      clone.hidden = true;
      clone.removeAttribute('data-running');
    });
    bursts.forEach((burst) => (burst.hidden = true));
    updatePose();
  };
  const dismiss = () => {
    hovered = false;
    reset();
  };
  const burstAt = (burst: HTMLElement, x: number) => {
    burst.hidden = false;
    burst.style.transform = `translate3d(${x}px, 0, 0)`;
    const origins = [
      [22, 18],
      [48, 38],
      [30, 64],
      [54, 28],
      [24, 52],
      [46, 68],
      [40, 44],
    ];
    burst.querySelectorAll<HTMLElement>('.melo-puff').forEach((puff, index) => {
      puff.getAnimations().forEach((animation) => animation.cancel());
      const angle = (index / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
      const dx = Math.cos(angle) * (90 + Math.random() * 50);
      const dy = Math.sin(angle) * (70 + Math.random() * 35) - 45 - Math.random() * 15;
      const scale = 0.65 + Math.random() * 0.15;
      const spread = 1.2 + Math.random() * 0.3;
      puff.style.left = `${origins[index][0] + Math.random() * 6 - 3}%`;
      puff.style.top = `${origins[index][1] + Math.random() * 6 - 3}%`;
      puff.style.width = `${22 + Math.random() * 12}%`;
      animations.push(
        puff.animate(
          [
            { transform: `translate(0, 0) scale(${scale})`, opacity: 0 },
            {
              transform: `translate(${dx * 0.45}%, ${dy * 0.45}%) scale(${spread * 0.82})`,
              opacity: 0.75 + Math.random() * 0.15,
              offset: 0.28,
            },
            { transform: `translate(${dx}%, ${dy}%) scale(${spread})`, opacity: 0 },
          ],
          {
            duration: 250 + Math.random() * 45,
            delay: index === 0 ? 0 : Math.random() * 22,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
            fill: 'both',
          }
        )
      );
    });
  };
  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !finePointer.matches) return;
    hovered = true;
    updatePose();
  };
  const onPointerLeave = () => {
    hovered = false;
    updatePose();
  };

  const activateClones = (event: MouseEvent) => {
    if (event.detail > 0) keyboardFocus = false;
    if (!active || running || document.hidden) return;
    if (casting) {
      if (event.detail > 0) poses.acknowledge();
      return;
    }
    const currentEffect = ++effectId;
    casting = true;
    runner.dataset.casting = '';
    trigger.setAttribute('aria-busy', 'true');
    updatePose();
    const gentle = reducedMotion.matches || event.detail === 0;
    if (!gentle) poses.cast();
    const bounds = runway.getBoundingClientRect();
    const start = runner.getBoundingClientRect().left - bounds.left;
    const size = runner.offsetWidth;
    let remaining = clones.length;
    const finish = () => {
      if (--remaining === 0) schedule(reset, gentle ? 0 : 220);
    };

    clones.forEach((clone, index) => {
      const direction = Number(clone.dataset.direction);
      const facing = clone.querySelector<HTMLElement>('[data-clone-facing]')!;
      const sprite = clone.querySelector<HTMLElement>('.melo-clone-sprite')!;
      const shadow = clone.querySelector<HTMLElement>('[data-clone-shadow]')!;
      const burst = bursts[index];
      const initialX = Math.max(0, Math.min(bounds.width - size, start + direction * size * 0.45));
      const end = gentle ? initialX : direction < 0 ? 0 : bounds.width - size;
      const distance = Math.abs(end - initialX);
      const duration = gentle ? 200 : Math.max(80, Math.min(1100, distance / (size * 0.005)));
      const delay = gentle ? 0 : 160;
      clone.hidden = false;
      clone.toggleAttribute('data-still', gentle);
      facing.style.transform = gentle ? 'none' : `scaleX(${direction}) rotate(3deg)`;
      shadow.style.left = `${gentle || direction > 0 ? 54 : 46}%`;
      const departure = clone.animate(
        gentle
          ? [
              { transform: `translate3d(${initialX}px, 0, 0)`, opacity: 0 },
              { transform: `translate3d(${initialX}px, 0, 0)`, opacity: 1, offset: 0.2 },
              { transform: `translate3d(${initialX}px, 0, 0)`, opacity: 0 },
            ]
          : [
              { transform: `translate3d(${initialX}px, 0, 0)` },
              { transform: `translate3d(${end}px, 0, 0)` },
            ],
        { duration, delay, easing: 'linear', fill: 'both' }
      );
      animations.push(departure);
      const stride: Animation[] = [];
      if (!gentle) {
        burstAt(burst, initialX);
        animations.push(
          clone.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 1,
            delay: 100,
            fill: 'both',
          })
        );
        const cycle = (size * 0.72 * duration) / Math.max(size * 0.36, distance);
        stride.push(
          sprite.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }], {
            duration: cycle,
            delay,
            iterations: Infinity,
            easing: 'steps(8, end)',
          }),
          shadow.animate(
            Array.from({ length: 9 }, (_, frame) => ({
              transform: `translateX(-50%) scale(${frame % 4 === 3 ? 0.78 : 1})`,
              opacity: frame % 4 === 3 ? 0.12 : 0.2,
              offset: frame / 8,
            })),
            { duration: cycle, delay, iterations: Infinity, easing: 'steps(1, end)' }
          )
        );
        animations.push(...stride);
        schedule(() => (clone.dataset.running = ''), delay);
      }
      void departure.finished.then(
        () => {
          if (currentEffect !== effectId) return;
          stride.forEach((animation) => animation.cancel());
          clone.removeAttribute('data-running');
          if (gentle) {
            clone.hidden = true;
            finish();
            return;
          }
          sprite.style.transform = 'translateX(-12.5%)';
          burstAt(burst, end);
          schedule(() => {
            clone.hidden = true;
            finish();
          }, 100);
        },
        () => {}
      );
    });
  };

  const onFocus = () => {
    keyboardFocus = true;
    if (!casting) settleForFocus();
    updatePose();
  };
  const onKeyDown = () => {
    keyboardFocus = true;
    if (!casting) settleForFocus();
    updatePose();
  };
  const releaseKeyboardFocus = () => {
    keyboardFocus = false;
    updatePose();
  };

  trigger.hidden = false;
  trigger.setAttribute('aria-disabled', 'false');
  trigger.setAttribute('aria-busy', 'false');
  trigger.addEventListener('click', activateClones);
  trigger.addEventListener('focus', onFocus);
  trigger.addEventListener('keydown', onKeyDown);
  trigger.addEventListener('pointerdown', releaseKeyboardFocus);
  trigger.addEventListener('pointerenter', onPointerEnter);
  trigger.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('blur', dismiss);
  window.addEventListener('wheel', releaseKeyboardFocus, { passive: true });
  reducedMotion.addEventListener('change', reset);
  finePointer.addEventListener('change', dismiss);

  return {
    isKeyboardFocused() {
      return document.activeElement === trigger && keyboardFocus;
    },
    setRunning(value: boolean) {
      if (running === value) return;
      running = value;
      if (running) hovered = false;
      poses.setRunning(value);
      runner.toggleAttribute('data-running', value);
      trigger.setAttribute('aria-disabled', String(value));
      trigger.tabIndex = value ? -1 : 0;
      reset();
    },
    setActive(value: boolean) {
      active = value;
      poses.setActive(value);
      if (!active) dismiss();
      else updatePose();
    },
    reset,
    destroy() {
      reset();
      trigger.removeEventListener('click', activateClones);
      trigger.removeEventListener('focus', onFocus);
      trigger.removeEventListener('keydown', onKeyDown);
      trigger.removeEventListener('pointerdown', releaseKeyboardFocus);
      trigger.removeEventListener('pointerenter', onPointerEnter);
      trigger.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', dismiss);
      window.removeEventListener('wheel', releaseKeyboardFocus);
      reducedMotion.removeEventListener('change', reset);
      finePointer.removeEventListener('change', dismiss);
    },
  };
}
