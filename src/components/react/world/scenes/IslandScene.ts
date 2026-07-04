import Phaser from 'phaser';

/**
 * The island exterior. P0 slice 2: the painting fills the world, camera clamped to its bounds
 * and parked at the center — the player arrives in slice 3.
 */
export class IslandScene extends Phaser.Scene {
  constructor() {
    super('island');
  }

  create(): void {
    const painting = this.add.image(0, 0, 'island').setOrigin(0);
    this.cameras.main.setBounds(0, 0, painting.width, painting.height);
    this.cameras.main.centerOn(painting.width / 2, painting.height / 2);
  }
}
