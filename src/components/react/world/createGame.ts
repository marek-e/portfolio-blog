// The single dynamic-import boundary for game code: everything that statically imports Phaser
// (this module + the scenes) is reached only via `import('./createGame')` in GameCanvas, so the
// phaser-vendor chunk never loads on any other page — or for mobile visitors to this one.

import Phaser from 'phaser';
import type { WorldBridge } from './bridge';
import { BRIDGE_REGISTRY_KEY } from './bridge';
import { BootScene } from './scenes/BootScene';
import { IslandScene } from './scenes/IslandScene';

export function createGame(parent: HTMLElement, bridge: WorldBridge): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    banner: false,
    backgroundColor: '#1c1c1c',
    // RESIZE keeps the canvas at CSS-pixel viewport size (PRD §6.10; DPR decision 11).
    scale: { mode: Phaser.Scale.RESIZE },
    physics: { default: 'arcade' },
    render: { roundPixels: false },
    scene: [BootScene, IslandScene],
    callbacks: {
      preBoot: (game) => game.registry.set(BRIDGE_REGISTRY_KEY, bridge),
    },
  });
}
