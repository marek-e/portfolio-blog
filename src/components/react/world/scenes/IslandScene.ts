import Phaser from 'phaser';
import type { WorldBridge } from '../bridge';
import { getDiscovered } from '../state';
import { createIslandAmbience } from './ambience';
import type { SceneTransitionData } from './WorldSceneBase';
import { WorldSceneBase } from './WorldSceneBase';
import { readLandmarkAnchors, readProjectZones, readPropZones } from './tiled';

const MARKER_DEPTH = 9_000;

interface LandmarkMarker {
  sparkle: Phaser.GameObjects.Image;
  checkmark: Phaser.GameObjects.Image;
}

/**
 * The island exterior: full-size painting at camera zoom 1 (PRD §6.10), landmark sprites
 * layered above it with the §6.6 affordances — proximity glow, floating keycap prompt,
 * idle sparkle on undiscovered landmarks, checkmark on discovered ones.
 */
export class IslandScene extends WorldSceneBase {
  private landmarkSprites = new Map<string, Phaser.GameObjects.Image>();
  private markers = new Map<string, LandmarkMarker>();

  constructor() {
    super('island');
  }

  create(data: SceneTransitionData): void {
    const { painting, map } = this.buildWorld('island', 'island-map', data, 'outside-front-door');
    this.cameras.main.setBounds(0, 0, painting.width, painting.height);
    this.startCameraFollow();

    this.buildLandmarkSprites(map);
    this.buildProjectZones(map, this.bridge);
    this.buildPropZones(map, this.bridge);
    this.applyDiscovered(getDiscovered());

    if (!this.reducedMotion) {
      createIslandAmbience(this);
    }

    const offDiscovery = this.bridge.on('discovery:changed', ({ discovered }) => {
      this.applyDiscovered(discovered);
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      offDiscovery();
      this.landmarkSprites.clear();
      this.markers.clear();
    });
  }

  /** Layered landmark sprites above the painting (PRD §6.6), y-sorted against the player. */
  private buildLandmarkSprites(map: Phaser.Tilemaps.Tilemap): void {
    for (const anchor of readLandmarkAnchors(map, 'zones')) {
      const sprite = this.add
        .image(anchor.x, anchor.y, anchor.sprite)
        .setScale(anchor.scale)
        .setDepth(anchor.sortY ?? anchor.y);
      sprite.setData('baseScale', anchor.scale);
      this.landmarkSprites.set(anchor.sprite, sprite);
    }
  }

  private buildProjectZones(map: Phaser.Tilemaps.Tilemap, bridge: WorldBridge): void {
    for (const zone of readProjectZones(map, 'zones')) {
      const centerX = zone.x + zone.width / 2;
      const centerY = zone.y + zone.height / 2;
      const markerX = centerX + zone.promptOffset.x;
      const markerY = centerY + zone.promptOffset.y;
      const sprite = this.landmarkSprites.get(`landmark-${zone.slug}`);

      // Idle sparkle (undiscovered) / checkmark (discovered), swapped by applyDiscovered.
      const sparkle = this.add.image(markerX, markerY, 'sparkle').setDepth(MARKER_DEPTH);
      if (!this.reducedMotion) {
        this.tweens.add({
          targets: sparkle,
          alpha: { from: 1, to: 0.35 },
          scale: { from: 1, to: 0.7 },
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
      const checkmark = this.add
        .image(markerX, markerY, 'checkmark')
        .setDepth(MARKER_DEPTH)
        .setScale(0.7)
        .setAlpha(0.9)
        .setVisible(false);
      this.markers.set(zone.slug, { sparkle, checkmark });

      this.interactions.add({
        x: centerX,
        y: centerY,
        width: zone.width,
        height: zone.height,
        promptOffset: zone.promptOffset,
        onInteract: () => bridge.emit('card:open', { slug: zone.slug }),
        onEnter: () => sprite && this.setGlow(sprite, true),
        onExit: () => sprite && this.setGlow(sprite, false),
      });
    }
  }

  private buildPropZones(map: Phaser.Tilemaps.Tilemap, bridge: WorldBridge): void {
    for (const zone of readPropZones(map, 'zones')) {
      this.interactions.add({
        x: zone.x + zone.width / 2,
        y: zone.y + zone.height / 2,
        width: zone.width,
        height: zone.height,
        promptOffset: zone.promptOffset,
        onInteract: () => bridge.emit('prop:open', { id: zone.id }),
      });
    }
  }

  /** Soft glow/outline on the landmark sprite while in interaction range (PRD §6.6). */
  private setGlow(sprite: Phaser.GameObjects.Image, on: boolean): void {
    if (this.renderer.type === Phaser.WEBGL) {
      if (on) {
        sprite.postFX.addGlow(0xfff6d8, 4, 0);
      } else {
        sprite.postFX.clear();
      }
    }
    // Canvas fallback (and extra juice on WebGL): a slight scale-up from the anchor scale
    const baseScale = (sprite.getData('baseScale') as number) ?? 1;
    const targetScale = baseScale * (on ? 1.04 : 1);
    if (this.reducedMotion) {
      sprite.setScale(targetScale);
    } else {
      this.tweens.add({ targets: sprite, scale: targetScale, duration: 160, ease: 'Sine.easeOut' });
    }
  }

  private applyDiscovered(discovered: string[]): void {
    for (const [slug, marker] of this.markers) {
      const isDiscovered = discovered.includes(slug);
      marker.sparkle.setVisible(!isDiscovered);
      marker.checkmark.setVisible(isDiscovered);
    }
  }
}
