import Phaser from 'phaser';
import type { WorldBridge } from '../bridge';
import { BRIDGE_REGISTRY_KEY } from '../bridge';
import type { InputManager } from '../input/manager';
import { INPUT_REGISTRY_KEY } from '../input/manager';
import { REDUCED_MOTION_REGISTRY_KEY } from '../motion';
import { InteractionZones } from './interactions';
import { readDoors, readSpawns } from './tiled';

/** Walk speed in world-px/s — PRD §6.10 starting value, confirmed at P1 (island crossing ≈30 s). */
const WALK_SPEED = 150;
const TRANSITION_FADE_MS = 400;
/** Source poses are 192×256; rendered at half size ≈ 96×128 (PRD §8.2). */
const PLAYER_SCALE = 0.5;
/** Feet-anchored arcade body, in source-texture pixels (scaled by PLAYER_SCALE). */
const PLAYER_BODY = { width: 112, height: 56, offsetX: 40, offsetY: 196 };

export interface SceneTransitionData {
  /** Named spawn point to appear at; scenes fall back to their default. */
  spawn?: string;
}

function facingTexture(x: number, y: number): string {
  if (Math.abs(x) > Math.abs(y)) return x > 0 ? 'player-right' : 'player-left';
  return y > 0 ? 'player-front' : 'player-back';
}

/**
 * Shared plumbing for the walkable scenes (island, house): painting + Tiled map loading,
 * collision bodies, player with procedural walk motion, interaction zones, door overlap
 * zones with guarded fade transitions, and the per-frame movement read from the input
 * manager.
 */
export abstract class WorldSceneBase extends Phaser.Scene {
  protected player!: Phaser.Physics.Arcade.Sprite;
  protected inputManager!: InputManager;
  protected interactions!: InteractionZones;
  protected bridge!: WorldBridge;
  protected reducedMotion = false;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private transitioning = false;
  private walkTime = 0;
  private footstepTimer = 0;

  /** Builds the common world; returns the painting (camera sizing) and map (scene extras). */
  protected buildWorld(
    paintingKey: string,
    mapKey: string,
    data: SceneTransitionData,
    defaultSpawn: string
  ): { painting: Phaser.GameObjects.Image; map: Phaser.Tilemaps.Tilemap } {
    this.transitioning = false;
    this.inputManager = this.registry.get(INPUT_REGISTRY_KEY) as InputManager;
    this.bridge = this.registry.get(BRIDGE_REGISTRY_KEY) as WorldBridge;
    this.reducedMotion = this.registry.get(REDUCED_MOTION_REGISTRY_KEY) === true;
    this.interactions = new InteractionZones(this, this.reducedMotion);

    const painting = this.add.image(0, 0, paintingKey).setOrigin(0);
    this.physics.world.setBounds(0, 0, painting.width, painting.height);

    const map = this.make.tilemap({ key: mapKey });
    const spawns = readSpawns(map, 'zones');
    const spawn = spawns.get(data.spawn ?? defaultSpawn) ?? {
      x: painting.width / 2,
      y: painting.height / 2,
    };

    this.playerShadow = this.add.ellipse(spawn.x, spawn.y, 52, 16, 0x1e281e, 0.18);
    this.player = this.physics.add.sprite(spawn.x, spawn.y, 'player-front');
    this.player.setScale(PLAYER_SCALE);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER_BODY.width, PLAYER_BODY.height);
    body.setOffset(PLAYER_BODY.offsetX, PLAYER_BODY.offsetY);
    body.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.buildCollisionBodies(map));
    this.buildDoors(map);

    const offInteract = this.inputManager.onInteract(() => {
      this.interactions.triggerActive();
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, offInteract);

    this.cameras.main.fadeIn(TRANSITION_FADE_MS);
    return { painting, map };
  }

  update(_time: number, delta: number): void {
    if (!this.player) return;
    const vector = this.inputManager.getMoveVector();
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vector.x * WALK_SPEED, vector.y * WALK_SPEED);

    const moving = vector.x !== 0 || vector.y !== 0;
    if (moving) {
      this.player.setTexture(facingTexture(vector.x, vector.y));
      this.footstepTimer += delta;
      if (this.footstepTimer >= 340) {
        this.footstepTimer = 0;
        this.bridge.emit('sfx', { id: 'footstep' });
      }
      if (!this.reducedMotion) {
        this.walkTime += delta;
        // procedural walk bob: subtle squash-and-stretch synced to a step cadence
        const bob = Math.sin(this.walkTime * 0.018);
        this.player.setScale(PLAYER_SCALE * (1 - 0.015 * bob), PLAYER_SCALE * (1 + 0.025 * bob));
        this.player.setRotation(0.02 * vector.x * bob);
      }
    } else if (this.walkTime !== 0) {
      this.walkTime = 0;
      this.player.setScale(PLAYER_SCALE);
      this.player.setRotation(0);
    }

    const feetY = this.player.y + this.player.displayHeight / 2;
    // y-sorted depth against the landmark sprites (feet position)
    this.player.setDepth(feetY);
    this.playerShadow.setPosition(this.player.x, feetY - 4).setDepth(feetY - 1);

    this.interactions.update(this.player.x, this.player.y);
  }

  /** Camera follow with gentle lerp — instant under prefers-reduced-motion (PRD §6.9). */
  protected startCameraFollow(): void {
    const lerp = this.reducedMotion ? 1 : 0.1;
    this.cameras.main.startFollow(this.player, false, lerp, lerp);
  }

  /** Hook for scene-specific reactions to a door being used (e.g. the intro-done flag). */
  protected onDoorUsed(target: string): void {
    void target;
  }

  private buildCollisionBodies(map: Phaser.Tilemaps.Tilemap): Phaser.Physics.Arcade.StaticGroup {
    const group = this.physics.add.staticGroup();
    for (const obj of map.getObjectLayer('collision')?.objects ?? []) {
      const rect = this.add
        .rectangle(obj.x! + obj.width! / 2, obj.y! + obj.height! / 2, obj.width, obj.height)
        .setVisible(false);
      group.add(rect);
    }
    return group;
  }

  private buildDoors(map: Phaser.Tilemaps.Tilemap): void {
    for (const door of readDoors(map, 'zones')) {
      const zone = this.add.zone(
        door.x + door.width / 2,
        door.y + door.height / 2,
        door.width,
        door.height
      );
      this.physics.add.existing(zone, true);
      this.physics.add.overlap(this.player, zone, () => {
        this.startTransition(door.target, door.spawn);
      });
    }
  }

  /** Fade out, then switch scenes — guarded so a re-overlap mid-fade can't double-fire. */
  private startTransition(target: string, spawn: string): void {
    if (this.transitioning) return;
    this.transitioning = true;
    this.onDoorUsed(target);
    this.bridge.emit('sfx', { id: 'door' });
    this.cameras.main.fadeOut(TRANSITION_FADE_MS);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(target, { spawn } satisfies SceneTransitionData);
    });
  }
}
