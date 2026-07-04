import type { InputIntentHandlers, InputSource, InputSourceContext, MoveVector } from './types';

// Physical key positions (KeyboardEvent.code): WASD on QWERTY is automatically ZQSD on AZERTY.
const UP = new Set(['KeyW', 'ArrowUp']);
const DOWN = new Set(['KeyS', 'ArrowDown']);
const LEFT = new Set(['KeyA', 'ArrowLeft']);
const RIGHT = new Set(['KeyD', 'ArrowRight']);
const INTERACT = new Set(['KeyE', 'Enter']);
const DISMISS = new Set(['Escape']);
const TOGGLE_MUTE = new Set(['KeyM']);

const MOVE_KEYS = new Set([...UP, ...DOWN, ...LEFT, ...RIGHT]);

/**
 * Yield to the DOM exactly the keys the focused element needs, and no more (PRD §6.11: clicking
 * HUD elements must never kill movement). Text fields and dialogs get every key; focused
 * links/buttons only keep Enter, so it activates them instead of firing the interact intent —
 * movement keys keep working even while a HUD link has focus.
 */
function domOwnsKey(event: KeyboardEvent): boolean {
  if (!(event.target instanceof HTMLElement)) return false;
  if (event.target.closest('input, textarea, select, [contenteditable], [role="dialog"]')) {
    return true;
  }
  return event.code === 'Enter' && event.target.closest('a, button') !== null;
}

/**
 * Window-level keyboard source (PRD §6.11: clicking DOM HUD elements must never kill movement
 * input). Held keys are cleared on window blur — the classic stuck-key walk-into-a-wall bug.
 */
export function createKeyboardSource(): InputSource {
  let handlers: InputIntentHandlers | null = null;
  let context: InputSourceContext | null = null;
  const pressed = new Set<string>();

  function currentVector(): MoveVector {
    const x = Number(hasAny(RIGHT)) - Number(hasAny(LEFT));
    const y = Number(hasAny(DOWN)) - Number(hasAny(UP));
    if (x !== 0 && y !== 0) {
      const invLength = 1 / Math.hypot(x, y);
      return { x: x * invLength, y: y * invLength };
    }
    return { x, y };
  }

  function hasAny(keys: Set<string>): boolean {
    for (const key of keys) {
      if (pressed.has(key)) return true;
    }
    return false;
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!handlers || !context || domOwnsKey(event)) return;

    const consumed = MOVE_KEYS.has(event.code) || INTERACT.has(event.code);
    // Never preventDefault while paused: an open Dialog needs Esc/Tab/Enter to work natively.
    if (consumed && !context.isPaused()) event.preventDefault();

    if (MOVE_KEYS.has(event.code)) {
      if (!pressed.has(event.code)) {
        pressed.add(event.code);
        handlers.onMove(currentVector());
      }
    } else if (INTERACT.has(event.code) && !event.repeat) {
      handlers.onInteract();
    } else if (DISMISS.has(event.code) && !event.repeat) {
      handlers.onDismiss();
    } else if (TOGGLE_MUTE.has(event.code) && !event.repeat) {
      handlers.onToggleMute();
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    if (!handlers || !pressed.has(event.code)) return;
    pressed.delete(event.code);
    handlers.onMove(currentVector());
  }

  function onBlur() {
    pressed.clear();
    handlers?.onMove({ x: 0, y: 0 });
  }

  return {
    attach(nextHandlers, nextContext) {
      handlers = nextHandlers;
      context = nextContext;
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      window.addEventListener('blur', onBlur);
    },

    detach() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      pressed.clear();
      handlers = null;
      context = null;
    },
  };
}
