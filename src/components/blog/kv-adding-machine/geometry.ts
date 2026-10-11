import * as k from './iso';
import type { Flat, Plan, Plane, Point3, SolidPaths } from './iso';

export type Tone = 'hi' | 'mid' | 'lo' | 'faint';

export type Item =
  | {
      kind: 'solid';
      paths: SolidPaths;
      tone: Tone;
      crease: Tone | 'none';
      inner?: string;
    }
  | { kind: 'line'; d: string; tone: Tone }
  | { kind: 'dots'; points: Flat[]; size: number; tone: Tone }
  | { kind: 'halo'; d: string }
  | { kind: 'fill'; d: string; className: string };

export const WIDTH = 640;
export const HEIGHT = 470;

const PLATE: Plan = { x: -160, y: -78, w: 272, d: 190, r: 10 };
const PLATE_H = 8;
const FOOT_H = 4;

const X0 = -70;
const X1 = 80;
const BACK = -62;
const FACE = -10;
const FRONT = 96;
const LIFT = 4;
const PLINTH = 14;
const HOUSING_TOP = 84;
const STEPS = [
  { y0: FACE, y1: 22, top: 34 },
  { y0: 22, y1: 40, top: 31 },
  { y0: 40, y1: 58, top: 28 },
  { y0: 58, y1: 76, top: 25 },
  { y0: 76, y1: FRONT, top: 22 },
];
const BED = STEPS[0].top;

export const TAPE = {
  x0: -64,
  x1: -8,
  y: FACE + 1.4,
  print: 40,
  pitch: 9,
  font: 6.2,
  top: 128,
};
export const TEAR = TAPE.print + TAPE.pitch / 2;
export const CUT = TAPE.print + TAPE.pitch * 4.5;
const CURL_R = 7;

const ROLL = { y: -40, z: HOUSING_TOP + 19, r: 16 };
export const BIN: Plan = { x: -150, y: -26, w: 68, d: 56, r: 3 };
const BIN_H = 26;

const CRANK = { x: X1, y: -32, z: 50, reach: 22 };
export const KNIFE = { x: TAPE.x1 + 1.5, park: 74 };
const COUNTER = { x0: 12, x1: 32, z0: 63, z1: 73 };

export const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [TAPE.x0, TAPE.y, TAPE.top + CURL_R * 2],
    [TAPE.x1, ROLL.y - ROLL.r, ROLL.z + ROLL.r],
    [CRANK.x + 16, CRANK.y + CRANK.reach + 4, CRANK.z],
  ],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 56, elevation: 28 }
);

export const at = (point: Point3) => k.iso(point, P);

const boxOf = (points: Point3[], pad: number) => {
  const flat = points.map(at);
  const xs = flat.map(([x]) => x);
  const ys = flat.map(([, y]) => y);
  const left = Math.min(...xs) - pad;
  const top = Math.min(...ys) - pad;
  return [left, top, Math.max(...xs) + pad - left, Math.max(...ys) + pad - top]
    .map((value) => Math.round(value))
    .join(' ');
};

export const VIEW_WIDE = boxOf(
  [
    [BIN.x, BIN.y + BIN.d, 0],
    [TAPE.x0, TAPE.y, TAPE.top + CURL_R * 2],
    [CRANK.x + 16, CRANK.y - CRANK.reach - 4, CRANK.z],
    [X1, FRONT, 0],
  ],
  10
);
export const VIEW_NARROW = boxOf(
  [
    [BIN.x, BIN.y + BIN.d, 0],
    [BIN.x, BIN.y, BIN_H],
    [TAPE.x0, TAPE.y, TAPE.top + CURL_R * 2],
    [KNIFE.x + 22, FACE, BED],
    [TAPE.x1 + 6, ROLL.y - ROLL.r, ROLL.z + ROLL.r],
    [TAPE.x0, 40, BED],
  ],
  12
);

export const FRONT_MATRIX = k.frontMatrix(TAPE.y, P);
export const COUNTER_MATRIX = k.frontMatrix(FACE - 1.2, P);

const solid = (
  paths: SolidPaths,
  tone: Tone = 'mid',
  crease: Tone | 'none' = 'faint',
  inner?: string
): Item => ({ kind: 'solid', paths, tone, crease, inner });
const line = (d: string, tone: Tone = 'lo'): Item => ({ kind: 'line', d, tone });
const dots = (points: Point3[], size = 0.5, tone: Tone = 'mid'): Item => ({
  kind: 'dots',
  points: points.map(at),
  size,
  tone,
});
const byDepth = <T extends Plane>(points: T[]) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

const circleYZ = (cy: number, cz: number, r: number, steps = 28): Plane[] =>
  Array.from({ length: steps }, (_, index) => {
    const angle = (index / steps) * Math.PI * 2;
    return [cy + r * Math.cos(angle), cz + r * Math.sin(angle)] as Plane;
  });

const onFace = (points: [number, number][], y: number, closed = false) =>
  k.pathOf(
    points.map(([x, z]) => at([x, y, z])),
    closed
  );
const onSide = (points: [number, number][], x: number, closed = false) =>
  k.pathOf(
    points.map(([y, z]) => at([x, y, z])),
    closed
  );
const slotOnFace = (x: number, z0: number, z1: number, y: number, half = 0.8) =>
  onFace(k.roundedPlan({ x: x - half, y: z0, w: half * 2, d: z1 - z0, r: half }, 3), y, true);

function topTicks(from: number, to: number, edge: number, z: number) {
  const minor: string[] = [];
  const major: string[] = [];
  for (let x = from, index = 0; x <= to + 1e-9; x += 4, index++) {
    const big = index % 5 === 0;
    (big ? major : minor).push(k.lineOnTop([x, edge], [x, edge + (big ? 3.4 : 1.8)], z, P));
  }
  return { minor: minor.join(''), major: major.join('') };
}

function plate(): Item[] {
  const out: Item[] = [{ kind: 'halo', d: k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P) }];
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(solid(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), 'lo'));
    out.push(solid(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28)));
  }
  out.push(solid(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6)));
  out.push(line(k.planOutline(k.insetPlan(PLATE, 5), 0, P)));
  const screws = k.corners(PLATE, 10);
  out.push(line(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join('')));
  out.push(dots(screws.map(([x, y]) => [x, y, 0])));
  const ruler: Plan = { x: -30, y: PLATE.y + PLATE.d - 13, w: 128, d: 6, r: 1 };
  out.push(solid(k.slabOf(ruler, 0, 0.6, P, 3), 'lo', 'none'));
  const ticks = topTicks(ruler.x + 4, ruler.x + ruler.w - 4, ruler.y + 0.6, 0.6);
  out.push(line(ticks.minor, 'lo'), line(ticks.major, 'mid'));
  out.push(
    dots(
      [
        [ruler.x + 2, ruler.y + 3, 0.6],
        [ruler.x + ruler.w - 2, ruler.y + 3, 0.6],
      ],
      0.45
    )
  );
  const label: Plan = { x: -140, y: PLATE.y + PLATE.d - 20, w: 38, d: 11, r: 1.2 };
  out.push(solid(k.slabOf(label, 0, 0.8, P, 3), 'lo', 'none'));
  out.push(line(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), 'faint'));
  out.push(
    line(
      [26, 18, 22]
        .map((w, index) =>
          k.lineOnTop(
            [label.x + 4, label.y + 3.2 + index * 2.4],
            [label.x + 4 + w, label.y + 3.2 + index * 2.4],
            0.8,
            P
          )
        )
        .join(''),
      'lo'
    )
  );
  out.push(dots([[label.x + label.w - 3.4, label.y + label.d / 2, 0.8]], 0.45));
  return out;
}

function binBack(): Item[] {
  const out: Item[] = [{ kind: 'halo', d: k.haloOf(BIN, 0, 4, P) }];
  out.push(solid(k.slabOf(BIN, 0, 1.6, P, 4), 'lo'));
  out.push({
    kind: 'fill',
    d: k.planOutline(k.insetPlan(BIN, 1.6), 1.6, P, 4),
    className: 'kvam-well',
  });
  out.push(
    solid(k.slabOf({ x: BIN.x, y: BIN.y, w: BIN.w, d: 1.6, r: 0.6 }, 1.6, BIN_H - 1.6, P, 2), 'lo')
  );
  out.push(
    solid(k.slabOf({ x: BIN.x, y: BIN.y, w: 1.6, d: BIN.d, r: 0.6 }, 1.6, BIN_H - 1.6, P, 2), 'lo')
  );
  return out;
}

function binFront(): Item[] {
  const out: Item[] = [];
  const right: Plan = { x: BIN.x + BIN.w - 1.6, y: BIN.y, w: 1.6, d: BIN.d, r: 0.6 };
  const front: Plan = { x: BIN.x, y: BIN.y + BIN.d - 1.6, w: BIN.w, d: 1.6, r: 0.6 };
  out.push(solid(k.slabOf(right, 1.6, BIN_H - 1.6, P, 2)));
  out.push(solid(k.slabOf(front, 1.6, BIN_H - 1.6, P, 2)));
  const y = BIN.y + BIN.d;
  out.push(
    line(
      [8, 14]
        .map((z) =>
          onFace(
            [
              [BIN.x + 0.6, z],
              [BIN.x + BIN.w - 0.6, z],
            ],
            y
          )
        )
        .join('') +
        [8, 14]
          .map((z) =>
            onSide(
              [
                [BIN.y + 0.6, z],
                [BIN.y + BIN.d - 0.6, z],
              ],
              BIN.x + BIN.w
            )
          )
          .join(''),
      'faint'
    )
  );
  const tag = { x0: BIN.x + 22, x1: BIN.x + 46, z0: 17, z1: 22.5 };
  out.push(
    solid(
      k.slabOf({ x: tag.x0, y, w: tag.x1 - tag.x0, d: 0.7, r: 0.3 }, tag.z0, tag.z1 - tag.z0, P, 2),
      'mid'
    )
  );
  out.push(
    dots(
      [
        [tag.x0 + 1.8, y + 0.7, (tag.z0 + tag.z1) / 2],
        [tag.x1 - 1.8, y + 0.7, (tag.z0 + tag.z1) / 2],
      ],
      0.4
    )
  );
  return out;
}

function feet(plan: Plan) {
  return byDepth(k.corners(plan, 9)).map(([x, y]) =>
    solid(k.cylinder(x, y, 4, 0, LIFT, P, 20), 'lo')
  );
}

function housing(): Item[] {
  const out: Item[] = [];
  const body: Plan = { x: X0, y: BACK, w: X1 - X0, d: FACE - BACK, r: 5 };
  out.push({
    kind: 'halo',
    d: k.haloOf({ x: X0, y: BACK, w: X1 - X0, d: FRONT - BACK, r: 6 }, 0, 6, P),
  });
  out.push(...feet({ x: X0, y: BACK, w: X1 - X0, d: FRONT - BACK, r: 6 }));
  const lid = 70;
  out.push(
    solid(
      k.slabOf(body, LIFT, HOUSING_TOP - LIFT, P, 6, 1.4),
      'mid',
      'faint',
      k.sideSeam(body, lid, P, 6)
    )
  );
  const slot: Plan = { x: TAPE.x0 - 1, y: -27, w: TAPE.x1 - TAPE.x0 + 2, d: 3, r: 1.2 };
  out.push({ kind: 'fill', d: k.planOutline(slot, HOUSING_TOP, P, 3), className: 'kvam-dark' });
  out.push(line(k.planOutline(slot, HOUSING_TOP, P, 3), 'lo'));
  const vents = Array.from({ length: 9 }, (_, index) =>
    k.planOutline({ x: 14 + index * 6.4, y: BACK + 8, w: 2, d: 34, r: 1 }, HOUSING_TOP, P, 3)
  ).join('');
  out.push(line(vents, 'faint'));
  out.push(
    line(
      k.planOutline(
        { x: X0 + 4, y: BACK + 4, w: X1 - X0 - 8, d: FACE - BACK - 8, r: 3 },
        HOUSING_TOP,
        P,
        4
      ),
      'faint'
    )
  );
  out.push(
    dots(
      [
        [X0 + 7, BACK + 7, HOUSING_TOP],
        [X1 - 7, BACK + 7, HOUSING_TOP],
        [X1 - 7, FACE - 7, HOUSING_TOP],
      ],
      0.45
    )
  );
  const apron: Plan = { x: TAPE.x0 - 4, y: FACE, w: TAPE.x1 - TAPE.x0 + 8, d: 0.8, r: 0.4 };
  out.push(solid(k.slabOf(apron, BED, 46, P, 2), 'lo'));
  out.push(
    dots(
      [
        [apron.x + 2, FACE + 0.8, BED + 43],
        [apron.x + apron.w - 2, FACE + 0.8, BED + 43],
      ],
      0.42
    )
  );
  const grille = Array.from({ length: 6 }, (_, index) =>
    slotOnFace(46 + index * 4.6, 46, 74, FACE)
  ).join('');
  out.push(line(grille, 'lo'));
  const plateFace = { x0: 10, x1: 34, z0: 44, z1: 56 };
  out.push(
    solid(
      k.slabOf(
        { x: plateFace.x0, y: FACE, w: plateFace.x1 - plateFace.x0, d: 0.7, r: 0.4 },
        plateFace.z0,
        plateFace.z1 - plateFace.z0,
        P,
        2
      ),
      'mid'
    )
  );
  out.push(
    line(
      [16, 11]
        .map((w, index) =>
          onFace(
            [
              [plateFace.x0 + 3, plateFace.z1 - 4 - index * 3],
              [plateFace.x0 + 3 + w, plateFace.z1 - 4 - index * 3],
            ],
            FACE + 0.7
          )
        )
        .join(''),
      'lo'
    )
  );
  out.push(dots([[plateFace.x1 - 2.4, FACE + 0.7, (plateFace.z0 + plateFace.z1) / 2]], 0.42));
  out.push(...counterWindow());
  out.push(
    line(
      onSide(
        [
          [BACK + 0.5, lid - 26],
          [FACE - 0.5, lid - 26],
        ],
        X1
      ),
      'faint'
    )
  );
  out.push(
    dots(
      [
        [X1, BACK + 6, 12],
        [X1, FACE - 6, 12],
        [X1, BACK + 6, lid - 6],
        [X1, FACE - 6, lid - 6],
      ],
      0.45
    )
  );
  const knob = prismX(circleYZ(-20, 76, 4.2, 24), X1, X1 + 5.5);
  out.push(solid(knob, 'mid'));
  out.push(line(knurlX(-20, 76, 4.2, X1 + 0.6, X1 + 4.9, 22), 'lo'));
  return out;
}

function counterWindow(): Item[] {
  const out: Item[] = [];
  const { x0, x1, z0, z1 } = COUNTER;
  out.push(
    solid(
      k.slabOf({ x: x0 - 2, y: FACE, w: x1 - x0 + 4, d: 0.9, r: 0.8 }, z0 - 2, z1 - z0 + 4, P, 3),
      'mid'
    )
  );
  out.push({
    kind: 'fill',
    d: onFace(
      [
        [x0, z0],
        [x1, z0],
        [x1, z1],
        [x0, z1],
      ],
      FACE + 0.9,
      true
    ),
    className: 'kvam-window',
  });
  out.push(
    line(
      onFace(
        [
          [(x0 + x1) / 2, z0],
          [(x0 + x1) / 2, z1],
        ],
        FACE + 0.9
      ),
      'faint'
    )
  );
  out.push(
    line(
      onFace(
        [
          [x0, z0],
          [x1, z0],
          [x1, z1],
          [x0, z1],
        ],
        FACE + 0.9,
        true
      ),
      'lo'
    )
  );
  return out;
}

function prismX(section: Plane[], x0: number, x1: number) {
  return k.prismX(section, x0, x1, P);
}

function knurlX(cy: number, cz: number, r: number, x0: number, x1: number, count: number) {
  const out: string[] = [];
  const view = [Math.sin((56 * Math.PI) / 180), Math.sin((28 * Math.PI) / 180)];
  for (let index = 0; index < count; index++) {
    const angle = (index / count) * Math.PI * 2;
    const ny = Math.cos(angle);
    const nz = Math.sin(angle);
    if (ny * view[0] * Math.cos((28 * Math.PI) / 180) + nz * view[1] < 0.2) continue;
    out.push(k.segment([x0, cy + r * ny, cz + r * nz], [x1, cy + r * ny, cz + r * nz], P));
  }
  return out.join('');
}

function roll(): Item[] {
  const out: Item[] = [];
  const arms = [TAPE.x0 - 6, TAPE.x1 + 2.5];
  const arm = (x: number) =>
    solid(
      k.slabOf(
        { x, y: ROLL.y - 4, w: 3.5, d: 8, r: 1.2 },
        HOUSING_TOP,
        ROLL.z - HOUSING_TOP + 3,
        P,
        3
      ),
      'mid'
    );
  out.push(arm(arms[0]));
  out.push(solid(prismX(circleYZ(ROLL.y, ROLL.z, 2, 16), arms[0] - 1.5, arms[1] + 5), 'mid'));
  out.push(
    solid(prismX(circleYZ(ROLL.y, ROLL.z, ROLL.r, 48), TAPE.x0 - 1, TAPE.x1 + 1), 'hi', 'lo')
  );
  out.push(
    line(
      [5.5, 9.5, 13]
        .map((r) => {
          const points = Array.from({ length: 41 }, (_, index) => {
            const angle = (index / 40) * Math.PI * 2;
            return at([TAPE.x1 + 1, ROLL.y + r * Math.cos(angle), ROLL.z + r * Math.sin(angle)]);
          });
          return k.pathOf(points, true);
        })
        .join(''),
      'faint'
    )
  );
  out.push(arm(arms[1]));
  out.push(solid(prismX(circleYZ(ROLL.y, ROLL.z, 3.4, 20), arms[1] + 3.5, arms[1] + 7), 'mid'));
  out.push(line(knurlX(ROLL.y, ROLL.z, 3.4, arms[1] + 3.9, arms[1] + 6.6, 16), 'lo'));
  const sheetTop = ROLL.y + ROLL.r * 0.42;
  const sheetZ = ROLL.z - ROLL.r * 0.91;
  out.push({
    kind: 'fill',
    d: k.pathOf(
      [
        at([TAPE.x0, sheetTop, sheetZ]),
        at([TAPE.x1, sheetTop, sheetZ]),
        at([TAPE.x1, -25.5, HOUSING_TOP]),
        at([TAPE.x0, -25.5, HOUSING_TOP]),
      ],
      true
    ),
    className: 'kvam-paper',
  });
  out.push(
    line(
      k.segment([TAPE.x0, sheetTop, sheetZ], [TAPE.x0, -25.5, HOUSING_TOP], P) +
        k.segment([TAPE.x1, sheetTop, sheetZ], [TAPE.x1, -25.5, HOUSING_TOP], P),
      'mid'
    )
  );
  return out;
}

export function curl(): string {
  const cy = TAPE.y - CURL_R;
  const points = (x: number) =>
    Array.from({ length: 25 }, (_, index) => {
      const angle = (index / 24) * Math.PI * 1.15;
      return [x, cy + CURL_R * Math.cos(angle), TAPE.top + CURL_R * Math.sin(angle)] as Point3;
    });
  const left = points(TAPE.x0);
  const right = points(TAPE.x1);
  return k.pathOf([...left.map(at), ...[...right].reverse().map(at)], true);
}

export function curlEdges(): string {
  const cy = TAPE.y - CURL_R;
  const edge = (x: number) =>
    k.pathOf(
      Array.from({ length: 25 }, (_, index) => {
        const angle = (index / 24) * Math.PI * 1.15;
        return at([x, cy + CURL_R * Math.cos(angle), TAPE.top + CURL_R * Math.sin(angle)]);
      })
    );
  const end = 1.15 * Math.PI;
  const tip = (x: number): Point3 => [
    x,
    cy + CURL_R * Math.cos(end),
    TAPE.top + CURL_R * Math.sin(end),
  ];
  return edge(TAPE.x0) + edge(TAPE.x1) + k.segment(tip(TAPE.x0), tip(TAPE.x1), P);
}

export function curlCrown(): string {
  const cy = TAPE.y - CURL_R;
  const points: Flat[] = [];
  for (let index = 0; index <= 40; index++) {
    const x = TAPE.x0 + ((TAPE.x1 - TAPE.x0) * index) / 40;
    points.push(at([x, cy, TAPE.top + CURL_R]));
  }
  return k.pathOf(points);
}

export const KEY_POSITIONS: { x: number; y: number; z: number; r: number }[] = [];

function keyboard(): { items: Item[][]; keys: Item[][]; bar: Item[] } {
  const items: Item[][] = STEPS.map(() => []);
  const columns = [-46, -28, -10];
  const layout: [number, number, number][] = [
    [7, 0, 1],
    [8, 1, 1],
    [9, 2, 1],
    [4, 0, 2],
    [5, 1, 2],
    [6, 2, 2],
    [1, 0, 3],
    [2, 1, 3],
    [3, 2, 3],
    [0, 0, 4],
  ];
  const keys: Item[][] = Array.from({ length: 10 }, () => []);
  for (const [digit, column, row] of layout) {
    const step = STEPS[row];
    const x = columns[column];
    const y = (step.y0 + step.y1) / 2;
    KEY_POSITIONS[digit] = { x, y, z: step.top, r: 5.6 };
  }
  for (const [digit] of layout) {
    const { x, y, z, r } = KEY_POSITIONS[digit];
    const wide = digit === 0;
    const parts: Item[] = [];
    if (wide) {
      const plan: Plan = { x: x - r, y: y - r, w: 18 + r * 2, d: r * 2, r };
      parts.push(solid(k.slabOf({ x: x - 2, y: y - 2, w: 22, d: 4, r: 2 }, z, 2.4, P, 3), 'lo'));
      parts.push(solid(k.slabOf(plan, z + 2.4, 3.4, P, 6, 0.6), 'hi', 'lo'));
      parts.push(line(k.planOutline(k.insetPlan(plan, 1.6), z + 5.8, P, 6), 'faint'));
    } else {
      parts.push(solid(k.cylinder(x, y, 2.2, z, 2.4, P, 14), 'lo'));
      parts.push(solid(k.cylinder(x, y, r, z + 2.4, 3.4, P, 30, 0.6), 'hi', 'lo'));
      parts.push(line(k.ring(x, y, r - 1.6, z + 5.8, P, 28), 'faint'));
    }
    keys[digit] = parts;
  }
  const funcs: [number, number][] = [
    [12, 1],
    [12, 2],
    [30, 1],
    [30, 2],
    [54, 1],
    [54, 2],
    [54, 3],
    [54, 4],
  ];
  for (const [x, row] of funcs) {
    const step = STEPS[row];
    const y = (step.y0 + step.y1) / 2;
    const plan: Plan = { x: x - 6, y: y - 5.4, w: 12, d: 10.8, r: 2.2 };
    items[row].push(solid(k.slabOf(k.insetPlan(plan, 2.4), step.top, 2.4, P, 3), 'lo'));
    items[row].push(solid(k.slabOf(plan, step.top + 2.4, 3.2, P, 4, 0.5)));
    items[row].push(line(k.planOutline(k.insetPlan(plan, 1.8), step.top + 5.6, P, 4), 'faint'));
  }
  const bar: Item[] = [];
  const barPlan: Plan = {
    x: 26,
    y: STEPS[3].y0 + 3,
    w: 14,
    d: STEPS[4].y1 - STEPS[3].y0 - 8,
    r: 3,
  };
  bar.push(solid(k.slabOf(k.insetPlan(barPlan, 3), STEPS[4].top, 2.4, P, 3), 'lo'));
  bar.push(solid(k.slabOf(barPlan, STEPS[3].top + 0.6, 3.4, P, 5, 0.6)));
  bar.push(line(k.planOutline(k.insetPlan(barPlan, 2), STEPS[3].top + 4, P, 5), 'faint'));
  return { items, keys, bar };
}

function lowerCase(): Item[][] {
  const groups: Item[][] = [];
  STEPS.forEach((step, index) => {
    const plan: Plan = {
      x: X0,
      y: step.y0,
      w: X1 - X0,
      d: step.y1 - step.y0,
      r: index === STEPS.length - 1 ? 5 : 0.6,
    };
    const items: Item[] = [
      solid(
        k.slabOf(plan, LIFT, step.top - LIFT, P, index === STEPS.length - 1 ? 6 : 2, 0.8),
        'mid',
        'faint',
        k.sideSeam(plan, PLINTH, P, index === STEPS.length - 1 ? 6 : 2)
      ),
    ];
    if (index > 0) {
      items.push(
        line(k.lineOnTop([X0 + 3, step.y0 + 1.6], [X1 - 3, step.y0 + 1.6], step.top, P), 'faint')
      );
    }
    groups.push(items);
  });
  const front = STEPS[STEPS.length - 1];
  const badge = { x0: -50, x1: -18, z0: 8, z1: 18 };
  groups[groups.length - 1].push(
    solid(
      k.slabOf(
        { x: badge.x0, y: FRONT, w: badge.x1 - badge.x0, d: 0.8, r: 0.5 },
        badge.z0,
        badge.z1 - badge.z0,
        P,
        2
      ),
      'mid'
    ),
    line(
      [20, 14]
        .map((w, index) =>
          onFace(
            [
              [badge.x0 + 3, badge.z1 - 3.6 - index * 3],
              [badge.x0 + 3 + w, badge.z1 - 3.6 - index * 3],
            ],
            FRONT + 0.8
          )
        )
        .join(''),
      'lo'
    ),
    dots([[badge.x1 - 2.4, FRONT + 0.8, (badge.z0 + badge.z1) / 2]], 0.42),
    dots(
      [
        [X0 + 6, FRONT, front.top - 4],
        [X1 - 6, FRONT, front.top - 4],
      ],
      0.45
    )
  );
  return groups;
}

function printUnit(): Item[] {
  const out: Item[] = [];
  const cover: Plan = { x: TAPE.x0 - 5, y: TAPE.y + 0.6, w: TAPE.x1 - TAPE.x0 + 9, d: 9, r: 1.6 };
  out.push(solid(k.slabOf(cover, BED, TAPE.print - 1 - BED, P, 3, 0.6), 'mid'));
  out.push(
    dots(
      [
        [cover.x + 2.4, cover.y + cover.d / 2, TAPE.print - 1],
        [cover.x + cover.w - 2.4, cover.y + cover.d / 2, TAPE.print - 1],
      ],
      0.45
    )
  );
  const tear: Plan = { x: TAPE.x0 - 3, y: TAPE.y + 0.3, w: TAPE.x1 - TAPE.x0 + 6, d: 1.2, r: 0.4 };
  out.push(solid(k.slabOf(tear, TAPE.print - 1, TEAR - TAPE.print + 1, P, 2), 'mid', 'none'));
  const teeth: Flat[] = [];
  const count = 28;
  for (let index = 0; index <= count; index++) {
    const x = tear.x + (tear.w * index) / count;
    teeth.push(at([x, tear.y + tear.d, index % 2 ? TEAR - 0.9 : TEAR]));
  }
  out.push(line(k.pathOf(teeth), 'mid'));
  for (const x of [cover.x + 1.2, cover.x + cover.w - 3.6]) {
    out.push(
      solid(
        k.slabOf(
          { x, y: TAPE.y + 0.3, w: 2.4, d: 2.2, r: 0.5 },
          TAPE.print - 1,
          TEAR - TAPE.print + 2.6,
          P,
          2
        ),
        'mid'
      )
    );
  }
  return out;
}

const SPOOLS = [TAPE.x0 + 4, TAPE.x1 - 4];
const RIBBON_Y = 12;

function ribbon(): Item[] {
  const out: Item[] = [];
  const z = BED;
  for (const x of SPOOLS) {
    out.push(solid(k.cylinder(x, RIBBON_Y, 6.2, z, 1.2, P, 32), 'mid'));
    out.push(
      solid(
        k.cylinder(x, RIBBON_Y, 5.2, z + 1.2, 4.2, P, 32),
        'hi',
        'lo',
        k.sideArc(x, RIBBON_Y, 5.2, z + 3.3, P, 20)
      )
    );
    out.push(solid(k.cylinder(x, RIBBON_Y, 6.2, z + 5.4, 1, P, 32), 'mid'));
    out.push(line(k.ring(x, RIBBON_Y, 2.2, z + 6.4, P, 18), 'lo'));
    out.push(dots([[x, RIBBON_Y, z + 6.4]], 0.6, 'hi'));
  }
  const band: Plan = { x: SPOOLS[0], y: RIBBON_Y + 4.6, w: SPOOLS[1] - SPOOLS[0], d: 0.7, r: 0.3 };
  out.push(solid(k.slabOf(band, z + 1.6, 3.2, P, 2), 'lo', 'none'));
  return out;
}

const HEAD = { x: (TAPE.x0 + TAPE.x1) / 2, y: 4, w: 10 };

function head(): Item[] {
  const out: Item[] = [];
  const base: Plan = { x: HEAD.x - HEAD.w / 2 - 2, y: HEAD.y + 3, w: HEAD.w + 4, d: 7, r: 1.2 };
  out.push(solid(k.slabOf(base, BED, 3, P, 3), 'lo'));
  return out;
}

export function headPaths() {
  const block: Plan = { x: HEAD.x - HEAD.w / 2, y: HEAD.y - 3, w: HEAD.w, d: 9, r: 1.4 };
  const nose: Plan = { x: HEAD.x - 3, y: HEAD.y - 6.5, w: 6, d: 4, r: 1 };
  return [k.slabOf(nose, BED + 2.4, 3.4, P, 3), k.slabOf(block, BED + 3, 4.6, P, 3, 0.5)];
}

export function crankPaths(turn: number) {
  const angle = Math.PI / 2 - turn * Math.PI * 2;
  const tipY = CRANK.y + Math.cos(angle) * CRANK.reach;
  const tipZ = CRANK.z + Math.sin(angle) * CRANK.reach;
  const arm: Plane[] = [];
  const half = 3;
  for (let index = 0; index <= 12; index++) {
    const a = angle + Math.PI / 2 + (index / 12) * Math.PI;
    arm.push([tipY + half * Math.cos(a), tipZ + half * Math.sin(a)]);
  }
  for (let index = 0; index <= 12; index++) {
    const a = angle - Math.PI / 2 + (index / 12) * Math.PI;
    arm.push([CRANK.y + (half + 1.6) * Math.cos(a), CRANK.z + (half + 1.6) * Math.sin(a)]);
  }
  return {
    arm: k.prismX(arm, CRANK.x + 3, CRANK.x + 5.4, P),
    grip: k.prismX(circleYZ(tipY, tipZ, 2.6, 20), CRANK.x + 5.4, CRANK.x + 15, P),
    cap: k.prismX(circleYZ(tipY, tipZ, 3.2, 20), CRANK.x + 15, CRANK.x + 16.4, P),
  };
}

function crankHub(): Item[] {
  return [
    solid(prismX(circleYZ(CRANK.y, CRANK.z, 9, 36), X1, X1 + 1.2), 'mid'),
    solid(prismX(circleYZ(CRANK.y, CRANK.z, 5.4, 28), X1 + 1.2, X1 + 3), 'mid'),
    dots(
      [0, 1, 2, 3].map((index) => {
        const a = (index / 4) * Math.PI * 2 + Math.PI / 4;
        return [X1 + 1.2, CRANK.y + 7.3 * Math.cos(a), CRANK.z + 7.3 * Math.sin(a)] as Point3;
      }),
      0.42
    ),
  ];
}

export function knifePaths() {
  const z = 0;
  const carriage: Plan = { x: KNIFE.x - 1, y: TAPE.y + 0.2, w: 6, d: 3.4, r: 0.8 };
  return {
    carriage: k.slabOf(carriage, z, 7, P, 2, 0.4),
    thumb: k.cylinder(KNIFE.x + 2, TAPE.y + 4.4, 1.6, z + 2, 3, P, 14),
  };
}

function knifeRail(): Item[] {
  const rail: Plan = { x: KNIFE.x + 0.6, y: FACE, w: 3.2, d: TAPE.y - FACE + 0.2, r: 0.6 };
  return [
    solid(k.slabOf(rail, BED, KNIFE.park + 10 - BED, P, 2), 'lo'),
    solid(
      k.slabOf({ x: KNIFE.x - 0.4, y: FACE, w: 5.2, d: 2.4, r: 0.6 }, KNIFE.park + 10, 2.2, P, 2),
      'mid'
    ),
    dots([[KNIFE.x + 2.2, FACE + 1.2, KNIFE.park + 12.2]], 0.42),
  ];
}

const keyboardParts = keyboard();
const caseGroups = lowerCase();

export const ART = {
  plate: plate(),
  binBack: binBack(),
  housing: [...housing(), ...roll()],
  binFront: binFront(),
  knifeRail: knifeRail(),
  steps: caseGroups,
  keysByRow: [[7, 8, 9], [4, 5, 6], [1, 2, 3], [0]],
  keys: keyboardParts.keys,
  funcs: keyboardParts.items,
  bar: keyboardParts.bar,
  printUnit: [...ribbon(), ...head(), ...printUnit()],
  hub: crankHub(),
};

export const HEAD_PATHS = headPaths();
export const KNIFE_PATHS = knifePaths();
export const KEY_DOWN = k.axisVector(P, [0, 0, -2.2]);
export const HEAD_STRIKE = k.axisVector(P, [0, -2.6, 0]);
export const UP = k.axisVector(P, [0, 0, 1]);

export const COUNTER_BOX = COUNTER;

export const TAPE_CLIP = {
  x: TAPE.x0,
  y: -(TAPE.top + 0.01),
  width: TAPE.x1 - TAPE.x0,
  height: TAPE.top - TAPE.print + 4,
};
