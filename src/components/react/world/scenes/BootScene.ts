import Phaser from 'phaser';
import type { WorldBridge } from '../bridge';
import { BRIDGE_REGISTRY_KEY } from '../bridge';
import { isIntroDone } from '../state';

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
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, () => {
      bridge.emit('boot:error');
    });

    this.load.image('island', '/world/island-v2.webp');
    this.load.image('house', '/world/house-v2.webp');
    this.load.tilemapTiledJSON('island-map', '/world/maps/island.tmj');
    this.load.tilemapTiledJSON('house-map', '/world/maps/house.tmj');

    for (const pose of ['front', 'back', 'left', 'right']) {
      this.load.image(`player-${pose}`, `/world/player-${pose}-v1.webp`);
    }
    for (const landmark of [
      'landmark-elemix',
      'landmark-minesweeper-llm-arena',
      'landmark-next-armored',
      'landmark-equinox-theme',
      'landmark-petanque',
      'landmark-personal-portfolio',
    ]) {
      this.load.image(landmark, `/world/${landmark}-v1.webp`);
    }
    for (const ambient of [
      'sparkle',
      'checkmark',
      'butterfly-1',
      'butterfly-2',
      'gull-1',
      'gull-2',
      'smoke',
      'leaf',
    ]) {
      this.load.image(ambient, `/world/${ambient}-v1.webp`);
    }
  }

  create(): void {
    const bridge = this.registry.get(BRIDGE_REGISTRY_KEY) as WorldBridge;

    // First visit begins in the house intro; returning visitors spawn outside the front
    // door (PRD §6.4) — the island's default spawn point.
    const offEnter = bridge.on('game:enter', () => {
      this.scene.start(isIntroDone() ? 'island' : 'house');
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, offEnter);

    bridge.emit('boot:ready');
  }
}
