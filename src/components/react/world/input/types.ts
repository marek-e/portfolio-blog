// Intent-based input contract (PRD §6.5 decision 6): sources push *intents* — never keys — so
// the phase-2 touch source plugs in without touching game code. Game code talks only to the
// manager (`getMoveVector()` / `onInteract`), never to a source.

export interface MoveVector {
  x: number;
  y: number;
}

/** Pushed by sources into the manager. */
export interface InputIntentHandlers {
  /** Normalized direction (diagonals ≤ 1), zero vector on release. */
  onMove(vector: MoveVector): void;
  onInteract(): void;
  onDismiss(): void;
  /** Meta intent (M key): not swallowed by the pause state. */
  onToggleMute(): void;
}

/** What a source may read back from the manager. */
export interface InputSourceContext {
  /** True while a DOM overlay owns input (open card): sources must not preventDefault. */
  isPaused(): boolean;
}

export interface InputSource {
  attach(handlers: InputIntentHandlers, context: InputSourceContext): void;
  detach(): void;
}
