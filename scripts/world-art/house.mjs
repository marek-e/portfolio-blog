// The one-room house interior painting (1536×1024). Coordinates are the gameplay contract
// for public/world/maps/house.tmj: north wall band y 0..96, bed block (128..352, 128..448),
// door gap at x 704..832 on the south wall, and the three intro props exported below.

import { building, wood, land, nature, sea } from './palette.mjs';
import { rng, shadow, svgDoc } from './svg.mjs';

export const WIDTH = 1536;
export const HEIGHT = 1024;

/** Interactable intro props (PRD §6.4) — anchors shared with the generated house.tmj. */
export const PROPS = {
  desk: { x: 750, y: 240, w: 300, h: 190 },
  bookshelf: { x: 1420, y: 420, w: 110, h: 300 },
  shoes: { x: 900, y: 930, w: 110, h: 70 },
};

function plank(x, y, w, tone) {
  return `<rect x="${x}" y="${y}" width="${w}" height="64" fill="${tone}"/>`;
}

function bed() {
  // Matches collision block (128..352, 128..448).
  return `<g>
    ${shadow(250, 452, 130, 22, 0.15)}
    <rect x="128" y="140" width="224" height="308" rx="22" fill="${wood.mid}"/>
    <rect x="140" y="196" width="200" height="240" rx="16" fill="#e8e2d2"/>
    <rect x="140" y="300" width="200" height="136" rx="16" fill="${sea.shallow}"/>
    <rect x="140" y="300" width="200" height="30" rx="14" fill="${sea.foam}" opacity="0.6"/>
    <rect x="156" y="158" width="80" height="52" rx="14" fill="#f6f2e6"/>
  </g>`;
}

function desk() {
  const { x, y } = PROPS.desk;
  return `<g transform="translate(${x} ${y})">
    ${shadow(0, 100, 165, 22, 0.15)}
    <rect x="-150" y="-90" width="300" height="180" rx="14" fill="${wood.light}"/>
    <rect x="-150" y="-90" width="300" height="34" rx="14" fill="${wood.plank}"/>
    <!-- monitor -->
    <rect x="-70" y="-78" width="140" height="86" rx="10" fill="#33302a"/>
    <rect x="-60" y="-68" width="120" height="66" rx="6" fill="#7fc4d8"/>
    <rect x="-60" y="-68" width="120" height="22" rx="6" fill="#a8dce8"/>
    <g stroke="#2f6d8f" stroke-width="6" stroke-linecap="round">
      <line x1="-46" y1="-34" x2="10" y2="-34"/>
      <line x1="-46" y1="-20" x2="36" y2="-20"/>
    </g>
    <rect x="-16" y="8" width="32" height="12" rx="5" fill="#4a4538"/>
    <!-- keyboard + mug -->
    <rect x="-58" y="30" width="116" height="34" rx="8" fill="#d8d2c0"/>
    <circle cx="102" cy="44" r="18" fill="#c96f4a"/>
    <circle cx="102" cy="44" r="11" fill="#8a4a30"/>
  </g>`;
}

function bookshelf() {
  const { x, y } = PROPS.bookshelf;
  const books = [
    ['#c96f4a', 0],
    ['#3b82c4', 26],
    ['#63a04b', 52],
    ['#f0c85a', 78],
    ['#8a6ab8', 0],
    ['#d8503c', 26],
    ['#2f8f8a', 52],
    ['#e88aa8', 78],
  ];
  let rows = '';
  books.forEach(([color, off], i) => {
    const row = i < 4 ? 0 : 1;
    rows += `<rect x="${-44 + off}" y="${row === 0 ? -130 : 26}" width="20" height="72" rx="5" fill="${color}"/>`;
  });
  return `<g transform="translate(${x} ${y})">
    ${shadow(-10, 160, 70, 18, 0.15)}
    <rect x="-56" y="-150" width="112" height="310" rx="12" fill="${wood.mid}"/>
    <rect x="-46" y="-140" width="92" height="130" rx="8" fill="${wood.dark}"/>
    <rect x="-46" y="6" width="92" height="130" rx="8" fill="${wood.dark}"/>
    <g transform="translate(0 10)">${rows}</g>
    <rect x="-46" y="0" width="92" height="10" fill="${wood.mid}"/>
  </g>`;
}

function shoes() {
  const { x, y } = PROPS.shoes;
  return `<g transform="translate(${x} ${y})">
    ${shadow(0, 24, 56, 12, 0.12)}
    <g transform="rotate(-12)">
      <rect x="-52" y="-14" width="52" height="30" rx="14" fill="#f4f0e4"/>
      <rect x="-52" y="8" width="52" height="10" rx="5" fill="#c9bfa8"/>
      <path d="M-46 -8 L-14 -8" stroke="#2f8f8a" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g transform="translate(14 6) rotate(8)">
      <rect x="0" y="-14" width="52" height="30" rx="14" fill="#f4f0e4"/>
      <rect x="0" y="8" width="52" height="10" rx="5" fill="#c9bfa8"/>
      <path d="M6 -8 L38 -8" stroke="#2f8f8a" stroke-width="6" stroke-linecap="round"/>
    </g>
  </g>`;
}

function rug() {
  return `<g>
    <ellipse cx="768" cy="600" rx="300" ry="180" fill="#d8798f"/>
    <ellipse cx="768" cy="600" rx="300" ry="180" fill="none" stroke="#c25a74" stroke-width="16"/>
    <ellipse cx="768" cy="600" rx="210" ry="122" fill="none" stroke="#e8a4b4" stroke-width="12"/>
    <ellipse cx="768" cy="600" rx="120" ry="66" fill="#e8a4b4" opacity="0.5"/>
  </g>`;
}

function plant(x, y) {
  return `<g transform="translate(${x} ${y})">
    ${shadow(0, 40, 40, 12, 0.12)}
    <path d="M0 -10 Q-34 -50 -22 -86 Q-4 -50 0 -12 Z" fill="${nature.canopy}"/>
    <path d="M0 -10 Q34 -54 26 -90 Q6 -52 0 -12 Z" fill="${nature.canopyLight}"/>
    <path d="M0 -12 Q-2 -70 6 -102 Q16 -60 4 -12 Z" fill="${nature.pine}"/>
    <path d="M-26 8 L26 8 L18 46 L-18 46 Z" fill="#c96f4a"/>
    <rect x="-26" y="2" width="52" height="14" rx="7" fill="#a85838"/>
  </g>`;
}

export function buildHouseSvg() {
  // wood floor — subtle plank tone variation, deterministic
  const random = rng(1024);
  let floor = '';
  const tones = [wood.plank, '#bd8f62', '#b58459'];
  for (let row = 0; row < 16; row++) {
    const y = 64 + row * 64;
    const offset = (row % 2) * -160;
    for (let x = offset; x < WIDTH; x += 320) {
      floor += plank(x, y, 312, tones[Math.floor(random() * tones.length)]);
    }
  }

  const windowLight = `
    <g opacity="0.35">
      <path d="M420 96 L560 96 L640 420 L500 420 Z" fill="#fff2c4"/>
    </g>`;

  const body = `
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${wood.plank}"/>
    ${floor}
    <!-- skirting shade under the north wall -->
    <rect x="0" y="96" width="${WIDTH}" height="26" fill="rgba(60,45,25,0.25)"/>
    <!-- north wall -->
    <rect x="0" y="0" width="${WIDTH}" height="96" fill="${building.wall}"/>
    <rect x="0" y="0" width="${WIDTH}" height="30" fill="${building.wallShade}"/>
    <!-- window on the north wall -->
    <rect x="430" y="10" width="140" height="80" rx="10" fill="${building.window}" stroke="${building.windowFrame}" stroke-width="8"/>
    <line x1="500" y1="14" x2="500" y2="86" stroke="${building.windowFrame}" stroke-width="6"/>
    <rect x="446" y="20" width="40" height="28" rx="6" fill="#c4ecf4" opacity="0.8"/>
    <!-- poster -->
    <rect x="1100" y="14" width="72" height="66" rx="8" fill="#f6f2e6"/>
    <circle cx="1136" cy="40" r="16" fill="${nature.flowerPink}"/>
    <rect x="1114" y="62" width="44" height="8" rx="4" fill="#b8b0a0"/>
    ${windowLight}
    ${rug()}
    ${bed()}
    ${desk()}
    ${bookshelf()}
    ${shoes()}
    ${plant(80, 940)}
    ${plant(1300, 120)}
    <!-- door mat at the south gap (704..832) -->
    <rect x="694" y="950" width="148" height="60" rx="14" fill="${land.sandDark}"/>
    <rect x="708" y="962" width="120" height="36" rx="10" fill="${land.sand}"/>
  `;

  return svgDoc(WIDTH, HEIGHT, body);
}
