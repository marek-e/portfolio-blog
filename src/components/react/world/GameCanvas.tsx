import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { WorldBridge } from './bridge';

interface GameCanvasProps {
  bridge: WorldBridge;
  /** Owned by ProjectsWorld so it can refocus the game after DOM overlays close. */
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Mounts the Phaser game into a full-size container. Game code is loaded through a dynamic
 * import so it only ever downloads here, after the mobile gate has passed. Teardown destroys
 * the game instance — mandatory because ClientRouter view transitions unmount the island on
 * client-side navigation.
 */
export function GameCanvas({ bridge, containerRef }: GameCanvasProps) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let game: { destroy(removeCanvas: boolean): void } | null = null;
    let cancelled = false;

    void import('./createGame').then(({ createGame }) => {
      if (cancelled) return;
      game = createGame(container, bridge);
    });

    return () => {
      cancelled = true;
      game?.destroy(true);
      game = null;
    };
  }, [bridge, containerRef]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="absolute inset-0 overflow-hidden outline-none"
    />
  );
}
