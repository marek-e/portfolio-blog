import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { WorldBridge } from './bridge';
import type { InputManager } from './input/manager';

interface GameCanvasProps {
  bridge: WorldBridge;
  inputManager: InputManager;
  /** Owned by ProjectsWorld so it can refocus the game after DOM overlays close. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Translated aria-label for the application region (PRD §6.9). */
  label: string;
}

/**
 * Mounts the Phaser game into a full-size container. Game code is loaded through a dynamic
 * import so it only ever downloads here, after the mobile gate has passed. Teardown destroys
 * the game instance — mandatory because ClientRouter view transitions unmount the island on
 * client-side navigation.
 */
export function GameCanvas({ bridge, inputManager, containerRef, label }: GameCanvasProps) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let game: { destroy(removeCanvas: boolean): void } | null = null;
    let cancelled = false;

    // Engine import or renderer creation failing (no WebGL and no Canvas2D) surfaces the
    // same friendly error path as a preload failure (PRD §6.12).
    void import('./createGame')
      .then(({ createGame }) => {
        if (cancelled) return;
        game = createGame(container, bridge, inputManager);
      })
      .catch(() => {
        if (!cancelled) bridge.emit('boot:error');
      });

    return () => {
      cancelled = true;
      game?.destroy(true);
      game = null;
    };
  }, [bridge, inputManager, containerRef]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="application"
      aria-label={label}
      className="absolute inset-0 overflow-hidden outline-none"
    />
  );
}
