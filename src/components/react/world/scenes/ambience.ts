import Phaser from 'phaser';

// Island ambience layers (PRD §8.2): cloud/light drift, drifting leaves, butterflies over
// the flower patches, gulls over the sea, chimney smoke, water shimmer. Everything here is
// decorative — it is skipped entirely under prefers-reduced-motion (PRD §6.9).

const CLOUD_TEXTURE = 'ambience-cloud';
const SHIMMER_TEXTURE = 'ambience-shimmer';
const AMBIENCE_DEPTH = 20_000; // clouds float above everything
const GROUND_FX_DEPTH = 500; // shimmer/smoke sit above the painting, below actors

const BUTTERFLY_HOMES = [
  { x: 1850, y: 1700 },
  { x: 2300, y: 2150 },
  { x: 2650, y: 2850 },
];

const GULL_PATHS = [
  { x: 2150, y: 3650, rx: 750, ry: 260, duration: 26_000 },
  { x: 3250, y: 800, rx: 500, ry: 220, duration: 21_000 },
];

const SHIMMER_SPOTS = [
  { x: 2150, y: 3690 },
  { x: 1250, y: 3480 },
  { x: 3050, y: 3390 },
  { x: 3620, y: 2400 },
  { x: 3520, y: 1350 },
  { x: 600, y: 2500 },
  { x: 700, y: 1600 },
  { x: 1500, y: 570 },
  { x: 2700, y: 530 },
];

const CHIMNEY = { x: 2172, y: 880 };

export function createIslandAmbience(scene: Phaser.Scene): void {
  ensureTextures(scene);
  createClouds(scene);
  createLeaves(scene);
  createButterflies(scene);
  createGulls(scene);
  createChimneySmoke(scene);
  createWaterShimmer(scene);
}

function ensureTextures(scene: Phaser.Scene): void {
  if (!scene.textures.exists(CLOUD_TEXTURE)) {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(150, 160, 110);
    g.fillCircle(280, 120, 130);
    g.fillCircle(420, 150, 120);
    g.fillCircle(300, 190, 140);
    g.generateTexture(CLOUD_TEXTURE, 560, 300);
    g.destroy();
  }
  if (!scene.textures.exists(SHIMMER_TEXTURE)) {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(60, 12, 120, 14);
    g.fillEllipse(40, 26, 60, 8);
    g.generateTexture(SHIMMER_TEXTURE, 120, 34);
    g.destroy();
  }
}

/** Large translucent shapes scrolled slowly — the PRD's cloud/light drift technique. */
function createClouds(scene: Phaser.Scene): void {
  const configs = [
    { y: 700, scale: 2.6, alpha: 0.1, duration: 150_000, delay: 0 },
    { y: 2000, scale: 3.4, alpha: 0.08, duration: 190_000, delay: 40_000 },
    { y: 3200, scale: 2.2, alpha: 0.11, duration: 130_000, delay: 90_000 },
  ];
  for (const c of configs) {
    const cloud = scene.add
      .image(-900, c.y, CLOUD_TEXTURE)
      .setScale(c.scale)
      .setAlpha(c.alpha)
      .setDepth(AMBIENCE_DEPTH);
    scene.tweens.add({
      targets: cloud,
      x: 5000,
      duration: c.duration,
      delay: c.delay,
      repeat: -1,
    });
  }
}

/** Gentle leaf/pollen drift, emitted around the camera so particles are always near view. */
function createLeaves(scene: Phaser.Scene): void {
  const emitter = scene.add.particles(0, 0, 'leaf', {
    frequency: 700,
    lifespan: 7000,
    speedX: { min: 15, max: 45 },
    speedY: { min: 10, max: 30 },
    rotate: { start: 0, end: 360 },
    scale: { min: 0.7, max: 1.2 },
    alpha: { start: 0.9, end: 0 },
    emitZone: {
      type: 'random',
      source: new Phaser.Geom.Rectangle(-900, -600, 1800, 1200),
      quantity: 1,
    },
  });
  emitter.setDepth(AMBIENCE_DEPTH - 1);
  scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
    const cam = scene.cameras.main;
    emitter.setPosition(cam.midPoint.x, cam.midPoint.y);
  });
}

function flapWings(
  scene: Phaser.Scene,
  sprite: Phaser.GameObjects.Image,
  frames: [string, string],
  ms: number
): void {
  let flap = false;
  scene.time.addEvent({
    delay: ms,
    loop: true,
    callback: () => {
      flap = !flap;
      sprite.setTexture(frames[flap ? 1 : 0]);
    },
  });
}

function createButterflies(scene: Phaser.Scene): void {
  for (const home of BUTTERFLY_HOMES) {
    const butterfly = scene.add
      .image(home.x, home.y, 'butterfly-1')
      .setDepth(GROUND_FX_DEPTH + 4000);
    flapWings(scene, butterfly, ['butterfly-1', 'butterfly-2'], 160);

    const wander = () => {
      scene.tweens.add({
        targets: butterfly,
        x: home.x + Phaser.Math.Between(-170, 170),
        y: home.y + Phaser.Math.Between(-110, 110),
        duration: Phaser.Math.Between(1800, 3600),
        ease: 'Sine.easeInOut',
        onComplete: wander,
      });
    };
    wander();
  }
}

function createGulls(scene: Phaser.Scene): void {
  for (const p of GULL_PATHS) {
    const path = new Phaser.Curves.Path();
    path.add(new Phaser.Curves.Ellipse(p.x, p.y, p.rx, p.ry));
    const gull = scene.add.follower(path, p.x + p.rx, p.y, 'gull-1');
    gull.setDepth(AMBIENCE_DEPTH - 2);
    flapWings(scene, gull, ['gull-1', 'gull-2'], 240);
    gull.startFollow({ duration: p.duration, repeat: -1, rotateToPath: false });
  }
}

function createChimneySmoke(scene: Phaser.Scene): void {
  scene.time.addEvent({
    delay: 1500,
    loop: true,
    callback: () => {
      const puff = scene.add
        .image(CHIMNEY.x + Phaser.Math.Between(-6, 6), CHIMNEY.y, 'smoke')
        .setScale(0.6)
        .setAlpha(0.75)
        .setDepth(GROUND_FX_DEPTH + 4200);
      scene.tweens.add({
        targets: puff,
        y: CHIMNEY.y - 130,
        x: puff.x + Phaser.Math.Between(10, 40),
        scale: 1.7,
        alpha: 0,
        duration: 3200,
        ease: 'Sine.easeOut',
        onComplete: () => puff.destroy(),
      });
    },
  });
}

/** Subtle shoreline shimmer — staggered alpha pulses on soft white streaks. */
function createWaterShimmer(scene: Phaser.Scene): void {
  SHIMMER_SPOTS.forEach((spot, i) => {
    const shimmer = scene.add
      .image(spot.x, spot.y, SHIMMER_TEXTURE)
      .setAlpha(0)
      .setDepth(GROUND_FX_DEPTH);
    scene.tweens.add({
      targets: shimmer,
      alpha: 0.32,
      duration: 2400,
      delay: i * 420,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  });
}
