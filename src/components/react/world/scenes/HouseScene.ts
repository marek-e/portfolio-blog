import Phaser from 'phaser';
import { isIntroDone, setIntroDone } from '../state';
import type { SceneTransitionData } from './WorldSceneBase';
import { WorldSceneBase } from './WorldSceneBase';
import { readPropZones } from './tiled';

/** Matches the door gap in the south wall of the house map/painting. */
const DOOR_GLOW_RECT = { x: 704, y: 950, width: 128, height: 64 };

/**
 * The one-room house interior — spawn scene and implicit tutorial (PRD §6.4): a movement
 * hint until the first input, three interactable props, and a glowing front door once the
 * player has moved. The intro-done flag is set the first time the player exits through the
 * front door. The painting is smaller than most viewports, so the camera applies the
 * §6.10 cover-zoom exception, recomputed on resize.
 */
export class HouseScene extends WorldSceneBase {
  private moveHintVisible = false;
  private doorGlow: Phaser.GameObjects.Rectangle | null = null;

  constructor() {
    super('house');
  }

  create(data: SceneTransitionData): void {
    const { painting, map } = this.buildWorld('house', 'house-map', data, 'bed');
    this.cameras.main.setBounds(0, 0, painting.width, painting.height);
    this.startCameraFollow();

    for (const zone of readPropZones(map, 'zones')) {
      this.interactions.add({
        x: zone.x + zone.width / 2,
        y: zone.y + zone.height / 2,
        width: zone.width,
        height: zone.height,
        promptOffset: zone.promptOffset,
        onInteract: () => this.bridge.emit('prop:open', { id: zone.id }),
      });
    }

    if (!isIntroDone()) {
      this.moveHintVisible = true;
      this.bridge.emit('hint', { id: 'move', visible: true });
    }
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.moveHintVisible) {
        this.bridge.emit('hint', { id: 'move', visible: false });
        this.moveHintVisible = false;
      }
    });

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

  update(time: number, delta: number): void {
    super.update(time, delta);
    if (!this.moveHintVisible) return;

    const vector = this.inputManager.getMoveVector();
    if (vector.x !== 0 || vector.y !== 0) {
      // First input: the hint has done its job; the door starts inviting (PRD §6.4).
      this.moveHintVisible = false;
      this.bridge.emit('hint', { id: 'move', visible: false });
      this.showDoorGlow();
    }
  }

  protected onDoorUsed(target: string): void {
    if (target === 'island' && !isIntroDone()) {
      // Movement + door use completed = tutorial done (PRD §6.4).
      setIntroDone();
    }
  }

  private showDoorGlow(): void {
    if (this.doorGlow || isIntroDone()) return;
    this.doorGlow = this.add
      .rectangle(
        DOOR_GLOW_RECT.x + DOOR_GLOW_RECT.width / 2,
        DOOR_GLOW_RECT.y + DOOR_GLOW_RECT.height / 2,
        DOOR_GLOW_RECT.width,
        DOOR_GLOW_RECT.height,
        0xffe9a0,
        0.28
      )
      .setDepth(8_000);
    if (this.reducedMotion) {
      this.doorGlow.setAlpha(0.6);
      return;
    }
    this.tweens.add({
      targets: this.doorGlow,
      alpha: { from: 0.9, to: 0.35 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
