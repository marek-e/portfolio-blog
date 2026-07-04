// Projects World art + map pipeline. Renders every world asset (paintings, character poses,
// landmark and ambient sprites) and generates both Tiled maps from the same coordinates the
// art is drawn from, so painting and collision can never drift apart.
//
//   node scripts/world-art/generate.mjs
//
// Sourcing note (deviation from PRD decision #8, documented in the P0 plan): assets are
// hand-crafted vectors rendered through sharp instead of AI-generated bitmaps — the style
// bible's "smooth rounded vector-like shapes, soft cel shading" is enforced by construction
// (shared palette + helpers), and the whole set regenerates deterministically from source.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import {
  buildIslandSvg,
  coastRadii,
  CX,
  CY,
  SIZE,
  SITES,
  PINES,
  CANOPIES,
  PALMS,
  ROCKS,
} from './island.mjs';
import {
  buildHouseSvg,
  WIDTH as HOUSE_W,
  HEIGHT as HOUSE_H,
  PROPS as HOUSE_PROPS,
} from './house.mjs';
import { buildCharacterPoses } from './characterArt.mjs';
import { buildLandmarks } from './landmarks.mjs';
import { buildAmbient } from './ambient.mjs';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');
const WORLD_DIR = path.join(ROOT, 'public/world');
const MAPS_DIR = path.join(WORLD_DIR, 'maps');

// ---------------------------------------------------------------------------
// Tiled JSON builders
// ---------------------------------------------------------------------------

function tiledMap(widthPx, heightPx, layers, nextObjectId) {
  return {
    type: 'map',
    version: '1.10',
    tiledversion: '1.10.2',
    orientation: 'orthogonal',
    renderorder: 'right-down',
    infinite: false,
    width: widthPx / 32,
    height: heightPx / 32,
    tilewidth: 32,
    tileheight: 32,
    nextlayerid: layers.length + 1,
    nextobjectid: nextObjectId,
    tilesets: [],
    layers,
  };
}

function objectLayer(id, name, objects) {
  return {
    type: 'objectgroup',
    id,
    name,
    opacity: 1,
    visible: true,
    x: 0,
    y: 0,
    draworder: 'topdown',
    objects,
  };
}

function makeIds() {
  let next = 1;
  return () => next++;
}

const rect = (id, name, type, x, y, width, height, properties) => ({
  id,
  name,
  type,
  x: Math.round(x),
  y: Math.round(y),
  width: Math.round(width),
  height: Math.round(height),
  rotation: 0,
  visible: true,
  ...(properties ? { properties } : {}),
});

const point = (id, name, type, x, y, properties) => ({
  id,
  name,
  type,
  point: true,
  x: Math.round(x),
  y: Math.round(y),
  width: 0,
  height: 0,
  rotation: 0,
  visible: true,
  ...(properties ? { properties } : {}),
});

const prop = (name, type, value) => ({ name, type, value });
const str = (name, value) => prop(name, 'string', value);
const int = (name, value) => prop(name, 'int', Math.round(value));
const float = (name, value) => prop(name, 'float', value);

// ---------------------------------------------------------------------------
// Island map
// ---------------------------------------------------------------------------

/** Interpolated coastline radius at angle theta (radians). */
function makeCoastFn() {
  const radii = coastRadii(); // ascending angles over [0, 2π)
  const n = radii.length;
  return (theta) => {
    const t = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const idx = Math.floor((t / (Math.PI * 2)) * n);
    const a = radii[idx % n];
    const b = radii[(idx + 1) % n];
    const spanStart = (idx / n) * Math.PI * 2;
    const frac = (t - spanStart) / ((Math.PI * 2) / n);
    return a.r + (b.r - a.r) * frac;
  };
}

const PIER = { x1: 2088, x2: 2212, y1: 3380, y2: 3800 };
const COAST_INSET = 80;

function buildIslandMap() {
  const coastR = makeCoastFn();
  const walkable = (x, y) => {
    if (x >= PIER.x1 && x <= PIER.x2 && y >= PIER.y1 && y <= PIER.y2) return true;
    const dx = x - CX;
    const dy = y - CY;
    return Math.hypot(dx, dy) <= coastR(Math.atan2(dy, dx)) - COAST_INSET;
  };

  const id = makeIds();
  const collision = [];

  // Water shell: 64px grid cells that are non-walkable but touch a walkable cell.
  const CELL = 64;
  const cols = SIZE / CELL;
  const rows = SIZE / CELL;
  const walkGrid = [];
  for (let row = 0; row < rows; row++) {
    walkGrid.push([]);
    for (let col = 0; col < cols; col++) {
      walkGrid[row].push(walkable(col * CELL + CELL / 2, row * CELL + CELL / 2));
    }
  }
  for (let row = 0; row < rows; row++) {
    let runStart = -1;
    for (let col = 0; col <= cols; col++) {
      let isShell = false;
      if (col < cols && !walkGrid[row][col]) {
        for (let dr = -1; dr <= 1 && !isShell; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < rows && c >= 0 && c < cols && walkGrid[r][c]) {
              isShell = true;
              break;
            }
          }
        }
      }
      if (isShell && runStart === -1) runStart = col;
      if (!isShell && runStart !== -1) {
        collision.push(
          rect(id(), 'water', '', runStart * CELL, row * CELL, (col - runStart) * CELL, CELL)
        );
        runStart = -1;
      }
    }
  }
  // canvas-border backstop
  collision.push(rect(id(), 'border-n', '', 0, 0, SIZE, 64));
  collision.push(rect(id(), 'border-s', '', 0, SIZE - 64, SIZE, 64));
  collision.push(rect(id(), 'border-w', '', 0, 64, 64, SIZE - 128));
  collision.push(rect(id(), 'border-e', '', SIZE - 64, 64, 64, SIZE - 128));

  // buildings & structures
  collision.push(rect(id(), 'house', '', 1856, 896, 384, 288));
  collision.push(rect(id(), 'library', '', 1456, 2240, 248, 220));
  collision.push(rect(id(), 'fountain', '', 1952, 2200, 192, 192));
  collision.push(rect(id(), 'bench', '', 3270, 2446, 140, 76));

  // trees (trunk bases) & rocks
  for (const [x, y] of [...PINES, ...CANOPIES]) {
    collision.push(rect(id(), 'tree', '', x - 26, y - 6, 52, 40));
  }
  for (const [x, y, f] of PALMS) {
    collision.push(rect(id(), 'palm', '', x - 26 + (f === -1 ? 8 : -8), y - 2, 52, 36));
  }
  for (const [x, y, s] of ROCKS) {
    collision.push(rect(id(), 'rock', '', x - 32 * s, y - 18 * s, 64 * s, 40 * s));
  }

  // landmark footprints (player can't walk through the structures; petanque court stays
  // walkable — it's flat ground, y-sorted under the player via sortY)
  const footprint = (site, w, h, name) =>
    collision.push(rect(id(), name, '', site.x - w / 2, site.y - h / 2 + 40, w, h));
  footprint(SITES.elemix, 310, 180, 'landmark-elemix');
  footprint(SITES.minesweeper, 310, 180, 'landmark-minesweeper');
  footprint(SITES.nextArmored, 240, 200, 'landmark-next-armored');
  footprint(SITES.equinox, 260, 130, 'landmark-equinox');

  // zones
  const SIGN = { x: 2160, y: 1252 };
  const projectZone = (site, slug, w = 360, h = 300, offsetY = -190) =>
    rect(id(), `landmark-${slug}`, 'project', site.x - w / 2, site.y - h / 2, w, h, [
      str('slug', slug),
      int('promptOffsetX', 0),
      int('promptOffsetY', offsetY),
    ]);

  const zones = [
    point(id(), 'outside-front-door', 'spawn', 2048, 1320),
    rect(id(), 'house-front-door', 'door', 2000, 1184, 96, 48, [
      str('target', 'house'),
      str('spawn', 'bed'),
    ]),
    projectZone(SITES.elemix, 'elemix'),
    projectZone(SITES.minesweeper, 'minesweeper-llm-arena'),
    projectZone(SITES.nextArmored, 'next-armored', 320, 320, -210),
    projectZone(SITES.equinox, 'equinox-theme', 340, 280, -170),
    projectZone(SITES.petanque, 'petanque', 400, 320, -180),
    rect(id(), 'landmark-personal-portfolio', 'project', SIGN.x - 110, SIGN.y - 110, 220, 200, [
      str('slug', 'personal-portfolio'),
      int('promptOffsetX', 0),
      int('promptOffsetY', -110),
    ]),
    rect(id(), 'library', 'prop', 1456, 2240, 248, 220, [
      str('id', 'library'),
      int('promptOffsetX', 0),
      int('promptOffsetY', -160),
    ]),
    rect(id(), 'bench', 'prop', 3260, 2420, 160, 130, [
      str('id', 'bench'),
      int('promptOffsetX', 0),
      int('promptOffsetY', -80),
    ]),
    // landmark sprite anchors (PRD §9.3) — where the layered sprites render
    point(id(), 'landmark-elemix', 'landmark-anchor', SITES.elemix.x, SITES.elemix.y, [
      str('sprite', 'landmark-elemix'),
      float('scale', 0.78),
    ]),
    point(
      id(),
      'landmark-minesweeper',
      'landmark-anchor',
      SITES.minesweeper.x,
      SITES.minesweeper.y,
      [str('sprite', 'landmark-minesweeper-llm-arena'), float('scale', 0.78)]
    ),
    point(
      id(),
      'landmark-next-armored',
      'landmark-anchor',
      SITES.nextArmored.x,
      SITES.nextArmored.y,
      [str('sprite', 'landmark-next-armored'), float('scale', 0.72)]
    ),
    point(id(), 'landmark-equinox', 'landmark-anchor', SITES.equinox.x, SITES.equinox.y, [
      str('sprite', 'landmark-equinox-theme'),
      float('scale', 0.72),
    ]),
    point(id(), 'landmark-petanque', 'landmark-anchor', SITES.petanque.x, SITES.petanque.y, [
      str('sprite', 'landmark-petanque'),
      float('scale', 0.95),
      int('sortY', SITES.petanque.y - 140),
    ]),
    point(id(), 'landmark-sign', 'landmark-anchor', SIGN.x, SIGN.y, [
      str('sprite', 'landmark-personal-portfolio'),
      float('scale', 0.85),
    ]),
  ];

  return tiledMap(
    SIZE,
    SIZE,
    [objectLayer(1, 'collision', collision), objectLayer(2, 'zones', zones)],
    id()
  );
}

// ---------------------------------------------------------------------------
// House map
// ---------------------------------------------------------------------------

function buildHouseMap() {
  const id = makeIds();
  const p = HOUSE_PROPS;

  const collision = [
    rect(id(), 'wall-north', '', 0, 0, HOUSE_W, 96),
    rect(id(), 'wall-west', '', 0, 96, 32, HOUSE_H - 96),
    rect(id(), 'wall-east', '', HOUSE_W - 32, 96, 32, HOUSE_H - 96),
    rect(id(), 'wall-south-west', '', 32, HOUSE_H - 32, 672, 32),
    rect(id(), 'wall-south-east', '', 832, HOUSE_H - 32, 672, 32),
    rect(id(), 'bed', '', 128, 128, 224, 320),
    rect(id(), 'desk', '', p.desk.x - p.desk.w / 2, p.desk.y - p.desk.h / 2, p.desk.w, p.desk.h),
    rect(
      id(),
      'bookshelf',
      '',
      p.bookshelf.x - p.bookshelf.w / 2,
      p.bookshelf.y - p.bookshelf.h / 2,
      p.bookshelf.w,
      p.bookshelf.h
    ),
    rect(id(), 'plant-sw', '', 40, 890, 90, 90),
    rect(id(), 'plant-ne', '', 1256, 60, 90, 100),
  ];

  const propZone = (key, promptY, pad = 40) =>
    rect(
      id(),
      key,
      'prop',
      p[key].x - p[key].w / 2 - pad,
      p[key].y - p[key].h / 2 - pad,
      p[key].w + pad * 2,
      p[key].h + pad * 2,
      [str('id', key), int('promptOffsetX', 0), int('promptOffsetY', promptY)]
    );

  const zones = [
    point(id(), 'bed', 'spawn', 460, 560),
    rect(id(), 'front-door', 'door', 704, HOUSE_H - 48, 128, 48, [
      str('target', 'island'),
      str('spawn', 'outside-front-door'),
    ]),
    propZone('desk', -140),
    propZone('bookshelf', -200),
    propZone('shoes', -80, 30),
  ];

  return tiledMap(
    HOUSE_W,
    HOUSE_H,
    [objectLayer(1, 'collision', collision), objectLayer(2, 'zones', zones)],
    id()
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

async function render(svg, file, { webpQuality = 90 } = {}) {
  const out = path.join(WORLD_DIR, file);
  const info = await sharp(Buffer.from(svg)).webp({ quality: webpQuality }).toFile(out);
  console.log(`  ${file}  ${(info.size / 1024).toFixed(0)} kB`);
}

async function main() {
  await mkdir(MAPS_DIR, { recursive: true });

  console.log('paintings:');
  await render(buildIslandSvg(), 'island-v2.webp', { webpQuality: 80 });
  await render(buildHouseSvg(), 'house-v2.webp', { webpQuality: 82 });

  console.log('character:');
  const poses = buildCharacterPoses();
  for (const [pose, svg] of Object.entries(poses)) {
    await render(svg, `player-${pose}-v1.webp`);
  }

  console.log('landmarks:');
  for (const [name, svg] of Object.entries(buildLandmarks())) {
    await render(svg, `${name}-v1.webp`);
  }

  console.log('ambient:');
  for (const [name, svg] of Object.entries(buildAmbient())) {
    await render(svg, `${name}-v1.webp`);
  }

  console.log('maps:');
  const island = buildIslandMap();
  await writeFile(path.join(MAPS_DIR, 'island.tmj'), JSON.stringify(island, null, 2) + '\n');
  console.log(
    `  island.tmj  (${island.layers[0].objects.length} collision, ${island.layers[1].objects.length} zones)`
  );
  const house = buildHouseMap();
  await writeFile(path.join(MAPS_DIR, 'house.tmj'), JSON.stringify(house, null, 2) + '\n');
  console.log(
    `  house.tmj  (${house.layers[0].objects.length} collision, ${house.layers[1].objects.length} zones)`
  );
}

await main();
