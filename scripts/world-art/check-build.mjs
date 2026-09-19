import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { URL } from 'node:url';
import console from 'node:console';

const root = new URL('../../', import.meta.url);
const dist = new URL('dist/', root);
const files = await readdir(new URL('_astro/', dist));
const engine = files.find((name) => /^phaser-vendor\..*\.js$/.test(name));
assert(engine, 'Phaser must have a separate vendor chunk');
const gameplay = files.filter((name) => /^(game|audio|ProjectsWorld)\..*\.js$/.test(name));
const assets = new Set(['island-v1.json', 'house-v1.json', 'teaser-v1.webp']);
for (const name of ['island', 'house']) {
  const map = JSON.parse(await readFile(new URL(`public/world/${name}-v1.json`, root), 'utf8'));
  for (const layer of map.layers) {
    if (layer.image) assets.add(path.basename(layer.image));
    for (const object of layer.objects ?? []) {
      const image = object.properties?.find((property) => property.name === 'asset')?.value;
      if (image) assets.add(path.basename(image));
    }
  }
}
for (const direction of ['down', 'up', 'left', 'right']) assets.add(`avatar-${direction}-v1.png`);
for (const sound of ['step', 'interact', 'open', 'close', 'discovery', 'celebrate', 'door'])
  assets.add(`${sound}-v1.wav`);
let bytes = 0;
for (const name of [engine, ...gameplay])
  bytes += gzipSync(await readFile(new URL(`_astro/${name}`, dist))).length;
for (const name of assets) {
  const file = await readFile(new URL(`world/${name}`, dist));
  bytes += name.endsWith('.json') ? gzipSync(file).length : file.length;
}
assert(bytes <= 4_000_000, `Gameplay payload exceeds 4 MB: ${bytes}`);
for (const locale of ['', 'en/']) {
  const page = await readFile(new URL(`${locale}projects/world/index.html`, dist), 'utf8');
  assert(page.includes('/world/og-v1.webp'));
  assert(!page.includes(engine), 'Engine must not be eagerly preloaded by the static page');
  const list = await readFile(new URL(`${locale}projects/index.html`, dist), 'utf8');
  assert(list.includes(`/${locale}projects/petanque`));
  assert(list.includes(`/${locale}projects/world`));
  for (const route of ['', 'projects/', 'blog/', 'contact/']) {
    const html = await readFile(new URL(`${locale}${route}index.html`, dist), 'utf8');
    assert(!html.includes(engine));
    for (const chunk of gameplay) assert(!html.includes(chunk), `${route} loads game code`);
  }
}
console.log(
  `Gameplay preload: ${bytes.toLocaleString()} bytes, including teaser and uncompressed raster/SFX assets; music excluded.`
);
console.log('Localized SEO, list parity, and static-page game chunk isolation passed.');
