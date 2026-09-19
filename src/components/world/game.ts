import type PhaserTypes from 'phaser';
import { createWorldInput, type WorldIntent } from './input';

export type WorldOptions = {
  reducedMotion: boolean;
  introDone: boolean;
  discovered: string[];
  onProgress: (progress: number) => void;
  onReady: () => void;
  onError: () => void;
  onUnsupported?: () => void;
  onInteract: (interaction: { type: 'project' | 'prop'; id: string }) => void;
  onExitHouse: () => void;
  onMove: () => void;
  onSound: (name: string) => void;
  onMute: () => void;
  canvasLabel: string;
  interactionLabel?: string;
};

export type WorldController = {
  enter: () => void;
  setPaused: (paused: boolean) => void;
  setDiscovered: (discovered: string[]) => void;
  setIntent: (intent: Partial<WorldIntent>) => void;
  destroy: () => void;
};

type Property = { name: string; value: string | number | boolean };
type MapObject = {
  name: string;
  type?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties?: Property[];
};
type WorldMap = {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  properties?: Property[];
  layers: {
    name: string;
    type: string;
    image?: string;
    x?: number;
    y?: number;
    objects?: MapObject[];
  }[];
};
type PointOfInterest = {
  object: MapObject;
  id: string;
  type: 'project' | 'prop' | 'door';
  x: number;
  y: number;
  radius: number;
  promptX: number;
  promptY: number;
  sprite?: PhaserTypes.GameObjects.Image;
  glow?: PhaserTypes.GameObjects.Image | PhaserTypes.GameObjects.Ellipse;
  marker: PhaserTypes.GameObjects.Text;
};

const properties = (object: { properties?: Property[] }) =>
  Object.fromEntries((object.properties ?? []).map(({ name, value }) => [name, value]));
const assetUrl = (path: string) =>
  path.startsWith('/') ? path : `/world/${path.replace(/^\.\//, '')}`;
const objects = (map: WorldMap, layer: string) =>
  map.layers.find((entry) => entry.name === layer)?.objects ?? [];

export async function createWorld(
  parent: HTMLElement,
  options: WorldOptions
): Promise<WorldController> {
  if (document.readyState === 'loading')
    await new Promise<void>((resolve) =>
      document.addEventListener('DOMContentLoaded', () => resolve(), { once: true })
    );
  const Phaser = (await import('phaser')).default;
  const input = createWorldInput(options.onMute);
  let entered = false;
  let paused = false;
  let destroyed = false;
  let failed = false;
  let moved = false;
  let discovered = new Set(options.discovered);
  let current: WorldScene | undefined;
  let game: PhaserTypes.Game | undefined;
  const disposeGame = () => {
    const instance = game;
    game = undefined;
    if (!instance) return;
    instance.canvas?.removeEventListener('blur', canvasBlur);
    instance.destroy(true);
    queueMicrotask(() => {
      instance.step(0, 0);
    });
  };
  const fail = () => {
    if (destroyed || failed) return;
    failed = true;
    clearTimeout(loadTimeout);
    input.setEnabled(false);
    disposeGame();
    options.onError();
  };
  const loadTimeout = window.setTimeout(fail, 15000);
  const activateScene = (scene: WorldScene) => {
    current = scene;
  };
  const updateInput = () =>
    input.setEnabled(entered && !paused && !document.hidden && !failed && !current?.transitioning);

  class Boot extends Phaser.Scene {
    constructor() {
      super('Boot');
    }
    preload() {
      this.load.on('loaderror', fail);
      this.load.on('progress', (progress: number) => options.onProgress(progress * 0.15));
      this.load.json('island', '/world/island-v1.json');
      this.load.json('house', '/world/house-v1.json');
    }
    create() {
      if (failed || destroyed) return;
      const images = new Set<string>();
      for (const name of ['island', 'house']) {
        const map = this.cache.json.get(name) as WorldMap;
        for (const layer of map.layers) {
          if (layer.image) images.add(assetUrl(layer.image));
          for (const object of layer.objects ?? []) {
            const asset = properties(object).asset;
            if (typeof asset === 'string') images.add(assetUrl(asset));
          }
        }
      }
      for (const path of images) this.load.image(path, path);
      for (const direction of ['down', 'up', 'left', 'right']) {
        this.load.image(`avatar-${direction}`, `/world/avatar-${direction}-v1.png`);
        images.add(`avatar-${direction}`);
      }
      this.load.off('progress');
      this.load.on('progress', (progress: number) => options.onProgress(0.15 + progress * 0.85));
      this.load.once('complete', () => {
        if (failed || destroyed) return;
        if ([...images].some((key) => !this.textures.exists(key))) {
          fail();
          return;
        }
        try {
          this.scene.start(options.introDone ? 'Island' : 'House', {
            spawn: options.introDone ? 'house-exit' : 'default',
          });
        } catch {
          fail();
        }
      });
      this.load.start();
    }
  }

  class WorldScene extends Phaser.Scene {
    mapName: 'house' | 'island';
    map!: WorldMap;
    player!: PhaserTypes.Physics.Arcade.Image;
    avatar!: PhaserTypes.GameObjects.Image;
    shadow!: PhaserTypes.GameObjects.Ellipse;
    prompt!: PhaserTypes.GameObjects.Text;
    points: PointOfInterest[] = [];
    nearest?: PointOfInterest;
    transitioning = false;
    worldWidth = 0;
    worldHeight = 0;
    lastStep = 0;
    walkTime = 0;
    ambient: {
      image: PhaserTypes.GameObjects.Shape;
      x: number;
      y: number;
      phase: number;
      kind: number;
    }[] = [];
    constructor(key: string, mapName: 'house' | 'island') {
      super(key);
      this.mapName = mapName;
    }
    create(data: { spawn?: string } = {}) {
      try {
        activateScene(this);
        this.transitioning = false;
        this.points = [];
        this.ambient = [];
        this.nearest = undefined;
        this.map = this.cache.json.get(this.mapName) as WorldMap;
        this.worldWidth = this.map.width * this.map.tilewidth;
        this.worldHeight = this.map.height * this.map.tileheight;
        const background = this.map.layers.find((layer) => layer.type === 'imagelayer');
        if (background?.image) {
          const painting = this.add
            .image(0, 0, assetUrl(background.image))
            .setOrigin(0)
            .setDepth(-10000);
          this.worldWidth = painting.width;
          this.worldHeight = painting.height;
        }
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
        const blockers = this.physics.add.staticGroup();
        for (const rect of objects(this.map, 'collisions')) {
          const width = rect.width ?? 0;
          const height = rect.height ?? 0;
          if (!width || !height) continue;
          const blocker = this.add.zone(rect.x + width / 2, rect.y + height / 2, width, height);
          blockers.add(blocker);
        }
        const spawns = objects(this.map, 'spawns');
        const spawn = spawns.find((entry) => entry.name === data.spawn) ??
          spawns[0] ?? { x: this.worldWidth / 2, y: this.worldHeight / 2 };
        if (!this.textures.exists('world-body')) {
          const graphic = this.make.graphics({ x: 0, y: 0 });
          graphic.fillStyle(0xffffff).fillRect(0, 0, 30, 22).generateTexture('world-body', 30, 22);
          graphic.destroy();
        }
        this.player = this.physics.add
          .image(spawn.x, spawn.y, 'world-body')
          .setVisible(false)
          .setCollideWorldBounds(true);
        this.player.setSize(28, 18);
        this.physics.add.collider(this.player, blockers);
        this.shadow = this.add.ellipse(spawn.x, spawn.y, 42, 14, 0x263e39, 0.2);
        this.avatar = this.add.image(spawn.x, spawn.y, 'avatar-down').setOrigin(0.5, 1);
        this.avatar.setScale(110 / this.avatar.height);
        const sprites = new Map<string, PhaserTypes.GameObjects.Image>();
        for (const object of [
          ...objects(this.map, 'landmark-anchor'),
          ...objects(this.map, 'props'),
          ...objects(this.map, 'doors'),
        ]) {
          const props = properties(object);
          if (typeof props.asset !== 'string') continue;
          const sprite = this.add.image(object.x, object.y, assetUrl(props.asset));
          sprite.setOrigin(Number(props.anchorX ?? 0.5), Number(props.anchorY ?? 1));
          if (props.width && props.height)
            sprite.setDisplaySize(Number(props.width), Number(props.height));
          else if (object.width && object.height)
            sprite.setDisplaySize(object.width, object.height);
          sprite.setDepth(Number(props.sortY ?? object.y));
          sprites.set(String(props.slug ?? props.id ?? object.name), sprite);
        }
        for (const [layer, type] of [
          ['project-zones', 'project'],
          ['props', 'prop'],
          ['doors', 'door'],
        ] as const) {
          for (const object of objects(this.map, layer)) {
            const props = properties(object);
            if (
              type === 'prop' &&
              !props.interactable &&
              !['desk', 'bookshelf', 'shoes', 'library', 'bench'].includes(object.name)
            )
              continue;
            const id = String(props.slug ?? props.id ?? object.name);
            const sprite = sprites.get(id);
            const x = object.x + (object.width ?? 0) / 2;
            const y = object.y + (object.height ?? 0) / 2;
            const promptX = (sprite?.x ?? x) + Number(props.promptOffsetX ?? 0);
            const promptY =
              (sprite?.y ?? y) + Number(props.promptOffsetY ?? -(sprite?.displayHeight ?? 40) - 22);
            const marker = this.add
              .text(promptX, promptY, '', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '22px',
                color: '#fef8cd',
                stroke: '#385f58',
                strokeThickness: 4,
              })
              .setOrigin(0.5)
              .setDepth(10000);
            let glow: PhaserTypes.GameObjects.Image | PhaserTypes.GameObjects.Ellipse | undefined;
            if (sprite) {
              glow = this.add
                .image(sprite.x, sprite.y, sprite.texture.key)
                .setOrigin(sprite.originX, sprite.originY)
                .setScale(sprite.scaleX * 1.045, sprite.scaleY * 1.045)
                .setTintFill(0xfff1b6)
                .setAlpha(0)
                .setDepth(sprite.depth - 0.5);
            }
            if (!glow)
              glow = this.add
                .ellipse(x, y, (object.width ?? 60) + 18, (object.height ?? 30) + 12, 0xffedac, 0)
                .setStrokeStyle(4, 0xffedac, 0.8)
                .setAlpha(0)
                .setDepth(y - 1);
            this.points.push({
              object,
              id,
              type,
              x,
              y,
              radius: Number(props.radius ?? props.interactionRadius ?? 110),
              promptX,
              promptY,
              sprite,
              glow,
              marker,
            });
          }
        }
        this.prompt = this.add
          .text(0, 0, options.interactionLabel ?? 'E · Enter', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#fff9e9',
            backgroundColor: '#284f49',
            padding: { x: 12, y: 7 },
          })
          .setOrigin(0.5)
          .setDepth(10001)
          .setVisible(false);
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.resize();
        this.cameras.main.startFollow(
          this.player,
          false,
          options.reducedMotion ? 1 : 0.12,
          options.reducedMotion ? 1 : 0.12
        );
        this.cameras.main.centerOn(spawn.x, spawn.y);
        this.scale.on('resize', this.resize, this);
        this.events.once('shutdown', () => {
          this.scale.off('resize', this.resize, this);
          input.clear();
        });
        if (!options.reducedMotion) this.createAmbient();
        if (entered && !options.reducedMotion) this.cameras.main.fadeIn(400, 30, 53, 51);
        clearTimeout(loadTimeout);
        updateInput();
        if (!entered) {
          options.onProgress(1);
          options.onReady();
        }
      } catch {
        fail();
      }
    }
    resize() {
      this.cameras.main.setZoom(
        this.mapName === 'house'
          ? Math.max(1, this.scale.width / this.worldWidth, this.scale.height / this.worldHeight)
          : 1
      );
    }
    createAmbient() {
      const count = this.mapName === 'island' ? 42 : 10;
      for (let index = 0; index < count; index++) {
        const x = (index * 587 + 220) % this.worldWidth;
        const y = (index * 379 + 140) % this.worldHeight;
        const kind = this.mapName === 'house' ? 0 : index % 5;
        const image =
          kind === 1
            ? this.add.ellipse(x, y, 220 + index * 2, 70, 0xffffff, 0.085)
            : kind === 2
              ? this.add.ellipse(x, y, 34, 3, 0xe4f7e7, 0.35)
              : kind === 3
                ? this.add.triangle(x, y, 0, 7, 8, 1, 16, 7, 0xffffef, 0.65)
                : this.add.ellipse(
                    x,
                    y,
                    kind === 4 ? 9 : 4,
                    kind === 4 ? 5 : 4,
                    kind === 4 ? 0xf7d37a : 0xffefbc,
                    0.5
                  );
        image.setDepth(kind === 2 ? -9000 : 9000);
        this.ambient.push({ image, x, y, phase: index * 1.7, kind });
      }
      if (this.mapName === 'island') {
        const door = objects(this.map, 'doors')[0];
        if (door) {
          for (let index = 0; index < 5; index++) {
            const x = door.x + 50;
            const y = door.y - 220;
            const image = this.add.ellipse(x, y, 25, 18, 0xfff9e9, 0.16).setDepth(9000);
            this.ambient.push({ image, x, y, phase: index * 1.3, kind: 5 });
          }
        }
      }
    }
    update(time: number, delta: number) {
      if (!this.player || failed || destroyed) return;
      const intent = input.read();
      const active = entered && !paused && !this.transitioning;
      const x = active ? intent.x : 0;
      const y = active ? intent.y : 0;
      this.player.setVelocity(x * 150, y * 150);
      const moving = x !== 0 || y !== 0;
      if (moving) {
        if (!moved) {
          moved = true;
          options.onMove();
        }
        const direction =
          Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : y > 0 ? 'down' : 'up';
        this.avatar.setTexture(`avatar-${direction}`);
        this.walkTime += delta;
        if (
          time - this.lastStep > 380 &&
          this.player.body &&
          (Math.abs(this.player.body.velocity.x) > 0 || Math.abs(this.player.body.velocity.y) > 0)
        ) {
          this.lastStep = time;
          options.onSound('step');
        }
      }
      const bob = !options.reducedMotion && moving ? Math.sin(this.walkTime / 90) * 3 : 0;
      this.avatar
        .setPosition(this.player.x, this.player.y - 3 + bob)
        .setDepth(this.player.y + 1)
        .setRotation(!options.reducedMotion && moving ? Math.sin(this.walkTime / 130) * 0.025 : 0);
      this.shadow
        .setPosition(this.player.x, this.player.y)
        .setDepth(this.player.y - 1)
        .setScale(1 + bob * 0.018);
      let nearest: PointOfInterest | undefined;
      let distance = Infinity;
      for (const point of this.points) {
        const candidate = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          point.x,
          point.y
        );
        if (candidate <= point.radius && candidate < distance) {
          nearest = point;
          distance = candidate;
        }
      }
      this.nearest = active ? nearest : undefined;
      for (const point of this.points) {
        const selected = this.nearest === point;
        const known = discovered.has(point.id);
        const idle = point.type === 'project' && !known;
        const pulse = options.reducedMotion ? 1 : 0.65 + Math.sin(time / 500) * 0.35;
        point.glow?.setAlpha(selected ? 0.5 : point.type === 'door' && moved ? pulse * 0.24 : 0);
        point.marker.setText(point.type === 'project' ? (known ? '✓' : '✦') : '');
        point.marker
          .setVisible(!selected && point.type === 'project')
          .setAlpha(idle ? 0.65 + pulse * 0.35 : 0.9);
        point.marker.setY(
          point.promptY + (!options.reducedMotion && idle ? Math.sin(time / 650) * 4 : 0)
        );
      }
      this.prompt.setVisible(Boolean(this.nearest));
      if (this.nearest) {
        this.prompt.setPosition(
          this.nearest.promptX,
          this.nearest.promptY + (!options.reducedMotion ? Math.sin(time / 350) * 3 : 0)
        );
        if (intent.interact) this.interact(this.nearest);
      }
      for (const item of this.ambient) {
        const phase = time / 1600 + item.phase;
        if (item.kind === 5) {
          const progress = (time / 4500 + item.phase) % 1;
          item.image
            .setPosition(item.x + progress * 36, item.y - progress * 100)
            .setAlpha((1 - progress) * 0.2)
            .setScale(0.7 + progress);
        } else if (item.kind === 1 || item.kind === 3) {
          item.image.x = (item.x + time * (item.kind === 1 ? 0.006 : 0.024)) % this.worldWidth;
          item.image.y = item.y + Math.sin(phase) * 18;
        } else {
          item.image
            .setPosition(item.x + Math.sin(phase) * 14, item.y + Math.cos(phase * 0.7) * 8)
            .setAlpha(0.15 + (Math.sin(phase) + 1) * 0.15);
        }
      }
    }
    interact(point: PointOfInterest) {
      if (point.type !== 'door') {
        input.clear();
        options.onSound('interact');
        options.onInteract({ type: point.type, id: point.id });
        return;
      }
      this.transitioning = true;
      updateInput();
      this.player.setVelocity(0);
      options.onSound('door');
      const props = properties(point.object);
      const next = () => {
        if (destroyed || failed) return;
        if (this.mapName === 'house') options.onExitHouse();
        const target = String(props.targetMap ?? (this.mapName === 'house' ? 'island' : 'house'));
        this.scene.start(target.toLowerCase().includes('island') ? 'Island' : 'House', {
          spawn: String(props.targetSpawn ?? 'return'),
        });
      };
      if (options.reducedMotion) next();
      else {
        this.cameras.main.once('camerafadeoutcomplete', next);
        this.cameras.main.fadeOut(400, 30, 53, 51);
      }
    }
  }

  const visibility = () => {
    input.clear();
    if (document.hidden) game?.loop.sleep();
    else if (!failed && !destroyed) game?.loop.wake();
    updateInput();
  };
  const canvasBlur = () => input.clear();
  const startGame = (renderer: number) => {
    game = new Phaser.Game({
      type: renderer,
      parent,
      width: parent.clientWidth || window.innerWidth,
      height: parent.clientHeight || window.innerHeight,
      backgroundColor: '#8fbebd',
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      input: { keyboard: false, mouse: false, touch: false },
      audio: { noAudio: true },
      loader: { imageLoadType: 'HTMLImageElement' },
      render: { antialias: true, roundPixels: false },
      scene: [Boot, new WorldScene('House', 'house'), new WorldScene('Island', 'island')],
      callbacks: {
        preBoot(booting) {
          game = booting;
        },
        postBoot(booted) {
          booted.canvas.setAttribute('role', 'application');
          booted.canvas.setAttribute('aria-label', options.canvasLabel);
          booted.canvas.setAttribute('tabindex', '0');
          booted.canvas.addEventListener('blur', canvasBlur);
          if (document.hidden) booted.loop.sleep();
        },
      },
    });
  };
  try {
    startGame(Phaser.AUTO);
  } catch {
    disposeGame();
    try {
      startGame(Phaser.CANVAS);
    } catch {
      failed = true;
      clearTimeout(loadTimeout);
      input.destroy();
      disposeGame();
      (options.onUnsupported ?? options.onError)();
    }
  }
  document.addEventListener('visibilitychange', visibility);
  return {
    enter() {
      if (destroyed || failed) return;
      entered = true;
      updateInput();
      game?.canvas.focus({ preventScroll: true });
    },
    setPaused(value) {
      paused = value;
      current?.player?.setVelocity(0);
      updateInput();
    },
    setDiscovered(value) {
      discovered = new Set(value);
    },
    setIntent(intent) {
      input.setIntent(intent);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      clearTimeout(loadTimeout);
      input.destroy();
      document.removeEventListener('visibilitychange', visibility);
      disposeGame();
      current = undefined;
    },
  };
}
