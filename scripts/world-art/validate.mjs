import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import console from 'node:console';
import path from 'node:path';
import sharp from 'sharp';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = path.join(root, 'public/world');
const json = async (name) => JSON.parse(await readFile(path.join(out, name), 'utf8'));
const manifest = await json('manifest-v1.json');
const contentSlugs = (await readdir(path.join(root, 'src/content/projects/en'))).map((name) =>
  name.replace(/\.mdx?$/, '').toLowerCase()
);
const maps = { 'island-v1': await json('island-v1.json'), 'house-v1': await json('house-v1.json') };
const props = (object) =>
  Object.fromEntries((object.properties ?? []).map((p) => [p.name, p.value]));
const objects = (map, name) => map.layers.find((layer) => layer.name === name).objects;
for (const asset of Object.values(manifest.assets)) {
  const file = path.join(root, 'public', asset.src);
  const data = await readFile(file);
  assert.equal(createHash('sha256').update(data).digest('hex'), asset.sha256);
  if (asset.width) {
    const metadata = await sharp(data).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    if (asset.src.endsWith('.png')) assert(metadata.hasAlpha);
  }
}
for (const [name, map] of Object.entries(maps)) {
  const width = map.width * map.tilewidth,
    height = map.height * map.tileheight;
  const collisions = objects(map, 'collisions');
  const ids = map.layers.flatMap((l) => l.objects ?? []).map((o) => o.id);
  assert.equal(new Set(ids).size, ids.length);
  const background = map.layers.find((layer) => layer.type === 'imagelayer');
  await readFile(path.join(out, background.image));
  const radius = 18,
    step = 16,
    cols = width / step,
    rows = height / step;
  const blocked = new Uint8Array(cols * rows);
  for (let gy = 0; gy < rows; gy++)
    for (let gx = 0; gx < cols; gx++) {
      const x = gx * step + step / 2,
        y = gy * step + step / 2;
      blocked[gy * cols + gx] = collisions.some(
        (c) =>
          x + radius > c.x &&
          x - radius < c.x + c.width &&
          y + radius > c.y &&
          y - radius < c.y + c.height
      )
        ? 1
        : 0;
    }
  const index = (x, y) => Math.floor(y / step) * cols + Math.floor(x / step);
  const spawn = objects(map, 'spawns').find((s) => s.name === 'default');
  assert.equal(blocked[index(spawn.x, spawn.y)], 0, `${name} blocked default spawn`);
  const visited = new Uint8Array(cols * rows),
    queue = [index(spawn.x, spawn.y)];
  visited[queue[0]] = 1;
  for (let q = 0; q < queue.length; q++) {
    const current = queue[q],
      x = current % cols,
      y = Math.floor(current / cols);
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const next = ny * cols + nx;
      if (!blocked[next] && !visited[next]) {
        visited[next] = 1;
        queue.push(next);
      }
    }
  }
  for (const s of objects(map, 'spawns'))
    assert(visited[index(s.x, s.y)], `${name}/${s.name} unreachable spawn`);
  const reachable = (object) =>
    queue.some((i) => {
      const x = (i % cols) * step + step / 2,
        y = Math.floor(i / cols) * step + step / 2;
      return (
        x >= object.x &&
        x <= object.x + object.width &&
        y >= object.y &&
        y <= object.y + object.height
      );
    });
  for (const zone of objects(map, 'project-zones')) {
    assert(contentSlugs.includes(props(zone).slug));
    assert(reachable(zone), `${zone.name} unreachable`);
  }
  for (const prop of objects(map, 'props').filter((p) => props(p).interactable)) {
    assert(
      queue.some(
        (i) =>
          Math.hypot(
            (i % cols) * step + step / 2 - prop.x - prop.width / 2,
            Math.floor(i / cols) * step + step / 2 - prop.y - prop.height / 2
          ) <= 110
      ),
      `${prop.name} interaction unreachable`
    );
  }
  for (const door of objects(map, 'doors')) {
    assert(reachable(door), `${door.name} unreachable`);
    const target = props(door);
    assert(objects(maps[target.targetMap], 'spawns').some((s) => s.name === target.targetSpawn));
  }
  if (name === 'island-v1') {
    for (let x = 0; x < cols; x++)
      assert(!visited[x] && !visited[(rows - 1) * cols + x], 'Water escape north/south');
    for (let y = 0; y < rows; y++)
      assert(!visited[y * cols] && !visited[y * cols + cols - 1], 'Water escape west/east');
    assert.equal(objects(map, 'project-zones').length, manifest.sites.length);
    for (const anchor of objects(map, 'landmark-anchor')) {
      const p = props(anchor);
      const asset = Object.values(manifest.assets).find((a) => a.src === p.asset);
      assert(asset);
      assert.equal(asset.width, p.width);
      assert.equal(asset.height, p.height);
      assert.equal(p.anchorX, 0.5);
      assert.equal(p.anchorY, 1);
    }
  }
  console.log(
    `${name}: ${queue.length} reachable cells, spawns, doors, project zones and bounds passed`
  );
}
for (const name of [
  'step',
  'interact',
  'open',
  'close',
  'discovery',
  'celebrate',
  'door',
  'lofi-garden',
]) {
  const data = await readFile(path.join(out, `${name}-v1.wav`));
  assert.equal(data.toString('ascii', 0, 4), 'RIFF');
  assert.equal(data.readUInt32LE(40), data.length - 44);
  let peak = 0;
  for (let i = 44; i < data.length; i += 2) peak = Math.max(peak, Math.abs(data.readInt16LE(i)));
  assert(peak > 100 && peak < 32767, `${name} silent or clipped`);
}
console.log(
  `${Object.keys(manifest.assets).length} asset hashes, sizes, alpha and audio checks passed`
);
