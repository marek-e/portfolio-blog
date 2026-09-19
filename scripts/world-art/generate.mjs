import sharp from 'sharp';
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { Buffer } from 'node:buffer';
import console from 'node:console';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { format } from 'prettier';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = path.join(root, 'public/world');
await mkdir(out, { recursive: true });
const assets = {};
const palette = {
  ink: '#334e50',
  grass: '#a7c890',
  grassLight: '#bfd5a2',
  sand: '#eee0b3',
  water: '#76b9c1',
  wood: '#b77855',
  cream: '#fff1d3',
  coral: '#db8973',
  dark: '#517978',
};
const { ink, grass, grassLight, sand, water, wood, cream, coral, dark } = palette;
let seed = 481516;
const random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
const rect = (x, y, w, h, fill, r = 0, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const ellipse = (x, y, rx, ry, fill, extra = '') =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, width = 6) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
const shape = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
const group = (x, y, s, body) => `<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><pattern id="grain" width="19" height="23" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r="1" fill="${ink}" opacity=".055"/><circle cx="14" cy="17" r="1" fill="white" opacity=".12"/></pattern></defs>${body}</svg>`;
const save = async (name, w, h, body, format = 'png') => {
  const source = svg(w, h, body);
  await writeFile(path.join(out, `${name}.svg`), source);
  const file = `${name}.${format}`;
  let pipeline = sharp(Buffer.from(source));
  pipeline =
    format === 'webp'
      ? pipeline.webp({ quality: 88, effort: 6 })
      : pipeline.png({ compressionLevel: 9 });
  await pipeline.toFile(path.join(out, file));
  assets[name] = { src: `/world/${file}`, width: w, height: h, source: `/world/${name}.svg` };
};
const tree = (x, y, s = 1) =>
  group(
    x,
    y,
    s,
    ellipse(12, 8, 57, 20, '#4d72542b') +
      rect(-8, -49, 16, 55, wood, 5) +
      ellipse(0, -72, 51, 52, '#648e6c') +
      ellipse(-19, -84, 34, 38, '#7aa578') +
      ellipse(10, -102, 28, 26, '#91b785') +
      shape(
        'M-31 -66Q-10 -50 23 -68',
        'none',
        'stroke="#527d61" stroke-width="4" stroke-linecap="round"'
      )
  );
const bush = (x, y, s = 1) =>
  group(
    x,
    y,
    s,
    ellipse(6, 3, 35, 10, '#4d725425') +
      ellipse(-15, -13, 21, 21, '#789c70') +
      ellipse(13, -16, 25, 25, '#85aa79') +
      ellipse(0, -28, 18, 18, '#99bb82')
  );
const flower = (x, y, color = cream) =>
  line(x, y, x, y - 13, '#799664', 3) +
  ellipse(x - 4, y - 14, 4, 4, color) +
  ellipse(x + 4, y - 14, 4, 4, color) +
  ellipse(x, y - 19, 4, 4, color) +
  ellipse(x, y - 14, 2.5, 2.5, '#d0aa62');
const shore =
  'M820 440C1140 260 1560 370 1900 310C2310 220 2540 350 2810 480C3090 510 3440 750 3510 1080C3690 1360 3630 1620 3700 1950C3750 2260 3550 2470 3500 2800C3430 3150 3140 3430 2800 3500C2460 3680 2210 3540 1920 3680C1530 3730 1230 3570 960 3420C640 3320 440 3060 440 2720C270 2360 400 2050 340 1750C270 1400 430 1220 460 970C450 700 590 520 820 440Z';
const sites = [
  { slug: 'personal-portfolio', name: 'portfolio-sign', x: 1250, y: 1150, w: 200, h: 174 },
  { slug: 'elemix', name: 'elemix-scaffolding', x: 2730, y: 1000, w: 460, h: 480 },
  { slug: 'minesweeper-llm-arena', name: 'minesweeper-mine', x: 3300, y: 2070, w: 460, h: 420 },
  { slug: 'next-armored', name: 'next-armored-tower', x: 2700, y: 3100, w: 460, h: 540 },
  { slug: 'equinox-theme', name: 'equinox-sundial', x: 1500, y: 3270, w: 460, h: 400 },
  { slug: 'petanque', name: 'petanque-court', x: 750, y: 2340, w: 540, h: 420 },
];
const slugs = (await readdir(path.join(root, 'src/content/projects/en'))).map((f) =>
  f.replace(/\.mdx?$/, '').toLowerCase()
);
for (const site of sites)
  if (!slugs.includes(site.slug)) throw new Error(`Unknown project slug ${site.slug}`);
const center = { x: 1990, y: 2030 };
const home = { x: 1020, y: 1110, w: 430, h: 380 };
const paths = sites.map(
  (s) => `M${center.x} ${center.y}Q${(center.x + s.x) / 2} ${s.y + 180} ${s.x} ${s.y + 100}`
);
const pathBody = paths
  .map(
    (d) =>
      shape(d, 'none', `stroke="#c3b68c" stroke-width="164" stroke-linecap="round"`) +
      shape(d, 'none', `stroke="${sand}" stroke-width="144" stroke-linecap="round"`)
  )
  .join('');
let island = rect(0, 0, 4096, 4096, water);
for (let i = 0; i < 620; i++) {
  const x = random() * 4096,
    y = random() * 4096;
  island += shape(
    `M${x} ${y}q12 8 24 0t24 0`,
    'none',
    'stroke="#d2ece5" stroke-width="3" opacity=".25"'
  );
}
island +=
  shape(shore, '#5ba1ac', 'stroke="#5ba1ac" stroke-width="120"') +
  shape(shore, '#b3d8ce', 'stroke="#b3d8ce" stroke-width="70"') +
  shape(shore, sand) +
  `<g transform="translate(2048 2048) scale(.946) translate(-2048 -2048)">${shape(shore, grass)}</g>`;
island +=
  ellipse(1850, 2030, 850, 700, grassLight, 'opacity=".24"') +
  ellipse(2700, 1050, 500, 310, '#94b885', 'opacity=".35"') +
  pathBody;
for (const s of sites)
  island +=
    ellipse(s.x, s.y + 30, s.w * 0.68, 180, '#91b17e', 'opacity=".42"') +
    ellipse(s.x, s.y + 30, s.w * 0.62, 153, '#dce0ac');
island +=
  ellipse(center.x, center.y, 285, 205, '#c7b890') +
  ellipse(center.x, center.y - 5, 270, 193, '#ece0bc');
for (let i = 0; i < 18; i++) {
  const a = (i * Math.PI) / 9;
  island += ellipse(center.x + Math.cos(a) * 240, center.y + Math.sin(a) * 165, 16, 10, '#d0c4a0');
}
const props = [
  { name: 'library', x: 1535, y: 1800, width: 240, height: 110, solid: true, interactable: true },
  { name: 'bench', x: 700, y: 3160, width: 140, height: 50, solid: true, interactable: true },
  {
    name: 'fountain',
    x: center.x - 95,
    y: center.y - 120,
    width: 190,
    height: 110,
    solid: true,
    interactable: false,
  },
];
const trees = [];
const distantFromPath = (x, y) =>
  paths.every((_, i) => {
    const s = sites[i];
    for (let t = 0; t <= 1; t += 0.025) {
      const px = (1 - t) ** 2 * center.x + (2 * (1 - t) * t * (center.x + s.x)) / 2 + t * t * s.x;
      const py = (1 - t) ** 2 * center.y + 2 * (1 - t) * t * (s.y + 180) + t * t * (s.y + 100);
      if (Math.hypot(x - px, y - py) < 180) return false;
    }
    return true;
  });
for (let i = 0; i < 550; i++) {
  const x = 590 + random() * 2860,
    y = 640 + random() * 2760;
  if (
    ((x - 2020) / 1430) ** 2 + ((y - 2050) / 1450) ** 2 > 0.97 ||
    !distantFromPath(x, y) ||
    Math.hypot(x - home.x, y - home.y) < 450 ||
    sites.some((s) => Math.hypot(x - s.x, y - s.y) < 400)
  )
    continue;
  if (i % 4 === 0) trees.push({ x: Math.round(x), y: Math.round(y), s: 1.1 + random() * 0.75 });
  else if (i % 3 === 0) island += bush(x, y, 0.7 + random() * 0.4);
  else island += flower(x, y, i % 2 ? cream : '#e8a28b');
}
for (const t of trees.sort((a, b) => a.y - b.y)) {
  island += tree(t.x, t.y, t.s);
  props.push({ name: 'tree', x: t.x - 17, y: t.y - 12, width: 34, height: 24, solid: true });
}
const cottage =
  ellipse(220, 350, 217, 29, '#526d4930') +
  rect(52, 155, 326, 181, cream, 12) +
  rect(65, 290, 300, 45, '#dec59b', 4) +
  shape('M28 168L106 40H335L411 168Z', coral) +
  shape('M28 168H411L411 185H28Z', '#b86f60') +
  shape('M106 40L183 168H28Z', '#ebac85') +
  rect(288, 15, 37, 66, '#cbb18d', 3) +
  rect(280, 14, 51, 14, cream, 3) +
  rect(182, 228, 64, 108, wood, 24) +
  ellipse(233, 281, 4, 4, cream) +
  rect(83, 211, 64, 66, dark, 8) +
  rect(283, 211, 64, 66, dark, 8) +
  line(115, 214, 115, 272, cream, 5) +
  line(286, 243, 345, 243, cream, 5) +
  rect(171, 335, 89, 20, '#c2ac85', 5) +
  rect(159, 355, 114, 15, '#d6c39e', 5) +
  bush(55, 328, 0.7) +
  bush(365, 328, 0.8);
island +=
  group(1490, 1590, 0.75, cottage) +
  rect(1625, 1760, 72, 110, dark, 8) +
  [0, 1, 2, 3].map((i) => rect(1628, 1770 + i * 24, 66, 13, wood, 3)).join('') +
  rect(1650, 1818, 24, 23, '#d7b56c', 4) +
  ellipse(1662, 1816, 9, 10, 'none', 'stroke="#d7b56c" stroke-width="5"') +
  group(
    700,
    3125,
    1,
    rect(0, 0, 140, 25, wood, 6) +
      rect(0, 35, 140, 24, '#c8946a', 5) +
      rect(12, 55, 12, 27, wood, 3) +
      rect(115, 55, 12, 27, wood, 3)
  ) +
  ellipse(center.x, center.y - 40, 118, 72, '#a3b5a5') +
  ellipse(center.x, center.y - 57, 109, 62, cream) +
  ellipse(center.x, center.y - 60, 91, 48, '#78bac0') +
  rect(center.x - 20, center.y - 151, 40, 94, '#cbd1b9', 8) +
  ellipse(center.x, center.y - 148, 55, 22, cream) +
  ellipse(center.x, center.y - 157, 42, 15, '#78bac0') +
  shape(
    `M${center.x} ${center.y - 160}q-15 -70 -35 -18M${center.x} ${center.y - 160}q15 -70 35 -18`,
    'none',
    'stroke="#d1ebe3" stroke-width="5" stroke-linecap="round"'
  ) +
  shape(
    'M1990 2190Q2160 2900 1990 3550',
    'none',
    `stroke="${sand}" stroke-width="125" stroke-linecap="round"`
  ) +
  ellipse(1990, 3545, 230, 80, sand) +
  rect(1925, 3510, 130, 305, wood, 8) +
  Array.from({ length: 15 }, (_, i) =>
    rect(1928, 3515 + i * 20, 124, 16, i % 2 ? '#cb9c72' : '#d7ae81', 2)
  ).join('') +
  [3530, 3670, 3800]
    .map((y) => rect(1915, y, 17, 32, dark, 4) + rect(2048, y, 17, 32, dark, 4))
    .join('') +
  group(
    2115,
    3670,
    1,
    ellipse(0, 50, 54, 95, '#4d8d9730') +
      shape('M0 -40Q90 55 0 155Q-90 55 0 -40Z', wood) +
      shape('M0 -18Q62 55 0 127Q-62 55 0 -18Z', cream) +
      rect(-29, 48, 58, 14, wood, 3)
  ) +
  ellipse(home.x, home.y - 90, 350, 210, '#bfd5a2');
island += group(home.x - 215, home.y - 370, 1, cottage);
island += rect(0, 0, 4096, 4096, 'url(#grain)');
await save('island-v1', 4096, 4096, island, 'webp');
const landmarkBodies = [
  ellipse(230, 370, 190, 23, '#526d4928') +
    rect(111, 165, 20, 190, wood, 4) +
    rect(329, 165, 20, 190, wood, 4) +
    rect(57, 72, 346, 206, wood, 17) +
    rect(70, 85, 320, 177, cream, 10) +
    shape(
      'M111 176L151 140M111 176L151 211M349 176L309 140M349 176L309 211',
      'none',
      `stroke="${dark}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"`
    ) +
    shape(
      'M247 124L211 224',
      'none',
      `stroke="${coral}" stroke-width="16" stroke-linecap="round"`
    ) +
    rect(154, 283, 149, 32, '#829b76', 5) +
    bush(82, 351, 0.8) +
    flower(367, 350, coral),
  ellipse(230, 451, 200, 23, '#526d4928') +
    rect(79, 154, 301, 273, '#e4d5b1', 8) +
    rect(102, 181, 256, 246, cream, 3) +
    rect(139, 294, 77, 132, dark, 3) +
    rect(256, 238, 65, 69, '#9fc1bb', 5) +
    shape('M65 160L229 66L395 160Z', coral) +
    [58, 229, 401].map((x) => rect(x, 98, 12, 345, wood, 3)).join('') +
    [194, 327, 423].map((y) => rect(41, y, 381, 13, wood, 3)).join('') +
    line(63, 420, 226, 201, wood, 8) +
    line(237, 325, 395, 108, wood, 8) +
    rect(104, 124, 99, 72, '#9ebca2', 6) +
    shape('M128 162l16-18 17 18-17 18Z', cream) +
    rect(288, 372, 68, 50, '#d7a267', 5),
  ellipse(230, 390, 196, 24, '#526d4928') +
    shape('M42 354L52 228L115 95L203 53L302 83L402 209L420 355Z', '#8a9c92') +
    shape('M52 228L115 95L203 53L167 189Z', '#b3bdae') +
    shape('M134 350V247Q134 137 230 137Q326 137 326 247V350Z', '#283f43') +
    rect(122, 190, 25, 166, wood, 5) +
    rect(316, 190, 25, 166, wood, 5) +
    rect(112, 176, 239, 31, '#c9976d', 5) +
    line(185, 350, 161, 392, '#8c8972', 7) +
    line(280, 350, 309, 392, '#8c8972', 7) +
    line(171, 370, 294, 370, wood, 8) +
    line(163, 383, 304, 383, wood, 8) +
    rect(40, 292, 66, 66, '#d2ae77', 6) +
    rect(343, 290, 70, 68, '#d2ae77', 6) +
    line(56, 310, 87, 340, wood, 4) +
    line(56, 340, 87, 310, wood, 4) +
    line(379, 308, 379, 341, dark, 7) +
    line(378, 268, 378, 167, wood, 7) +
    shape('M382 167L432 187L382 211Z', coral),
  ellipse(230, 510, 189, 23, '#526d4928') +
    rect(103, 128, 254, 354, '#aebbb0', 14) +
    rect(125, 155, 210, 327, '#cbd1b9', 8) +
    rect(87, 89, 288, 70, '#d9d9bf', 8) +
    [90, 157, 224, 291, 350].map((x) => rect(x, 52, 34, 67, '#d9d9bf', 4)).join('') +
    rect(176, 356, 104, 126, dark, 50) +
    [200, 287].map((y) => rect(210, y, 39, 58, dark, 19)).join('') +
    shape('M151 176H204V233Q178 263 151 233Z', '#db987d') +
    shape(
      'M163 194L190 225M163 226V194M191 226V194',
      'none',
      `stroke="${cream}" stroke-width="5"`
    ) +
    [178, 265, 342, 430]
      .map((y) => line(127, y, 167, y, '#afbaa8', 4) + line(298, y + 30, 332, y + 30, '#afbaa8', 4))
      .join('') +
    bush(106, 476, 0.8) +
    line(296, 80, 296, 5, wood, 5) +
    shape('M299 5L355 18L299 36Z', coral),
  ellipse(230, 370, 195, 23, '#526d4928') +
    ellipse(230, 310, 160, 57, '#b1b8a1') +
    rect(187, 170, 86, 132, '#ddd6b6', 8) +
    ellipse(230, 169, 180, 86, '#c1bfa3') +
    ellipse(230, 155, 180, 78, cream) +
    shape('M230 78A180 78 0 0 1 410 156L230 156Z', '#e4c789') +
    shape('M230 155L333 191L231 104Z', '#819891') +
    shape('M230 155V49L184 162Z', dark) +
    Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return line(
        230 + Math.cos(a) * 146,
        155 + Math.sin(a) * 59,
        230 + Math.cos(a) * 160,
        155 + Math.sin(a) * 66,
        wood,
        4
      );
    }).join('') +
    ellipse(230, 309, 67, 22, '#e6dec0'),
  ellipse(270, 382, 255, 23, '#526d4928') +
    rect(23, 58, 494, 310, wood, 22) +
    rect(35, 69, 470, 284, '#f1dcad', 16) +
    rect(53, 88, 434, 248, '#dec998', 9) +
    Array.from({ length: 90 }, () =>
      ellipse(65 + random() * 405, 101 + random() * 220, 1.5, 1.5, '#ae9970')
    ).join('') +
    ellipse(146, 241, 30, 23, 'none', `stroke="${cream}" stroke-width="5"`) +
    [
      [303, 167],
      [341, 190],
      [284, 201],
    ]
      .map(
        ([x, y]) =>
          ellipse(x + 3, y + 8, 17, 10, '#8e815b38') +
          ellipse(x, y, 15, 15, '#78908c') +
          ellipse(x - 4, y - 5, 5, 4, '#d4dfd2')
      )
      .join('') +
    ellipse(362, 158, 6, 6, coral) +
    rect(109, 24, 211, 21, wood, 6) +
    rect(121, 44, 12, 24, wood, 2) +
    rect(294, 44, 12, 24, wood, 2) +
    bush(491, 371, 0.65),
];
for (let i = 0; i < sites.length; i++)
  await save(
    `${sites[i].name}-v1`,
    sites[i].w,
    sites[i].h,
    i === 0 ? group(0, 0, sites[i].w / 460, landmarkBodies[i]) : landmarkBodies[i]
  );
const houseObjects = [
  { name: 'desk', x: 1010, y: 233, width: 318, height: 113 },
  { name: 'sofa', x: 203, y: 310, width: 310, height: 145 },
  { name: 'bookshelf', x: 620, y: 185, width: 270, height: 84 },
  { name: 'plant', x: 1320, y: 610, width: 64, height: 70 },
  { name: 'table', x: 618, y: 510, width: 285, height: 142 },
  { name: 'bed', x: 1110, y: 485, width: 210, height: 260 },
  { name: 'shoes', x: 884, y: 790, width: 72, height: 44 },
];
let house =
  rect(0, 0, 1536, 1024, '#455e60') +
  rect(100, 100, 1336, 824, '#786e5c', 24) +
  rect(120, 120, 1296, 784, '#e5c9a0', 14) +
  rect(120, 120, 1296, 150, cream, 12) +
  rect(120, 254, 1296, 18, '#c6ae8b');
for (let y = 280; y < 900; y += 62) house += line(125, y, 1410, y, '#cdb08a', 2);
for (let y = 280; y < 880; y += 62)
  for (let x = 150 + (y % 124 ? 0 : 110); x < 1400; x += 220)
    house += line(x, y, x, y + 60, '#d4b890', 2);
house +=
  rect(430, 405, 665, 337, '#8faaa0', 85) +
  rect(449, 424, 627, 299, '#a9bcb0', 72) +
  rect(464, 439, 597, 269, 'none', 62, 'stroke="#e2dbc0" stroke-width="4"');
house +=
  rect(1030, 146, 266, 105, wood, 10) +
  rect(1043, 156, 240, 80, '#a9ced0', 5) +
  line(1162, 156, 1162, 235, cream, 8) +
  line(1046, 197, 1279, 197, cream, 8);
for (const p of houseObjects) {
  house += rect(p.x + 8, p.y + 12, p.width, p.height, '#6e62442b', 15);
  if (p.name === 'bed')
    house +=
      rect(p.x, p.y, p.width, p.height, wood, 14) +
      rect(p.x + 10, p.y + 10, p.width - 20, p.height - 20, cream, 12) +
      rect(p.x + 15, p.y + 72, p.width - 30, p.height - 85, '#9fbbb0', 9) +
      rect(p.x + 36, p.y + 20, p.width - 72, 55, '#f8e9ce', 14) +
      rect(p.x + 15, p.y + 85, p.width - 30, 22, '#bfd0b6', 3);
  if (p.name === 'shoes')
    house +=
      rect(p.x, p.y, 30, 42, wood, 12) +
      rect(p.x + 39, p.y, 30, 42, wood, 12) +
      rect(p.x + 4, p.y + 26, 22, 13, cream, 5) +
      rect(p.x + 43, p.y + 26, 22, 13, cream, 5);
  if (p.name === 'desk')
    house +=
      rect(p.x, p.y, p.width, p.height, wood, 10) +
      rect(1100, 210, 129, 73, ink, 9) +
      rect(1110, 220, 109, 51, '#a8c9bd', 3) +
      rect(1148, 281, 36, 8, ink, 3) +
      rect(1098, 307, 130, 23, cream, 4) +
      ellipse(1273, 286, 17, 15, cream) +
      rect(1125, 356, 90, 75, coral, 20);
  if (p.name === 'sofa')
    house +=
      rect(p.x, p.y, p.width, p.height, '#648b81', 28) +
      rect(p.x + 20, p.y + 27, p.width - 40, 94, '#8aae99', 20) +
      rect(p.x + 30, p.y + 18, 93, 75, '#b8c7a2', 18) +
      rect(p.x + 160, p.y + 18, 97, 75, '#e4b39a', 18) +
      rect(p.x - 10, p.y + 23, 36, 105, '#72998a', 16) +
      rect(p.x + p.width - 27, p.y + 23, 36, 105, '#72998a', 16);
  if (p.name === 'bookshelf') {
    house += rect(p.x, p.y, p.width, p.height, wood, 6);
    for (let i = 0; i < 17; i++)
      house += rect(
        p.x + 12 + i * 14,
        p.y + 12,
        10,
        54 - (i % 3) * 7,
        [cream, coral, dark, '#b6c496'][i % 4],
        2
      );
  }
  if (p.name === 'plant')
    house += ellipse(p.x + 32, p.y + 49, 32, 30, coral) + bush(p.x + 32, p.y + 14, 1.5);
  if (p.name === 'table')
    house +=
      rect(p.x, p.y, p.width, p.height, '#c99b6e', 45) +
      rect(p.x + 18, p.y + 15, p.width - 36, p.height - 30, '#ecd0a3', 35) +
      rect(p.x + 61, p.y + 27, 67, 78, dark, 4) +
      rect(p.x + 68, p.y + 31, 54, 70, cream, 3) +
      ellipse(p.x + 208, p.y + 80, 21, 16, cream) +
      ellipse(p.x + 208, p.y + 80, 13, 10, wood);
}
house +=
  rect(710, 875, 120, 49, wood, 5) +
  rect(692, 839, 156, 36, '#c3a77c', 8) +
  rect(0, 0, 1536, 1024, 'url(#grain)');
await save('house-v1', 1536, 1024, house, 'webp');
for (const pose of ['down', 'up', 'left', 'right']) {
  const side = pose === 'left' || pose === 'right',
    back = pose === 'up';
  let body =
    ellipse(55, 102, 25, 6, '#334e5025') +
    rect(37, 78, 14, 23, ink, 6) +
    rect(60, 78, 14, 23, ink, 6) +
    rect(32, 48, 45, 39, '#da927c', 14) +
    rect(26, 53, 11, 29, '#e6b88f', 5) +
    rect(75, 53, 10, 29, '#e6b88f', 5) +
    rect(44, 40, 21, 16, '#e6b88f', 6) +
    ellipse(55, 28, 24, 26, '#efc6a0') +
    shape('M31 29Q25 1 54 2Q86 1 79 34L70 19Q47 28 37 16L37 33Z', ink);
  if (back)
    body +=
      ellipse(55, 25, 24, 24, ink) +
      rect(40, 55, 30, 31, '#71968a', 9) +
      rect(45, 68, 20, 12, '#9bb3a0', 4);
  else if (side) body += ellipse(66, 31, 2, 3, ink) + shape('M75 31l6 7-7 2', '#efc6a0');
  else
    body +=
      ellipse(46, 31, 2, 3, ink) +
      ellipse(65, 31, 2, 3, ink) +
      shape('M51 41q4 3 8 0', 'none', `stroke="${wood}" stroke-width="2" stroke-linecap="round"`);
  if (pose === 'left') body = `<g transform="translate(110 0) scale(-1 1)">${body}</g>`;
  await save(`avatar-${pose}-v1`, 110, 110, body);
}
await save(
  'ambient-leaf-v1',
  48,
  48,
  shape('M9 39Q2 4 40 7Q43 39 9 39Z', '#a4be7b') + line(11, 37, 33, 14, '#718f66', 2)
);
await save(
  'ambient-butterfly-v1',
  64,
  64,
  ellipse(20, 25, 14, 20, '#efd49b') +
    ellipse(44, 25, 14, 20, '#e7ae88') +
    ellipse(23, 45, 10, 11, '#e7ae88') +
    ellipse(41, 45, 10, 11, '#efd49b') +
    rect(29, 19, 6, 34, ink, 3)
);
await save(
  'ambient-cloud-v1',
  320,
  160,
  ellipse(160, 109, 144, 39, '#fff7df', 'opacity=".64"') +
    ellipse(108, 85, 66, 54, '#fff7df', 'opacity=".64"') +
    ellipse(203, 76, 64, 64, '#fff7df', 'opacity=".64"')
);
await save(
  'ambient-sparkle-v1',
  48,
  48,
  shape('M24 3L29 19L45 24L29 29L24 45L19 29L3 24L19 19Z', cream)
);
await save('ambient-shadow-v1', 110, 30, ellipse(55, 15, 50, 12, '#334e5029'));

const properties = (values) =>
  Object.entries(values).map(([name, value]) => ({
    name,
    type: typeof value === 'number' ? 'float' : typeof value === 'boolean' ? 'bool' : 'string',
    value,
  }));
function makeMap(name, width, height, layers) {
  let id = 1;
  const result = {
    compressionlevel: -1,
    height: height / 32,
    width: width / 32,
    infinite: false,
    layers: [
      {
        id: 1,
        name: 'background',
        type: 'imagelayer',
        image: `${name}-v1.webp`,
        imagewidth: width,
        imageheight: height,
        opacity: 1,
        visible: true,
        x: 0,
        y: 0,
        offsetx: 0,
        offsety: 0,
      },
    ],
    nextlayerid: 8,
    nextobjectid: 1,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.11.2',
    tileheight: 32,
    tilewidth: 32,
    tilesets: [],
    type: 'map',
    version: '1.10',
    properties: properties({ schemaVersion: 1, coordinateUnit: 'pixel', avatarRadius: 18 }),
  };
  for (const [layerName, objects] of Object.entries(layers))
    result.layers.push({
      id: result.layers.length + 1,
      name: layerName,
      type: 'objectgroup',
      draworder: 'topdown',
      opacity: 1,
      visible: true,
      x: 0,
      y: 0,
      objects: objects.map((o) => ({
        id: id++,
        name: o.name,
        type: o.type ?? layerName,
        rotation: 0,
        visible: true,
        x: o.x,
        y: o.y,
        width: o.width ?? 0,
        height: o.height ?? 0,
        ...(o.point ? { point: true } : {}),
        ...(o.properties ? { properties: properties(o.properties) } : {}),
      })),
    });
  result.nextobjectid = id;
  return result;
}
const shoreMask = await sharp(Buffer.from(svg(4096, 4096, shape(shore, 'white'))))
  .ensureAlpha()
  .raw()
  .toBuffer();
const land = (x, y) =>
  x >= 0 &&
  y >= 0 &&
  x < 4096 &&
  y < 4096 &&
  (shoreMask[(y * 4096 + x) * 4 + 3] > 250 || (x >= 1925 && x <= 2055 && y >= 3510 && y <= 3815));
const collisions = [];
for (let y = 0; y < 4096; y += 32) {
  let start = null;
  for (let x = 0; x <= 4096; x += 32) {
    const blocked =
      x < 4096 &&
      ![
        [x, y],
        [x + 31, y],
        [x, y + 31],
        [x + 31, y + 31],
      ].every(([px, py]) => land(px, py));
    if (blocked && start === null) start = x;
    if (!blocked && start !== null) {
      collisions.push({ name: 'water', x: start, y, width: x - start, height: 32 });
      start = null;
    }
  }
}
collisions.push(...props.map(({ name, x, y, width, height }) => ({ name, x, y, width, height })));
collisions.push({ name: 'home', x: home.x - 165, y: home.y - 180, width: 330, height: 140 });
for (const s of sites)
  collisions.push({
    name: s.name,
    x: s.x - s.w * 0.32,
    y: s.y - 80,
    width: s.w * 0.64,
    height: 64,
  });
const anchors = sites.map((s) => ({
  name: s.name,
  x: s.x,
  y: s.y,
  point: true,
  properties: {
    slug: s.slug,
    asset: `/world/${s.name}-v1.png`,
    anchorX: 0.5,
    anchorY: 1,
    width: s.w,
    height: s.h,
  },
}));
const islandMap = makeMap('island', 4096, 4096, {
  collisions,
  'project-zones': sites.map((s) => ({
    name: s.slug,
    x: s.x - 200,
    y: s.y - 10,
    width: 400,
    height: 200,
    properties: { slug: s.slug, label: s.name, promptOffsetX: 0, promptOffsetY: -100 },
  })),
  props: props.map(({ solid, interactable = false, ...p }) => ({
    ...p,
    properties: { solid, baked: true, interactable },
  })),
  doors: [
    {
      name: 'house-entry',
      x: home.x - 48,
      y: home.y - 35,
      width: 96,
      height: 80,
      properties: { targetMap: 'house-v1', targetSpawn: 'entry' },
    },
  ],
  spawns: [
    { name: 'default', x: center.x, y: center.y + 120, point: true },
    { name: 'house-exit', x: home.x, y: home.y + 95, point: true },
  ],
  'landmark-anchor': anchors,
});
const houseMap = makeMap('house', 1536, 1024, {
  collisions: [
    { name: 'north-wall', x: 0, y: 0, width: 1536, height: 275 },
    { name: 'west-wall', x: 0, y: 275, width: 125, height: 749 },
    { name: 'east-wall', x: 1411, y: 275, width: 125, height: 749 },
    { name: 'south-wall-left', x: 125, y: 904, width: 585, height: 120 },
    { name: 'south-wall-right', x: 830, y: 904, width: 581, height: 120 },
    ...houseObjects,
  ],
  'project-zones': [],
  props: houseObjects.map((o) => ({
    ...o,
    properties: {
      baked: true,
      solid: true,
      interactable: ['desk', 'bookshelf', 'shoes'].includes(o.name),
    },
  })),
  doors: [
    {
      name: 'island-exit',
      x: 710,
      y: 870,
      width: 120,
      height: 65,
      properties: { targetMap: 'island-v1', targetSpawn: 'house-exit' },
    },
  ],
  spawns: [
    { name: 'entry', x: 770, y: 795, point: true },
    { name: 'default', x: 1020, y: 735, point: true },
    { name: 'initial', x: 1020, y: 735, point: true },
  ],
  'landmark-anchor': [],
});
for (const [name, map] of [
  ['island', islandMap],
  ['house', houseMap],
])
  await writeFile(path.join(out, `${name}-v1.json`), JSON.stringify(map, null, 2) + '\n');
const composite = await sharp(path.join(out, 'island-v1.webp'))
  .composite(
    sites.map((s) => ({
      input: path.join(out, `${s.name}-v1.png`),
      left: s.x - s.w / 2,
      top: s.y - s.h,
    }))
  )
  .webp({ quality: 90 })
  .toBuffer();
await writeFile(path.join(out, 'island-overview-v1.webp'), composite);
assets['island-overview-v1'] = { src: '/world/island-overview-v1.webp', width: 4096, height: 4096 };
for (const [name, w, h, region] of [
  ['banner', 1920, 640, { left: 500, top: 1000, width: 3060, height: 1020 }],
  ['teaser', 1200, 900, { left: 450, top: 450, width: 3200, height: 2400 }],
  ['og', 1200, 630, { left: 430, top: 650, width: 3200, height: 1680 }],
]) {
  await sharp(composite)
    .extract(region)
    .resize(w, h)
    .webp({ quality: 90 })
    .toFile(path.join(out, `${name}-v1.webp`));
  assets[`${name}-v1`] = { src: `/world/${name}-v1.webp`, width: w, height: h, crop: region };
}
const audioRate = 22050;
function wav(samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write('RIFF');
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(audioRate, 24);
  buffer.writeUInt32LE(audioRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  const peak = 0.8;
  for (let i = 0; i < samples.length; i++)
    buffer.writeInt16LE(Math.round(Math.tanh(samples[i] / peak) * 24000), 44 + i * 2);
  return buffer;
}
const beat = 60 / 78,
  duration = beat * 32,
  music = new Float64Array(Math.round(duration * audioRate));
function tone(samples, start, length, hz, gain, kind = 'bell') {
  for (let i = 0; i < length * audioRate; i++) {
    const t = i / audioRate,
      a =
        Math.min(1, t / 0.015) *
        Math.exp(-t / (kind === 'bass' ? 0.23 : 0.65)) *
        Math.min(1, (length - t) / 0.08);
    const signal =
      kind === 'kick'
        ? Math.sin(2 * Math.PI * (45 * t + 7 * (1 - Math.exp(-t * 25))))
        : Math.sin(2 * Math.PI * hz * t) +
          0.22 * Math.sin(2 * Math.PI * hz * 2 * t) +
          0.08 * Math.sin(2 * Math.PI * hz * 3 * t);
    const index = (Math.round(start * audioRate) + i) % samples.length;
    samples[index] += signal * a * gain;
  }
}
const chords = [
  [48, 52, 55, 59],
  [45, 48, 52, 55],
  [41, 45, 48, 52],
  [43, 47, 50, 53],
];
const hz = (n) => 440 * 2 ** ((n - 69) / 12);
for (let b = 0; b < 32; b++) {
  const chord = chords[Math.floor(b / 8)];
  if (b % 4 === 0)
    chord.forEach((n, i) => tone(music, b * beat + i * 0.025, 2.9, hz(n + 12), 0.075));
  if (b % 2 === 0) tone(music, b * beat, 1, hz(chord[0] - 12), 0.16, 'bass');
  if (b % 4 === 0 || b % 4 === 2) tone(music, b * beat, 0.3, 50, 0.2, 'kick');
  if (b % 2 === 1) tone(music, (b + 0.14) * beat, 0.9, hz(chord[(b % 3) + 1] + 24), 0.04);
  for (let j = 0; j < 2; j++) {
    const start = Math.round((b + j * 0.5 + (j ? 0.06 : 0)) * beat * audioRate);
    for (let i = 0; i < 0.09 * audioRate; i++)
      music[(start + i) % music.length] +=
        (random() * 2 - 1) * Math.exp((-i / audioRate) * 65) * 0.018;
  }
}
await writeFile(path.join(out, 'lofi-garden-v1.wav'), wav(music));
assets['lofi-garden-v1'] = {
  src: '/world/lofi-garden-v1.wav',
  duration: music.length / audioRate,
  loop: true,
  sampleRate: audioRate,
};
for (const [name, notes] of [
  ['interact', [72, 79]],
  ['door', [55, 62, 67]],
  ['step', [43]],
  ['discovery', [72, 76, 79, 84]],
  ['open', [67, 74]],
  ['close', [74, 67]],
  ['celebrate', [72, 76, 79, 84, 88, 91]],
]) {
  const samples = new Float64Array(Math.round((notes.length * 0.095 + 0.3) * audioRate));
  notes.forEach((n, i) => tone(samples, i * 0.095, 0.25, hz(n), name === 'step' ? 0.05 : 0.13));
  await writeFile(path.join(out, `${name}-v1.wav`), wav(samples));
  assets[`${name}-v1`] = { src: `/world/${name}-v1.wav`, duration: samples.length / audioRate };
}
const encoded = spawnSync('ffmpeg', [
  '-y',
  '-hide_banner',
  '-loglevel',
  'error',
  '-i',
  path.join(out, 'lofi-garden-v1.wav'),
  '-c:a',
  'libopus',
  '-b:a',
  '64k',
  path.join(out, 'lofi-garden-v1.ogg'),
]);
if (encoded.status === 0) assets['lofi-garden-v1'].compressedSrc = '/world/lofi-garden-v1.ogg';
const mp3 = spawnSync('ffmpeg', [
  '-y',
  '-hide_banner',
  '-loglevel',
  'error',
  '-i',
  path.join(out, 'lofi-garden-v1.wav'),
  '-c:a',
  'libmp3lame',
  '-b:a',
  '96k',
  path.join(out, 'music-v1.mp3'),
]);
if (mp3.status === 0)
  assets['music-v1'] = {
    src: '/world/music-v1.mp3',
    duration: music.length / audioRate,
    loop: true,
  };
for (const asset of Object.values(assets)) {
  const bytes = await readFile(path.join(root, 'public', asset.src));
  asset.bytes = bytes.length;
  asset.sha256 = createHash('sha256').update(bytes).digest('hex');
}
await writeFile(
  path.join(out, 'manifest-v1.json'),
  JSON.stringify(
    {
      version: 1,
      seed: 481516,
      palette,
      maps: { island: '/world/island-v1.json', house: '/world/house-v1.json' },
      avatar: {
        width: 110,
        height: 110,
        anchorX: 0.5,
        anchorY: 1,
        collisionRadius: 18,
        poses: ['down', 'up', 'left', 'right'],
      },
      sites,
      assets,
      provenance:
        'Original procedural SVG illustration and original synthesized composition. No external artwork, recordings, samples, or fonts. Generated by scripts/world-art/generate.mjs.',
    },
    null,
    2
  ) + '\n'
);
const manifestPath = path.join(out, 'manifest-v1.json');
await writeFile(
  manifestPath,
  await format(await readFile(manifestPath, 'utf8'), { parser: 'json' })
);
console.log(`Generated ${Object.keys(assets).length} assets and two maps in ${out}`);
