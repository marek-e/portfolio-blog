// The single dynamic-import boundary for game code: everything that statically imports Phaser
// (this module + the scenes) is reached only via `import('./createGame')` in GameCanvas, so the
// phaser-vendor chunk never loads on any other page — or for mobile visitors to this one.

import Phaser from 'phaser';
import type { WorldBridge } from './bridge';
import { BRIDGE_REGISTRY_KEY } from './bridge';
import type { InputManager } from './input/manager';
import { INPUT_REGISTRY_KEY } from './input/manager';
import { BootScene } from './scenes/BootScene';
import { IslandScene } from './scenes/IslandScene';

export function createGame(
  parent: HTMLElement,
  bridge: WorldBridge,
  inputManager: InputManager
): Phaser.Game {
  // Dev-only collision debug on an unlinked route (plan slice 3).
  const debug = new URLSearchParams(window.location.search).get('debug') === '1';

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    banner: false,
    backgroundColor: '#1c1c1c',
    // RESIZE keeps the canvas at CSS-pixel viewport size (PRD §6.10; DPR decision 11).
    scale: { mode: Phaser.Scale.RESIZE },
    physics: { default: 'arcade', arcade: { debug } },
    render: { roundPixels: false },
    scene: [BootScene, IslandScene],
    callbacks: {
      preBoot: (game) => {
        game.registry.set(BRIDGE_REGISTRY_KEY, bridge);
        game.registry.set(INPUT_REGISTRY_KEY, inputManager);
      },
    },
  });

  if (debug) {
    (window as unknown as Record<string, unknown>).__worldGame = game;
  }

  return game;
}
