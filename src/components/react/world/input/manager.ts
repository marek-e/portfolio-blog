import type { InputSource, MoveVector } from './types';

const ZERO: MoveVector = { x: 0, y: 0 };

/** Registry key under which `createGame` exposes the input manager to scenes. */
export const INPUT_REGISTRY_KEY = 'world-input';

/**
 * Single owner of "world input paused" (plan decision 6). While paused, all intents are
 * swallowed: move reads zero, interact/dismiss are dropped — the open card's Dialog owns
 * Esc natively (PRD §6.11 "Esc precedence"), so game code never double-handles it.
 */
export function createInputManager() {
  let moveVector: MoveVector = ZERO;
  let paused = false;
  const sources: InputSource[] = [];
  const interactListeners = new Set<() => void>();
  const dismissListeners = new Set<() => void>();

  const handlers = {
    onMove(vector: MoveVector) {
      moveVector = vector;
    },
    onInteract() {
      if (paused) return;
      interactListeners.forEach((listener) => listener());
    },
    onDismiss() {
      if (paused) return;
      dismissListeners.forEach((listener) => listener());
    },
  };

  const context = { isPaused: () => paused };

  return {
    addSource(source: InputSource): void {
      sources.push(source);
      source.attach(handlers, context);
    },

    getMoveVector(): MoveVector {
      return paused ? ZERO : moveVector;
    },

    onInteract(listener: () => void): () => void {
      interactListeners.add(listener);
      return () => {
        interactListeners.delete(listener);
      };
    },

    onDismiss(listener: () => void): () => void {
      dismissListeners.add(listener);
      return () => {
        dismissListeners.delete(listener);
      };
    },

    setPaused(value: boolean): void {
      paused = value;
    },

    isPaused(): boolean {
      return paused;
    },

    destroy(): void {
      sources.forEach((source) => source.detach());
      sources.length = 0;
      interactListeners.clear();
      dismissListeners.clear();
    },
  };
}

export type InputManager = ReturnType<typeof createInputManager>;
