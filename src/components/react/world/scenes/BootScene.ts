import Phaser from 'phaser';
import type { WorldBridge } from '../bridge';
import { BRIDGE_REGISTRY_KEY } from '../bridge';

/**
 * Preloads every world asset, driving the DOM loading bar through the bridge, then waits for
 * the explicit "Enter the island" click (the audio-unlock gesture, PRD §6.2) to start the game.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload(): void {
    const bridge = this.registry.get(BRIDGE_REGISTRY_KEY) as WorldBridge;

    this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => {
      bridge.emit('boot:progress', { value });
    });

    this.load.image('island', '/world/island-v1.webp');
    this.load.image('house', '/world/house-v1.webp');
    this.load.tilemapTiledJSON('island-map', '/world/maps/island.tmj');
    this.load.tilemapTiledJSON('house-map', '/world/maps/house.tmj');
  }

  create(): void {
    const bridge = this.registry.get(BRIDGE_REGISTRY_KEY) as WorldBridge;

    // First visit begins in the house (PRD §6.4); return-visit spawning arrives with P1 state.
    const offEnter = bridge.on('game:enter', () => {
      this.scene.start('house');
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, offEnter);

    bridge.emit('boot:ready');
  }
}
