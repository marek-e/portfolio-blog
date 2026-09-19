export type WorldIntent = {
  x: number;
  y: number;
  interact: boolean;
  dismiss: boolean;
};

export function createWorldInput(onMute: () => void, onDismiss?: () => void) {
  const held = new Set<string>();
  let enabled = false;
  let injected: Partial<WorldIntent> = {};
  let interact = false;
  let dismiss = false;
  const movement = new Set([
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyZ',
    'KeyQ',
  ]);
  const clear = () => {
    held.clear();
    injected = {};
    interact = false;
    dismiss = false;
  };
  const matches = (target: EventTarget | null, selector: string) =>
    target instanceof Element && Boolean(target.closest(selector));
  const down = (event: KeyboardEvent) => {
    if (
      !enabled ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      matches(event.target, 'input,textarea,select,[contenteditable],[role="dialog"],dialog')
    )
      return;
    if (movement.has(event.code)) {
      event.preventDefault();
      held.add(event.code);
    } else if (event.code === 'KeyE' || event.code === 'Enter') {
      if (event.code === 'Enter' && matches(event.target, 'button,a,[role="button"]')) return;
      event.preventDefault();
      if (!event.repeat) interact = true;
    } else if (event.code === 'KeyM' && !event.repeat) {
      onMute();
    } else if (event.code === 'Escape' && !event.repeat) {
      dismiss = true;
      onDismiss?.();
    }
  };
  const up = (event: KeyboardEvent) => held.delete(event.code);
  const visibility = () => {
    if (document.hidden) clear();
  };
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', visibility);
  return {
    clear,
    setEnabled(value: boolean) {
      enabled = value;
      clear();
    },
    setIntent(intent: Partial<WorldIntent>) {
      if (enabled) injected = { ...injected, ...intent };
    },
    read(): WorldIntent {
      if (!enabled) return { x: 0, y: 0, interact: false, dismiss: false };
      const pressed = (...codes: string[]) => Number(codes.some((code) => held.has(code)));
      const x = injected.x ?? pressed('ArrowRight', 'KeyD') - pressed('ArrowLeft', 'KeyA', 'KeyQ');
      const y = injected.y ?? pressed('ArrowDown', 'KeyS') - pressed('ArrowUp', 'KeyW', 'KeyZ');
      const length = Math.max(1, Math.hypot(x, y));
      const intent = {
        x: x / length,
        y: y / length,
        interact: interact || Boolean(injected.interact),
        dismiss: dismiss || Boolean(injected.dismiss),
      };
      interact = false;
      dismiss = false;
      injected.interact = false;
      injected.dismiss = false;
      return intent;
    },
    destroy() {
      clear();
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', visibility);
    },
  };
}
