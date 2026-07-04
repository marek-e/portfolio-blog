import Phaser from 'phaser';
import type { InputManager } from '../input/manager';
import { INPUT_REGISTRY_KEY } from '../input/manager';

/** Walk speed in world-px/s — PRD §6.10 starting value, tuned at P1. */
const WALK_SPEED = 150;

/**
 * The island exterior: painting as base layer, invisible collision bodies from the Tiled map,
 * player with 8-directional movement, camera following with a gentle lerp.
 */
export class IslandScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private inputManager!: InputManager;

  constructor() {
    super('island');
  }

  create(): void {
    this.inputManager = this.registry.get(INPUT_REGISTRY_KEY) as InputManager;

    const painting = this.add.image(0, 0, 'island').setOrigin(0);
    this.physics.world.setBounds(0, 0, painting.width, painting.height);
    this.cameras.main.setBounds(0, 0, painting.width, painting.height);

    const map = this.make.tilemap({ key: 'island-map' });
    const spawns = this.readSpawns(map);
    const spawn = spawns.get('island-center') ?? { x: painting.width / 2, y: painting.height / 2 };

    this.player = this.add.rectangle(spawn.x, spawn.y, 48, 64, 0x2f6db8);
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.buildCollisionBodies(map));

    this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
  }

  update(): void {
    const vector = this.inputManager.getMoveVector();
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vector.x * WALK_SPEED, vector.y * WALK_SPEED);
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

  private readSpawns(map: Phaser.Tilemaps.Tilemap): Map<string, { x: number; y: number }> {
    const spawns = new Map<string, { x: number; y: number }>();
    for (const obj of map.getObjectLayer('zones')?.objects ?? []) {
      if (obj.type === 'spawn' && obj.name) {
        spawns.set(obj.name, { x: obj.x!, y: obj.y! });
      }
    }
    return spawns;
  }
}
