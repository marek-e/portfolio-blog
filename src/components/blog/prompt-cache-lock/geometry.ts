import {
  boxCorners,
  circleRing,
  corners,
  cylinder,
  depthOf,
  endRing,
  faceRing,
  fitProjection,
  haloOf,
  helix,
  insetPlan,
  iso,
  knurl,
  lineOnTop,
  onFace,
  planOutline,
  prism,
  radialTicks,
  ring,
  ringOf,
  sideArc,
  sideSeam,
  slabOf,
  topMatrix,
  topTicks,
  type Flat,
  type LineTone,
  type Plan,
  type Plane,
  type SolidPaths,
  type Tone,
} from './iso';
import { CUTS } from './model';

export const WIDTH = 600;
export const HEIGHT = 300;

const PLATE: Plan = { x: -128, y: -34, w: 244, d: 74, r: 7 };
const PLATE_H = 9;
const FOOT_H = 5;
const PLINTH: Plan = { x: -72, y: -26, w: 136, d: 40, r: 3 };
const PLINTH_H = 7;

const XA = -64;
const XB = 56;
const BODY: Plan = { x: XA, y: -18, w: XB - XA, d: 18, r: 0 };
const BODY_Z = PLINTH_H;
const BODY_TOP = 70;
const CAP: Plan = { x: -52, y: -14, w: 100, d: 9, r: 1.5 };
const CAP_H = 3;

const AXIS_Z = 30;
const PLUG_R = 12;
export const SHEAR = AXIS_Z + PLUG_R;
const COLLAR_X = XA - 3;
const TAIL_X = XB + 3;
const CAM_X = TAIL_X + 3.4;

export const CHAMBER_X = Array.from({ length: CUTS }, (_, index) => -44 + 12 * index);
const GROOVE = 3.3;
const GROOVE_LOW = 20;
const GROOVE_TOP = 66;
const PIN_R = 2.5;
const DRIVER = 8;
const STOP = 22.5;

const KEY_LOW = 20.6;
export const BLANK = 36;
const TIP_X = CHAMBER_X[CUTS - 1]! + 6;
export const KEY_TRAVEL = 20;
const BLADE_T = 2.9;

const DIAL: Plane = [90, 20];
const DIAL_R = 15;
const DIAL_Z = 2.4;
const DIAL_H = 8;
const DIAL_TOP = DIAL_Z + DIAL_H;

export const cutTopOf = (depth: number) => 34 - 1.6 * depth;
export const keyPinOf = (depth: number) => SHEAR - cutTopOf(depth);

export const P = fitProjection(
  [
    ...boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [XA, 0, BODY_TOP + CAP_H],
    [XB, -18, BODY_TOP + CAP_H],
    [-100 - KEY_TRAVEL, 2, 46],
  ],
  WIDTH,
  HEIGHT,
  { pad: 10, azimuth: 60, elevation: 30 }
);

const at = (point: [number, number, number]) => iso(point, P);
const tenth = (value: number) => Math.round(value * 10) / 10;

interface SolidStyle {
  tone?: Tone;
  crease?: Tone | 'none';
  lit?: boolean;
  inner?: string;
  className?: string;
}

export function solidSvg(
  paths: SolidPaths,
  { tone = 'hi', crease = 'faint', lit = false, inner = '', className }: SolidStyle = {}
) {
  const out = [
    `<g class="iso-solid${className ? ` ${className}` : ''}"${lit ? ' data-lit=""' : ''}>`,
    `<path class="iso-fill" d="${paths.fill}"/>`,
  ];
  paths.shades.forEach((d, shade) => {
    if (d) out.push(`<path class="iso-shade" data-shade="${shade}" d="${d}"/>`);
  });
  if (paths.top) out.push(`<path class="iso-top" d="${paths.top}"/>`);
  if (crease !== 'none' && paths.crease)
    out.push(`<path class="iso-line" data-tone="${crease}" d="${paths.crease}"/>`);
  if (crease !== 'none' && paths.bevel)
    out.push(`<path class="iso-line" data-tone="${crease}" d="${paths.bevel}"/>`);
  out.push(inner);
  out.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/>`);
  out.push('</g>');
  return out.join('');
}

export const lineSvg = (d: string, tone: LineTone = 'lo', extra = '') =>
  d ? `<path class="iso-line" data-tone="${tone}" d="${d}"${extra}/>` : '';

export const dotsSvg = (points: Flat[], size = 0.5, tone: Tone = 'mid') =>
  `<g class="iso-dots" data-tone="${tone}">${points
    .map(([x, y]) => `<circle cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"/>`)
    .join('')}</g>`;

const fillSvg = (d: string, className: string) => `<path class="${className}" d="${d}"/>`;

const S = solidSvg;
const L = lineSvg;
const D = dotsSvg;

const byDepth = (points: Plane[]) =>
  [...points].sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));

const faceRect = (x0: number, x1: number, z0: number, z1: number, y = 0) =>
  onFace(
    [
      [x0, z0],
      [x1, z0],
      [x1, z1],
      [x0, z1],
    ],
    y,
    P,
    true
  );

function bench() {
  const out = [`<path class="iso-halo" d="${haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(corners(PLATE, 20))) {
    out.push(S(cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(S(cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  out.push(S(slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: 'mid' }));
  out.push(L(planOutline(insetPlan(PLATE, 5), 0, P), 'lo'));
  const screws = corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => ring(x, y, 2.2, 0, P, 16)).join(''), 'lo'));
  out.push(D(screws.map(([x, y]) => at([x, y, 0]))));
  const strip: Plan = { x: -88, y: PLATE.y + PLATE.d - 13, w: 148, d: 7, r: 1 };
  out.push(S(slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
  const ticks = topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, 'lo'), L(ticks.major, 'mid'));
  out.push(
    D(
      [at([strip.x + 2, strip.y + 4.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 4.5, 0.6])],
      0.45
    )
  );
  const label: Plan = { x: -120, y: 22, w: 26, d: 12, r: 1.4 };
  out.push(S(slabOf(label, 0, 0.8, P, 4), { tone: 'lo', crease: 'none' }));
  out.push(L(planOutline(insetPlan(label, 1.6), 0.8, P, 4), 'faint'));
  const rules = [
    [label.x + 5, label.x + 21],
    [label.x + 5, label.x + 17],
    [label.x + 5, label.x + 13],
  ];
  out.push(
    rules
      .map(([from, to], row) =>
        L(
          lineOnTop([from!, label.y + 3.6 + row * 2.4], [to!, label.y + 3.6 + row * 2.4], 0.8, P),
          'lo',
          ' data-free=""'
        )
      )
      .join('')
  );
  out.push(
    D(
      [
        at([label.x + 2.6, label.y + 2.6, 0.8]),
        at([label.x + label.w - 2.6, label.y + label.d - 2.6, 0.8]),
      ],
      0.4
    )
  );
  return out.join('');
}

function plinth() {
  const out = [S(slabOf(PLINTH, 0, PLINTH_H, P, 4, 0.6), { tone: 'mid' })];
  out.push(L(sideSeam(PLINTH, 2.4, P, 4), 'faint'));
  const screws: Plane[] = [
    [PLINTH.x + 4, PLINTH.y + PLINTH.d - 5],
    [PLINTH.x + PLINTH.w - 4, PLINTH.y + PLINTH.d - 5],
    [PLINTH.x + 4, PLINTH.y + 4],
    [PLINTH.x + PLINTH.w - 4, PLINTH.y + 4],
  ];
  out.push(L(screws.map(([x, y]) => ring(x, y, 1.6, PLINTH_H, P, 14)).join(''), 'lo'));
  out.push(
    D(
      screws.map(([x, y]) => at([x, y, PLINTH_H])),
      0.45
    )
  );
  out.push(L(lineOnTop([XA - 4, 8], [XB + 4, 8], PLINTH_H, P), 'faint'));
  return out.join('');
}

function sectionFace() {
  const out: string[] = [];
  out.push(fillSvg(faceRect(XA, XB, BODY_Z, BODY_TOP), 'pcl-cut'));
  out.push(fillSvg(faceRect(XA, XB, AXIS_Z - PLUG_R, SHEAR), 'pcl-plug'));
  out.push(fillSvg(faceRect(XA, XB - 4, KEY_LOW - 0.6, BLANK + 1), 'pcl-void'));
  for (const x of CHAMBER_X) {
    out.push(fillSvg(faceRect(x - GROOVE, x + GROOVE, GROOVE_LOW, GROOVE_TOP), 'pcl-void'));
  }
  out.push(L(faceRect(XA, XB - 4, KEY_LOW - 0.6, BLANK + 1), 'faint'));
  out.push(
    L(
      CHAMBER_X.map((x) =>
        onFace(
          [
            [x - GROOVE, BLANK + 1],
            [x - GROOVE, GROOVE_TOP],
            [x + GROOVE, GROOVE_TOP],
            [x + GROOVE, BLANK + 1],
          ],
          0,
          P
        )
      ).join(''),
      'lo'
    )
  );
  const shearRuns: Plane[][] = [];
  let from = XA;
  for (const x of CHAMBER_X) {
    shearRuns.push([
      [from, SHEAR],
      [x - GROOVE, SHEAR],
    ]);
    from = x + GROOVE;
  }
  shearRuns.push([
    [from, SHEAR],
    [XB, SHEAR],
  ]);
  out.push(L(shearRuns.map((run) => onFace(run, 0, P)).join(''), 'hi'));
  out.push(
    L(
      onFace(
        [
          [XA, AXIS_Z - PLUG_R],
          [XB, AXIS_Z - PLUG_R],
        ],
        0,
        P
      ),
      'lo'
    )
  );
  const faceScrews: Plane[] = [
    [XA + 6, 13],
    [XB - 6, 13],
    [XA + 6, 61],
    [XB - 6, 61],
  ];
  out.push(L(faceScrews.map(([x, z]) => faceRing(x, 0, z, 2, P, 16)).join(''), 'lo'));
  out.push(
    D(
      faceScrews.map(([x, z]) => at([x, 0, z])),
      0.5
    )
  );
  out.push(
    L(
      onFace(
        [
          [XA, BODY_TOP],
          [XB, BODY_TOP],
          [XB, BODY_Z],
        ],
        0,
        P
      ),
      'faint'
    )
  );
  return out.join('');
}

function body() {
  const out: string[] = [];
  out.push(
    S(slabOf(BODY, BODY_Z, BODY_TOP - BODY_Z, P, 2, 0.8), { tone: 'mid', inner: sectionFace() })
  );
  out.push(L(endRing(XB, 0, AXIS_Z, PLUG_R, P, Math.PI / 2, (Math.PI * 3) / 2), 'lo'));
  out.push(L(endRing(XB, 0, AXIS_Z, PLUG_R + 2.6, P, Math.PI / 2, (Math.PI * 3) / 2), 'faint'));
  out.push(D([at([XB, -14, 60]), at([XB, -4, 60]), at([XB, -14, 14]), at([XB, -4, 14])], 0.45));
  out.push(S(slabOf(CAP, BODY_TOP, CAP_H, P, 3, 0.5), { tone: 'mid' }));
  out.push(
    L(CHAMBER_X.map((x) => ring(x, CAP.y + CAP.d / 2, 1.6, BODY_TOP + CAP_H, P, 14)).join(''), 'lo')
  );
  out.push(
    D(
      CHAMBER_X.map((x) => at([x, CAP.y + CAP.d / 2, BODY_TOP + CAP_H])),
      0.55
    )
  );
  out.push(L(lineOnTop([XA + 3, -2], [XB - 3, -2], BODY_TOP, P), 'faint'));
  out.push(S(prism(halfDisc(PLUG_R + 1.6), 'x', COLLAR_X, XA, P), { tone: 'mid' }));
  out.push(S(prism(halfDisc(PLUG_R - 1), 'x', XB, TAIL_X, P), { tone: 'mid' }));
  return out.join('');
}

function halfDisc(radius: number, steps = 24): Plane[] {
  return Array.from({ length: steps + 1 }, (_, step) => {
    const angle = Math.PI / 2 + (Math.PI * step) / steps;
    return [radius * Math.cos(angle), AXIS_Z + radius * Math.sin(angle)] as Plane;
  });
}

export function camSvg(turn: number) {
  const angle = turn * (Math.PI / 3);
  const along: Plane = [Math.sin(angle), -Math.cos(angle)];
  const across: Plane = [Math.cos(angle), Math.sin(angle)];
  const corner = (a: number, b: number): Plane => [
    along[0] * a + across[0] * b,
    AXIS_Z + along[1] * a + across[1] * b,
  ];
  const bar = [corner(-4, -3.2), corner(16, -2.4), corner(16, 2.4), corner(-4, 3.2)];
  const out = [S(prism(bar, 'x', TAIL_X, CAM_X, P), { tone: 'hi', crease: 'lo' })];
  out.push(S(prism(circleRing(0, AXIS_Z, 3.4, 20), 'x', CAM_X, CAM_X + 1.2, P), { tone: 'mid' }));
  const tip = corner(13, 0);
  out.push(D([at([CAM_X, tip[0], tip[1]])], 0.55, 'hi'));
  return out.join('');
}

function dial(ttl: 5 | 60) {
  const [x, y] = DIAL;
  const count = ttl === 60 ? 60 : 20;
  const every = ttl === 60 ? 5 : 4;
  const ticks = radialTicks(x, y, DIAL_R - 3, count, every, DIAL_TOP, [1.3, 2.8], P);
  return `<g data-ttl="${ttl}">${L(ticks.minor, 'lo')}${L(ticks.major, 'mid')}</g>`;
}

function dialBody() {
  const [x, y] = DIAL;
  const out: string[] = [];
  out.push(
    `<path class="iso-halo" d="${haloOf({ x: x - 18, y: y - 18, w: 36, d: 36, r: 18 }, 0, 0.1, P)}" style="filter:blur(4px)"/>`
  );
  out.push(S(cylinder(x, y, DIAL_R + 2.4, 0, DIAL_Z, P, 56, 0.5), { tone: 'lo' }));
  out.push(S(cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 64, 0.8), { tone: 'hi', crease: 'lo' }));
  out.push(L(knurl(x, y, DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 84, P, 0.3), 'lo'));
  out.push(L(sideArc(x, y, DIAL_R, DIAL_TOP - 3.4, P, 40), 'faint'));
  out.push(L(ring(x, y, DIAL_R - 2.2, DIAL_TOP, P, 64), 'lo'));
  out.push(dial(60), dial(5));
  out.push(L(lineOnTop([x, y - DIAL_R + 3], [x, y - DIAL_R + 6.6], DIAL_TOP, P), 'hi'));
  out.push(
    S(slabOf({ x: x + DIAL_R - 1, y: y - 2.4, w: 5, d: 4.8, r: 1.2 }, DIAL_Z + 2, 4.4, P, 3), {
      tone: 'mid',
    })
  );
  out.push(S(cylinder(x + DIAL_R + 5.4, y, 2.4, DIAL_Z + 1.2, 6.4, P, 18), { tone: 'mid' }));
  out.push(L(knurl(x + DIAL_R + 5.4, y, 2.4, DIAL_Z + 1.2, DIAL_Z + 7.6, 16, P), 'lo'));
  out.push(
    `<text class="iso-face-text" data-tone="lo" transform="${topMatrix([x, y + 7.5], DIAL_TOP, P)}" font-size="2.4" text-anchor="middle">min</text>`
  );
  return out.join('');
}

export function needleSvg(share: number) {
  const angle = Math.max(0, Math.min(1, share)) * Math.PI * 2;
  const [x, y] = DIAL;
  const d = lineOnTop(
    [x - Math.sin(angle) * 3.2, y + Math.cos(angle) * 3.2],
    [x + Math.sin(angle) * (DIAL_R - 4), y - Math.cos(angle) * (DIAL_R - 4)],
    DIAL_TOP + 0.2,
    P
  );
  return `${L(d, 'hi', ' data-free="start" style="stroke-width:1.1"')}${L(ring(x, y, 1.4, DIAL_TOP + 0.2, P, 14), 'mid')}`;
}

export const keyTopAt = (x: number, tops: number[]) => {
  let top = BLANK;
  tops.forEach((cut, index) => {
    top = Math.min(top, cut + Math.max(0, Math.abs(x - CHAMBER_X[index]!) - 1.1) * 1.15);
  });
  return Math.min(top, BLANK - Math.max(0, x - (TIP_X - 6)) * 1.3);
};

const covers = (x: number) => x >= COLLAR_X && x <= TIP_X;

export function bladeProfile(tops: number[]): Plane[] {
  const top: Plane[] = [];
  for (let x = COLLAR_X; x <= TIP_X + 1e-6; x += 0.25) top.push([x, keyTopAt(x, tops)]);
  const kept: Plane[] = [top[0]!];
  for (let index = 1; index < top.length - 1; index++) {
    const [ax, az] = kept[kept.length - 1]!;
    const [bx, bz] = top[index]!;
    const [cx, cz] = top[index + 1]!;
    const turn = (bx - ax) * (cz - az) - (bz - az) * (cx - ax);
    if (Math.abs(turn) > 0.02) kept.push(top[index]!);
  }
  kept.push(top[top.length - 1]!);
  return [[COLLAR_X, KEY_LOW], ...kept, [TIP_X, KEY_LOW + 3], [TIP_X - 3, KEY_LOW]];
}

export function bladeSvg(tops: number[]) {
  const blade = prism(bladeProfile(tops), 'y', -BLADE_T, BLADE_T, P, { convex: false });
  const groove = onFace(
    [
      [COLLAR_X, KEY_LOW + 4],
      [TIP_X - 6, KEY_LOW + 4],
    ],
    BLADE_T,
    P
  );
  return S(blade, { tone: 'hi', crease: 'lo', inner: L(groove, 'faint') });
}

const BOW: Plane[] = ringOf({ x: -100, y: 10, w: 26, d: 36, r: 9 }, 8);
const NECK: Plane[] = [
  [-75, 15],
  [COLLAR_X, 18],
  [COLLAR_X, 40],
  [-75, 43],
];

export const KEY_HANDLE = (() => {
  const out: string[] = [];
  out.push(S(prism(NECK, 'y', -3.2, 3.2, P), { tone: 'hi', crease: 'lo' }));
  const bow = prism(BOW, 'y', -3.6, 3.6, P);
  const hole = faceRing(-91, 3.6, 28, 4.6, P, 28);
  const inset = onFace(ringOf({ x: -97.6, y: 12.4, w: 21.2, d: 31.2, r: 7 }, 8), 3.6, P, true);
  out.push(S(bow, { tone: 'hi', crease: 'lo', inner: L(inset, 'faint') }));
  out.push(`<path class="pcl-void" d="${hole}"/>`, L(hole, 'lo'));
  out.push(D([at([-80, 3.6, 40]), at([-80, 3.6, 16])], 0.45));
  return out.join('');
})();

export interface StackFrame {
  shown: number;
  drop: number;
  length: number;
  lit: boolean;
}

export function stackSvg(index: number, frame: StackFrame, keyShift: number, tops: number[]) {
  if (frame.shown <= 0.001) return '';
  const x = CHAMBER_X[index]!;
  const local = x - keyShift;
  const rest = covers(local) ? Math.max(STOP, keyTopAt(local, tops)) : STOP;
  const bottom = rest + frame.drop;
  const pinTop = bottom + frame.length;
  const driverTop = pinTop + DRIVER;
  const coil = helix(x, 0, 2.1, driverTop, GROOVE_TOP, 6, P);
  const out = [`<g opacity="${tenth(frame.shown * 100) / 100}">`];
  out.push(L(coil.back, 'lo'));
  out.push(
    S(cylinder(x, 0, PIN_R, bottom, frame.length, P, 20), {
      tone: 'mid',
      crease: 'lo',
      lit: frame.lit,
      className: 'pcl-pin',
      inner: L(sideArc(x, 0, PIN_R, bottom + 1, P, 14), 'faint'),
    })
  );
  out.push(
    S(cylinder(x, 0, PIN_R, pinTop, DRIVER, P, 20), {
      tone: 'mid',
      inner: L(sideArc(x, 0, PIN_R, driverTop - 1, P, 14), 'faint'),
    })
  );
  out.push(L(coil.front, 'mid'));
  out.push('</g>');
  return out.join('');
}

export const BACK_ART = bench() + plinth() + body();
export const DIAL_ART = dialBody();
const ORIGIN = at([0, 0, 0]);

export function keyShiftOf(shift: number) {
  const [x, y] = at([shift, 0, 0]);
  return `translate(${tenth(x - ORIGIN[0])} ${tenth(y - ORIGIN[1])})`;
}
