import type { InputIntentHandlers, InputSource, MoveVector } from './types';

/** Drag must travel this far (px) before it counts as movement instead of a tap. */
const DEADZONE = 12;
/** Maximum press duration (ms) for a release to count as a tap → interact. */
const TAP_MS = 300;

/**
 * Dev-only stand-in for the phase-2 touch source, activated with `?input=fake-touch`
 * (plan slice 6). Press-drag works like a virtual joystick anchored at the press point;
 * a short, still tap fires the interact intent. It implements the same InputSource
 * interface with zero changes to game code — that absence of change is the P0 proof
 * that input is fully abstracted.
 */
export function createFakeTouchSource(): InputSource {
  let handlers: InputIntentHandlers | null = null;
  let origin: MoveVector | null = null;
  let dragging = false;
  let pressedAt = 0;

  function onPointerDown(event: PointerEvent) {
    if (event.target instanceof HTMLElement && event.target.closest('a, button, [role="dialog"]')) {
      return;
    }
    origin = { x: event.clientX, y: event.clientY };
    dragging = false;
    pressedAt = performance.now();
  }

  function onPointerMove(event: PointerEvent) {
    if (!origin || !handlers) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    const distance = Math.hypot(dx, dy);
    if (distance < DEADZONE) return;
    dragging = true;
    handlers.onMove({ x: dx / distance, y: dy / distance });
  }

  function onPointerUp() {
    if (!origin || !handlers) return;
    if (!dragging && performance.now() - pressedAt < TAP_MS) {
      handlers.onInteract();
    }
    origin = null;
    dragging = false;
    handlers.onMove({ x: 0, y: 0 });
  }

  function onBlur() {
    origin = null;
    dragging = false;
    handlers?.onMove({ x: 0, y: 0 });
  }

  return {
    attach(nextHandlers) {
      handlers = nextHandlers;
      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('blur', onBlur);
    },

    detach() {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('blur', onBlur);
      handlers = null;
      origin = null;
    },
  };
}
