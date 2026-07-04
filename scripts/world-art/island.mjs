// The island exterior painting (4096×4096). Gameplay coordinates are the contract:
// everything interactable here must line up with public/world/maps/island.tmj —
// house block (1856..2240, 896..1184), door gap at x≈2048 y≈1184, fountain block
// (1952..2144, 2200..2392), and the landmark sites listed in SITES below.

import { sea, land, wood, building, nature } from './palette.mjs';
import { rng, blobPath, smoothOpenPath, shadow, svgDoc } from './svg.mjs';

export const SIZE = 4096;
export const CX = 2048;
export const CY = 2150;

/** Landmark / POI anchor points — the single layout reference for the generated island.tmj. */
export const SITES = {
  houseDoor: { x: 2048, y: 1184 },
  plaza: { x: 2048, y: 2296 },
  elemix: { x: 3050, y: 1900 },
  minesweeper: { x: 2820, y: 950 },
  nextArmored: { x: 1050, y: 1680 },
  equinox: { x: 1250, y: 2950 },
  petanque: { x: 2800, y: 3020 },
  library: { x: 1580, y: 2350 },
  bench: { x: 3340, y: 2480 },
  pier: { x: 2150, y: 3430 },
};

// Scatter geometry — exported so the map generator derives collision from the exact same
// coordinates the painting is drawn from.
export const PINES = [
  [1500, 800],
  [1680, 640],
  [2350, 640],
  [2550, 700],
  [1350, 1050],
  [2700, 1250],
  [1150, 1300],
  [900, 2200],
  [880, 2600],
  [3300, 1700],
  [3450, 2050],
  [2450, 1500],
  [1750, 1450],
  [3150, 2750],
  [1050, 2250],
  [1850, 620],
  [2100, 580],
  [1250, 850],
  [980, 1550],
  [860, 1800],
  [3250, 1450],
  [3480, 2380],
  [2900, 700],
  [3120, 800],
  [740, 2400],
  [1000, 2850],
  [3380, 2900],
  [2050, 700],
  [2250, 800],
  [1550, 950],
];

export const CANOPIES = [
  [1600, 1850],
  [2450, 1950],
  [1800, 2700],
  [2350, 2450],
  [2900, 2250],
  [1450, 2450],
  [2200, 1500],
  [3050, 1500],
  [1300, 2100],
  [1750, 1980],
  [2600, 1620],
  [2050, 2680],
  [1150, 2550],
  [2550, 3180],
  [1900, 3080],
];

export const PALMS = [
  [1500, 3250, 1],
  [1750, 3450, -1],
  [2450, 3300, 1],
  [2700, 3380, -1],
  [1250, 3150, 1],
  [3050, 3150, -1],
  [1950, 3300, 1],
];

export const ROCKS = [
  [2650, 800, 1.6],
  [2950, 750, 1.3],
  [3100, 1050, 1.8],
  [2550, 1050, 1.2],
  [3350, 2300, 1.4],
  [3420, 2650, 1.7],
  [700, 1900, 1.3],
  [850, 2900, 1.2],
];

/** Island coastline radii (walkable landmass = the sand blob). Shared with collision gen. */
export function coastRadii() {
  const random = rng(20260704);
  return islandRadii(random);
}

// ---------------------------------------------------------------------------
// Nature helpers (sun top-left: highlight up-left, shade down-right — PRD §8.1)
// ---------------------------------------------------------------------------

function pineTree(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${shadow(0, 26, 34, 12)}
    <rect x="-7" y="8" width="14" height="22" rx="6" fill="${nature.trunk}"/>
    <path d="M0 -78 L34 -18 L-34 -18 Z" fill="${nature.pine}"/>
    <path d="M0 -52 L42 16 L-42 16 Z" fill="${nature.pine}"/>
    <path d="M0 -78 L-30 -22 L4 -22 Z" fill="${nature.pineLight}" opacity="0.55"/>
    <path d="M0 -52 L-37 12 L6 12 Z" fill="${nature.pineLight}" opacity="0.45"/>
    <path d="M8 -34 L42 16 L6 16 Z" fill="${nature.pineDark}" opacity="0.5"/>
  </g>`;
}

function canopyTree(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${shadow(0, 30, 40, 14)}
    <rect x="-8" y="6" width="16" height="26" rx="7" fill="${nature.trunk}"/>
    <circle cx="0" cy="-26" r="44" fill="${nature.canopy}"/>
    <circle cx="-26" cy="-8" r="30" fill="${nature.canopy}"/>
    <circle cx="26" cy="-8" r="30" fill="${nature.canopy}"/>
    <circle cx="-14" cy="-36" r="26" fill="${nature.canopyLight}"/>
    <circle cx="18" cy="0" r="22" fill="${nature.pine}" opacity="0.35"/>
  </g>`;
}

function palmTree(x, y, s = 1, flip = 1) {
  return `<g transform="translate(${x} ${y}) scale(${flip * s}, ${s})">
    ${shadow(6, 30, 38, 12)}
    <path d="M-4 30 Q2 -10 14 -38" stroke="${nature.trunk}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <g transform="translate(14 -40)">
      <path d="M0 0 Q-38 -18 -64 -2 Q-36 6 0 4 Z" fill="${nature.canopy}"/>
      <path d="M0 0 Q38 -20 62 -6 Q38 6 0 4 Z" fill="${nature.canopyLight}"/>
      <path d="M0 0 Q-20 -36 -46 -40 Q-18 -12 0 2 Z" fill="${nature.canopyLight}"/>
      <path d="M0 0 Q22 -34 48 -34 Q20 -8 0 2 Z" fill="${nature.canopy}"/>
      <circle cx="-2" cy="6" r="6" fill="${wood.mid}"/>
      <circle cx="8" cy="8" r="5" fill="${wood.mid}"/>
    </g>
  </g>`;
}

function bush(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${shadow(0, 12, 24, 8, 0.12)}
    <circle cx="-12" cy="0" r="16" fill="${nature.bush}"/>
    <circle cx="10" cy="2" r="14" fill="${nature.bush}"/>
    <circle cx="-2" cy="-8" r="15" fill="${nature.canopyLight}"/>
  </g>`;
}

function flowerPatch(x, y, random) {
  const colors = [nature.flowerPink, nature.flowerYellow, nature.flowerWhite];
  let out = `<g transform="translate(${x} ${y})">`;
  for (let i = 0; i < 7; i++) {
    const fx = (random() - 0.5) * 110;
    const fy = (random() - 0.5) * 70;
    const c = colors[Math.floor(random() * colors.length)];
    out += `<circle cx="${fx.toFixed(0)}" cy="${fy.toFixed(0)}" r="${(4 + random() * 3).toFixed(1)}" fill="${c}"/>`;
    out += `<circle cx="${(fx + 6).toFixed(0)}" cy="${(fy + 5).toFixed(0)}" r="3" fill="${nature.bush}"/>`;
  }
  return out + '</g>';
}

function rock(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${shadow(2, 12, 22, 8, 0.14)}
    <path d="M-20 10 Q-24 -8 -8 -14 Q6 -20 18 -8 Q26 2 16 10 Z" fill="${land.cliff}"/>
    <path d="M-18 8 Q-20 -6 -8 -12 L-2 -14 Q-10 -2 -6 8 Z" fill="#ad9d88"/>
    <path d="M8 -12 Q22 -6 18 8 L6 10 Q12 -2 8 -12 Z" fill="${land.cliffDark}" opacity="0.6"/>
  </g>`;
}

// ---------------------------------------------------------------------------
// Buildings & structures
// ---------------------------------------------------------------------------

/** Marek's house — footprint locked to the Tiled block (1856..2240, 896..1184). */
function house() {
  // Facade band (south face, visible in 3/4 view): y 1080..1184; roof above.
  return `<g>
    ${shadow(2060, 1196, 220, 34, 0.2)}
    <!-- facade -->
    <rect x="1872" y="1050" width="352" height="134" rx="10" fill="${building.wall}"/>
    <rect x="1872" y="1146" width="352" height="38" rx="10" fill="${building.wallShade}"/>
    <!-- door (gap at 2000..2096 in the collision map) -->
    <rect x="2014" y="1096" width="68" height="88" rx="8" fill="${wood.mid}"/>
    <rect x="2022" y="1104" width="52" height="72" rx="6" fill="${wood.light}" opacity="0.5"/>
    <circle cx="2070" cy="1142" r="5" fill="${wood.dark}"/>
    <!-- facade windows -->
    <rect x="1908" y="1088" width="56" height="48" rx="8" fill="${building.window}" stroke="${building.windowFrame}" stroke-width="6"/>
    <rect x="2132" y="1088" width="56" height="48" rx="8" fill="${building.window}" stroke="${building.windowFrame}" stroke-width="6"/>
    <!-- roof (top-down 3/4: large visible slope) -->
    <path d="M1856 1070 Q1852 1058 1864 1052 L2028 940 Q2048 928 2068 940 L2232 1052 Q2244 1058 2240 1070 L2240 1078 Q2148 1010 2048 1010 Q1948 1010 1856 1078 Z" fill="${building.roofDark}"/>
    <rect x="1850" y="908" width="396" height="150" rx="42" fill="${building.roof}"/>
    <rect x="1850" y="908" width="396" height="66" rx="33" fill="${building.roofLight}"/>
    <!-- ridge cap + chimney -->
    <rect x="1986" y="892" width="124" height="30" rx="15" fill="${building.roofDark}"/>
    <g>
      <rect x="2150" y="866" width="44" height="58" rx="8" fill="${land.cliff}"/>
      <rect x="2144" y="858" width="56" height="18" rx="8" fill="${land.cliffDark}"/>
    </g>
  </g>`;
}

/** The shuttered library — the locked "coming soon" building near the plaza. */
function library() {
  const { x, y } = SITES.library;
  return `<g transform="translate(${x - 140} ${y - 150})">
    ${shadow(140, 268, 160, 26, 0.18)}
    <rect x="20" y="120" width="240" height="140" rx="10" fill="${building.wallShade}"/>
    <rect x="20" y="224" width="240" height="36" rx="10" fill="#c3a878"/>
    <!-- boarded door -->
    <rect x="112" y="164" width="56" height="96" rx="8" fill="${wood.dark}"/>
    <rect x="104" y="186" width="72" height="14" rx="7" fill="${wood.light}" transform="rotate(-8 140 193)"/>
    <rect x="104" y="216" width="72" height="14" rx="7" fill="${wood.light}" transform="rotate(6 140 223)"/>
    <!-- shuttered windows -->
    <g fill="${wood.mid}">
      <rect x="44" y="156" width="48" height="44" rx="6"/>
      <rect x="188" y="156" width="48" height="44" rx="6"/>
    </g>
    <g stroke="${wood.dark}" stroke-width="5">
      <line x1="48" y1="166" x2="88" y2="166"/><line x1="48" y1="178" x2="88" y2="178"/><line x1="48" y1="190" x2="88" y2="190"/>
      <line x1="192" y1="166" x2="232" y2="166"/><line x1="192" y1="178" x2="232" y2="178"/><line x1="192" y1="190" x2="232" y2="190"/>
    </g>
    <!-- roof -->
    <rect x="6" y="26" width="268" height="112" rx="34" fill="#8f9aa8"/>
    <rect x="6" y="26" width="268" height="50" rx="25" fill="#a8b2be"/>
    <!-- coming-soon sign -->
    <g transform="translate(196 236)">
      <rect x="-6" y="-30" width="10" height="44" rx="5" fill="${wood.dark}"/>
      <rect x="-34" y="-52" width="66" height="34" rx="8" fill="${wood.light}" stroke="${wood.dark}" stroke-width="5"/>
      <line x1="-22" y1="-42" x2="20" y2="-42" stroke="${wood.dark}" stroke-width="5" stroke-linecap="round"/>
      <line x1="-22" y1="-30" x2="10" y2="-30" stroke="${wood.dark}" stroke-width="5" stroke-linecap="round"/>
    </g>
  </g>`;
}

function fountain() {
  const { x, y } = SITES.plaza;
  return `<g>
    <circle cx="${x}" cy="${y}" r="270" fill="${land.plaza}"/>
    <circle cx="${x}" cy="${y}" r="270" fill="none" stroke="${land.plazaEdge}" stroke-width="14"/>
    <circle cx="${x}" cy="${y}" r="210" fill="none" stroke="${land.plazaEdge}" stroke-width="5" opacity="0.5" stroke-dasharray="26 20"/>
    ${shadow(x + 4, y + 24, 110, 30, 0.15)}
    <circle cx="${x}" cy="${y}" r="96" fill="${land.cliff}"/>
    <circle cx="${x}" cy="${y}" r="80" fill="${sea.shallow}"/>
    <circle cx="${x - 14} " cy="${y - 14}" r="42" fill="${sea.foam}" opacity="0.5"/>
    <circle cx="${x}" cy="${y}" r="26" fill="${land.cliff}"/>
    <circle cx="${x}" cy="${y - 6}" r="16" fill="#ad9d88"/>
    <circle cx="${x}" cy="${y - 10}" r="7" fill="${sea.foam}"/>
  </g>`;
}

function pier() {
  const { x, y } = SITES.pier;
  let planks = '';
  for (let i = 0; i < 9; i++) {
    planks += `<rect x="${x - 56}" y="${y + i * 46}" width="112" height="38" rx="8" fill="${i % 2 ? wood.plank : wood.light}"/>`;
  }
  return `<g>
    <rect x="${x - 62}" y="${y - 10}" width="124" height="440" rx="16" fill="${wood.mid}"/>
    ${planks}
    <circle cx="${x - 46}" cy="${y + 400}" r="12" fill="${wood.dark}"/>
    <circle cx="${x + 46}" cy="${y + 400}" r="12" fill="${wood.dark}"/>
    <circle cx="${x - 46}" cy="${y + 60}" r="12" fill="${wood.dark}"/>
    <circle cx="${x + 46}" cy="${y + 60}" r="12" fill="${wood.dark}"/>
  </g>`;
}

function boat() {
  const x = SITES.pier.x + 250;
  const y = SITES.pier.y + 330;
  return `<g transform="translate(${x} ${y}) rotate(18)">
    <ellipse cx="0" cy="0" rx="150" ry="64" fill="${wood.mid}"/>
    <ellipse cx="0" cy="-4" rx="128" ry="48" fill="${wood.light}"/>
    <ellipse cx="0" cy="-6" rx="100" ry="34" fill="${wood.plank}"/>
    <rect x="-78" y="-12" width="156" height="12" rx="6" fill="${wood.dark}" opacity="0.5"/>
    <rect x="-10" y="-30" width="20" height="52" rx="9" fill="${wood.dark}"/>
  </g>`;
}

function bench() {
  const { x, y } = SITES.bench;
  return `<g transform="translate(${x} ${y})">
    ${shadow(0, 26, 60, 14, 0.16)}
    <rect x="-64" y="-6" width="128" height="26" rx="10" fill="${wood.light}"/>
    <rect x="-64" y="-30" width="128" height="16" rx="8" fill="${wood.plank}"/>
    <rect x="-56" y="16" width="14" height="22" rx="6" fill="${wood.dark}"/>
    <rect x="42" y="16" width="14" height="22" rx="6" fill="${wood.dark}"/>
  </g>`;
}

/** Cleared dirt site where a landmark sprite will sit (PRD §8.3 step 2). */
function clearedSite(x, y, r = 150) {
  return `<g opacity="0.9">
    <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="${land.path}"/>
    <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="none" stroke="${land.pathEdge}" stroke-width="9" opacity="0.5"/>
    <ellipse cx="${x - r * 0.22}" cy="${y - r * 0.18}" rx="${r * 0.5}" ry="${r * 0.3}" fill="#ead4a4" opacity="0.8"/>
  </g>`;
}

// ---------------------------------------------------------------------------
// Terrain
// ---------------------------------------------------------------------------

function islandRadii(random) {
  // 18 spokes with gentle perturbation; wider than tall to leave sea margins.
  const base = [];
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    let r = 1560 + (random() - 0.5) * 190;
    // pull in the corners a touch so the blob stays inside the canvas
    const diag = Math.abs(Math.sin(2 * angle));
    r -= diag * 130;
    base.push({ angle, r });
  }
  return base;
}

function paths() {
  const p = SITES;
  const road = (pts, w = 66) =>
    `<path d="${smoothOpenPath(pts)}" fill="none" stroke="${land.pathEdge}" stroke-width="${w + 14}" stroke-linecap="round"/>` +
    `<path d="${smoothOpenPath(pts)}" fill="none" stroke="${land.path}" stroke-width="${w}" stroke-linecap="round"/>`;

  return [
    // house → plaza (main street)
    road(
      [
        { x: p.houseDoor.x, y: p.houseDoor.y },
        { x: 2040, y: 1650 },
        { x: p.plaza.x, y: p.plaza.y - 290 },
      ],
      84
    ),
    // plaza → pier/beach
    road(
      [
        { x: p.plaza.x, y: p.plaza.y + 280 },
        { x: 2090, y: 3000 },
        { x: p.pier.x, y: p.pier.y },
      ],
      80
    ),
    // plaza → library → equinox
    road([
      { x: p.plaza.x - 260, y: p.plaza.y + 60 },
      { x: p.library.x + 60, y: p.library.y + 170 },
      { x: 1380, y: 2650 },
      { x: p.equinox.x, y: p.equinox.y },
    ]),
    // plaza → east fork → elemix
    road([
      { x: p.plaza.x + 250, y: p.plaza.y - 110 },
      { x: 2620, y: 2100 },
      { x: p.elemix.x, y: p.elemix.y },
    ]),
    // elemix ↑ mine (NE)
    road(
      [
        { x: p.elemix.x, y: p.elemix.y },
        { x: 2960, y: 1400 },
        { x: p.minesweeper.x, y: p.minesweeper.y },
      ],
      56
    ),
    // east fork → bench viewpoint
    road(
      [
        { x: 2620, y: 2100 },
        { x: 2980, y: 2350 },
        { x: p.bench.x - 60, y: p.bench.y },
      ],
      52
    ),
    // west: plaza → next-armored
    road(
      [
        { x: p.plaza.x - 280, y: p.plaza.y - 60 },
        { x: 1480, y: 2050 },
        { x: p.nextArmored.x, y: p.nextArmored.y + 60 },
      ],
      56
    ),
    // petanque spur off the beach road
    road(
      [
        { x: 2110, y: 2960 },
        { x: 2450, y: 2960 },
        { x: p.petanque.x - 150, y: p.petanque.y - 20 },
      ],
      52
    ),
  ].join('');
}

// ---------------------------------------------------------------------------

export function buildIslandSvg() {
  const random = rng(20260704);
  const islandShape = islandRadii(random);

  const sand = blobPath(
    CX,
    CY,
    islandShape.map((s) => ({ ...s }))
  );
  const shallow = blobPath(
    CX,
    CY,
    islandShape.map((s) => ({ angle: s.angle, r: s.r + 150 }))
  );
  const shelf = blobPath(
    CX,
    CY,
    islandShape.map((s) => ({ angle: s.angle, r: s.r + 330 }))
  );
  const grass = blobPath(
    CX,
    CY - 40,
    islandShape.map((s) => ({ angle: s.angle, r: s.r - 130 }))
  );

  // north hill plateau — drawn with a south-facing cliff band so the elevation reads
  const hillRadii = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    hillRadii.push({ angle, r: 620 + (random() - 0.5) * 90 });
  }
  const hill = blobPath(2050, 1010, hillRadii, { squashY: 0.62 });
  const hillBase = blobPath(
    2050,
    1052,
    hillRadii.map((h) => ({ angle: h.angle, r: h.r + 26 })),
    {
      squashY: 0.64,
    }
  );

  // scattered nature, kept away from paths/sites by hand-chosen anchors
  const pines = PINES.map(([x, y]) => pineTree(x, y, 1.15 + random() * 0.5));

  const canopies = CANOPIES.map(([x, y]) => canopyTree(x, y, 1.1 + random() * 0.5));

  const palms = PALMS.map(([x, y, f]) => palmTree(x, y, 1.2 + random() * 0.4, f));

  // plane trees flanking the petanque court (PRD §7)
  const planes = [
    canopyTree(SITES.petanque.x - 190, SITES.petanque.y - 120, 1.5),
    canopyTree(SITES.petanque.x + 190, SITES.petanque.y - 110, 1.4),
  ];

  const bushes = [
    [1900, 1550],
    [2250, 1700],
    [1700, 2150],
    [2500, 2650],
    [2050, 2850],
    [3150, 2050],
    [1200, 1900],
    [2750, 1650],
    [1550, 2900],
    [2150, 2050],
  ].map(([x, y]) => bush(x, y, 1.2 + random() * 0.5));

  const flowers = [
    [1850, 1700],
    [2300, 2150],
    [1550, 2550],
    [2650, 2850],
    [2000, 3050],
    [2900, 2100],
    [1350, 1750],
    [2250, 1350],
  ].map(([x, y]) => flowerPatch(x, y, random));

  const rocks = ROCKS.map(([x, y, s]) => rock(x, y, s));

  // subtle grass texture dabs
  let grassDabs = '';
  for (let i = 0; i < 260; i++) {
    const a = random() * Math.PI * 2;
    const r = Math.sqrt(random()) * 1300;
    const x = CX + Math.cos(a) * r;
    const y = CY - 40 + Math.sin(a) * r * 0.95;
    const light = random() > 0.5;
    grassDabs += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(16 + random() * 26).toFixed(0)}" ry="${(7 + random() * 10).toFixed(0)}" fill="${light ? land.grassLight : land.grassDark}" opacity="0.35"/>`;
  }

  // sea foam arcs
  let foamArcs = '';
  for (let i = 0; i < 60; i++) {
    const x = random() * SIZE;
    const y = random() * SIZE;
    const w = 60 + random() * 120;
    foamArcs += `<path d="M ${x.toFixed(0)} ${y.toFixed(0)} q ${w / 2} ${-10 - random() * 8} ${w} 0" stroke="${sea.foam}" stroke-width="6" fill="none" opacity="0.14" stroke-linecap="round"/>`;
  }

  const body = `
    <rect width="${SIZE}" height="${SIZE}" fill="${sea.mid}"/>
    <path d="${shelf}" fill="${sea.shallow}" opacity="0.55"/>
    ${foamArcs}
    <path d="${shallow}" fill="${sea.shallow}"/>
    <path d="${shallow}" fill="none" stroke="${sea.foam}" stroke-width="12" opacity="0.7"/>
    <path d="${sand}" fill="${land.sand}"/>
    <path d="${sand}" fill="none" stroke="${land.sandDark}" stroke-width="10" opacity="0.6"/>
    <path d="${grass}" fill="${land.grass}"/>
    ${grassDabs}
    <path d="${hillBase}" fill="${land.grassDark}"/>
    <path d="${hill}" fill="${land.hill}"/>
    <path d="${hill}" fill="none" stroke="#79b25c" stroke-width="10"/>
    ${paths()}
    ${clearedSite(SITES.elemix.x, SITES.elemix.y, 190)}
    ${clearedSite(SITES.minesweeper.x, SITES.minesweeper.y, 190)}
    ${clearedSite(SITES.nextArmored.x, SITES.nextArmored.y, 180)}
    ${clearedSite(SITES.equinox.x, SITES.equinox.y, 180)}
    ${clearedSite(SITES.petanque.x, SITES.petanque.y, 210)}
    ${fountain()}
    ${pier()}
    ${boat()}
    ${rocks.join('')}
    ${flowers.join('')}
    ${bushes.join('')}
    ${library()}
    ${house()}
    ${bench()}
    ${canopies.join('')}
    ${planes.join('')}
    ${pines.join('')}
    ${palms.join('')}
  `;

  return svgDoc(SIZE, SIZE, body);
}
