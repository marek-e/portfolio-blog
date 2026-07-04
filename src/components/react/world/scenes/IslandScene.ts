import Phaser from 'phaser';
import type { WorldBridge } from '../bridge';
import { BRIDGE_REGISTRY_KEY } from '../bridge';
import type { SceneTransitionData } from './WorldSceneBase';
import { WorldSceneBase } from './WorldSceneBase';
import type { ProjectZone } from './tiled';
import { readLandmarkAnchors, readProjectZones } from './tiled';

/** How far beyond the zone edge the player can stand and still interact. */
const INTERACTION_RADIUS = 64;

interface TrackedZone {
  zone: ProjectZone;
  centerX: number;
  centerY: number;
  radius: number;
  prompt: Phaser.GameObjects.Text;
}

/**
 * The island exterior: full-size painting, camera at zoom 1 (1 painting px = 1 CSS px,
 * PRD §6.10) following the player within the painting bounds. Project zones from the Tiled
 * map show a floating interact prompt in range; interacting opens the DOM card overlay
 * through the bridge (the full §6.6 affordances arrive with real art at P1).
 */
export class IslandScene extends WorldSceneBase {
  private trackedZones: TrackedZone[] = [];
  private zoneInRange: TrackedZone | null = null;

  constructor() {
    super('island');
  }

  create(data: SceneTransitionData): void {
    const { painting, map } = this.buildWorld('island', 'island-map', data, 'outside-front-door');
    this.cameras.main.setBounds(0, 0, painting.width, painting.height);
    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);

    this.buildLandmarkSprites(map);
    this.buildProjectZones(map);

    const bridge = this.registry.get(BRIDGE_REGISTRY_KEY) as WorldBridge;
    const offInteract = this.inputManager.onInteract(() => {
      if (this.zoneInRange) {
        bridge.emit('card:open', { slug: this.zoneInRange.zone.slug });
      }
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      offInteract();
      this.trackedZones = [];
      this.zoneInRange = null;
    });
  }

  update(): void {
    super.update();
    if (!this.player) return;

    this.zoneInRange = null;
    for (const tracked of this.trackedZones) {
      const inRange =
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          tracked.centerX,
          tracked.centerY
        ) <= tracked.radius;
      tracked.prompt.setVisible(inRange);
      if (inRange) this.zoneInRange = tracked;
    }
  }

  /** Layered landmark sprites above the painting (PRD §6.6), y-sorted against the player. */
  private buildLandmarkSprites(map: Phaser.Tilemaps.Tilemap): void {
    for (const anchor of readLandmarkAnchors(map, 'zones')) {
      this.add
        .image(anchor.x, anchor.y, anchor.sprite)
        .setScale(anchor.scale)
        .setDepth(anchor.sortY ?? anchor.y);
    }
  }

  private buildProjectZones(map: Phaser.Tilemaps.Tilemap): void {
    for (const zone of readProjectZones(map, 'zones')) {
      const centerX = zone.x + zone.width / 2;
      const centerY = zone.y + zone.height / 2;

      const prompt = this.add
        .text(centerX + zone.promptOffset.x, centerY + zone.promptOffset.y, 'E', {
          fontFamily: 'sans-serif',
          fontSize: '24px',
          color: '#1c1c1c',
          backgroundColor: '#ffffff',
          padding: { x: 10, y: 6 },
        })
        .setOrigin(0.5)
        .setDepth(10000)
        .setVisible(false);

      this.trackedZones.push({
        zone,
        centerX,
        centerY,
        radius: Math.max(zone.width, zone.height) / 2 + INTERACTION_RADIUS,
        prompt,
      });
    }
  }
}
