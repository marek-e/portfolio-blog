import Phaser from 'phaser';
import type { SceneTransitionData } from './WorldSceneBase';
import { WorldSceneBase } from './WorldSceneBase';

/**
 * The one-room house interior — the spawn scene. Its painting is smaller than most viewports,
 * so the camera applies the PRD §6.10 small-scene exception: zoom rises to the cover ratio so
 * the painting always fills the canvas, recomputed on resize.
 */
export class HouseScene extends WorldSceneBase {
  constructor() {
    super('house');
  }

  create(data: SceneTransitionData): void {
    const { painting } = this.buildWorld('house', 'house-map', data, 'bed');
    this.cameras.main.setBounds(0, 0, painting.width, painting.height);
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);

    const applyCoverZoom = () => {
      const zoom = Math.max(this.scale.width / painting.width, this.scale.height / painting.height);
      this.cameras.main.setZoom(zoom);
    };
    applyCoverZoom();

    this.scale.on(Phaser.Scale.Events.RESIZE, applyCoverZoom);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, applyCoverZoom);
    });
  }
}
