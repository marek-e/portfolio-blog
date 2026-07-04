import type { SceneTransitionData } from './WorldSceneBase';
import { WorldSceneBase } from './WorldSceneBase';

/**
 * The island exterior: full-size painting, camera at zoom 1 (1 painting px = 1 CSS px,
 * PRD §6.10) following the player within the painting bounds.
 */
export class IslandScene extends WorldSceneBase {
  constructor() {
    super('island');
  }

  create(data: SceneTransitionData): void {
    const painting = this.buildWorld('island', 'island-map', data, 'outside-front-door');
    this.cameras.main.setBounds(0, 0, painting.width, painting.height);
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
  }
}
