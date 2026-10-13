export type Flat = [number, number];
export type Point3 = [number, number, number];
export type Plane = [number, number];

export interface Projection {
  origin: Flat;
  scale: number;
  azimuth: number;
  elevation: number;
}

export interface Plan {
  x: number;
  y: number;
  w: number;
  d: number;
  r: number;
}

export interface SolidPaths {
  fill: string;
  outline: string;
  crease: string;
  top: string;
  shades: string[];
  bevel?: string;
}

const SHADES = 4;
const RADIANS = Math.PI / 180;
const UNIT = Math.sqrt(1.6);

export function cameraOf({ scale, azimuth, elevation }: Projection) {
  const a = azimuth * RADIANS;
  const e = elevation * RADIANS;
  return {
    sinA: Math.sin(a),
    cosA: Math.cos(a),
    sinE: Math.sin(e),
    cosE: Math.cos(e),
    k: scale * UNIT,
  };
}

export function iso([x, y, z]: Point3, projection: Projection): Flat {
  const { origin } = projection;
  const { sinA, cosA, sinE, cosE, k } = cameraOf(projection);
  return [
    origin[0] + (x * sinA - y * cosA) * k,
    origin[1] + ((x * cosA + y * sinA) * sinE - z * cosE) * k,
  ];
}

export function towardViewer(projection: Projection): Plane {
  const { sinA, cosA } = cameraOf(projection);
  return [cosA, sinA];
}

export function depthOf([x, y, z]: Point3, projection: Projection) {
  const { sinA, cosA, sinE, cosE } = cameraOf(projection);
  return (x * cosA + y * sinA) * cosE + z * sinE;
}

const tenth = (value: number) => {
  const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, '');
  return text === '-0' ? '0' : text;
};

export function pathOf(points: Flat[], closed = false) {
  if (!points.length) return '';
  return (
    points.map(([x, y], at) => `${at ? 'L' : 'M'}${tenth(x)} ${tenth(y)}`).join('') +
    (closed ? 'Z' : '')
  );
}

export function roundedPlan({ x, y, w, d, r }: Plan, steps = 8): Plane[] {
  const radius = Math.max(0, Math.min(r, w / 2, d / 2));
  const corners: [number, number, number][] = [
    [x + w - radius, y + radius, -90],
    [x + w - radius, y + d - radius, 0],
    [x + radius, y + d - radius, 90],
    [x + radius, y + radius, 180],
  ];
  const out: Plane[] = [];
  for (const [cx, cy, start] of corners) {
    const count = radius > 0 ? steps : 0;
    for (let step = 0; step <= count; step++) {
      const angle = (start + (count ? (90 * step) / count : 45)) * RADIANS;
      out.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
  }
  return out;
}

function signedArea(points: Flat[]) {
  let area = 0;
  for (let index = 0; index < points.length; index++) {
    const [ax, ay] = points[index];
    const [bx, by] = points[(index + 1) % points.length];
    area += ax * by - bx * ay;
  }
  return area / 2;
}

const oriented = (points: Flat[]) => (signedArea(points) < 0 ? [...points].reverse() : points);

export function convexHull(points: Flat[]): Flat[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (sorted.length < 3) return sorted;
  const cross = (o: Flat, a: Flat, b: Flat) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Flat[] = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0)
      lower.pop();
    lower.push(point);
  }
  const upper: Flat[] = [];
  for (let index = sorted.length - 1; index >= 0; index--) {
    const point = sorted[index];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0)
      upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function runsOf(flags: boolean[], want: boolean) {
  const count = flags.length;
  const runs: number[][] = [];
  const start = flags.findIndex((flag, index) => flag !== flags[(index + count - 1) % count]);
  if (start < 0)
    return flags[0] === want
      ? [Array.from({ length: count + 1 }, (_, index) => index % count)]
      : [];
  let run: number[] | null = null;
  for (let step = 0; step < count; step++) {
    const index = (start + step) % count;
    if (flags[index] === want) {
      if (!run) run = [index];
      run.push((index + 1) % count);
    } else if (run) {
      runs.push(run);
      run = null;
    }
  }
  if (run) runs.push(run);
  return runs;
}

export function extrude(
  ring: Plane[],
  z: number,
  height: number,
  projection: Projection,
  bevelBy = 0
): SolidPaths {
  const count = ring.length;
  const counter = signedArea(ring) > 0;
  const [vx, vy] = towardViewer(projection);
  const { sinA, cosA } = cameraOf(projection);
  const normals = ring.map(([ax, ay], index) => {
    const [bx, by] = ring[(index + 1) % count];
    const dx = bx - ax;
    const dy = by - ay;
    const length = Math.hypot(dx, dy) || 1;
    return (counter ? [dy / length, -dx / length] : [-dy / length, dx / length]) as Plane;
  });
  const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
  const top = ring.map(([x, y]) => iso([x, y, z + height], projection));
  const bottom = ring.map(([x, y]) => iso([x, y, z], projection));
  const outline: string[] = [];
  const crease: string[] = [];
  for (const run of runsOf(facing, false)) outline.push(pathOf(run.map((index) => top[index])));
  for (const run of runsOf(facing, true)) {
    crease.push(pathOf(run.map((index) => top[index])));
    if (height > 0) outline.push(pathOf(run.map((index) => bottom[index])));
  }
  if (height > 0) {
    for (let index = 0; index < count; index++) {
      if (facing[(index + count - 1) % count] !== facing[index])
        outline.push(pathOf([top[index], bottom[index]]));
    }
  }
  const buckets: string[][] = Array.from({ length: SHADES }, () => []);
  if (height > 0) {
    const [lx, ly] = [-sinA, cosA];
    for (let index = 0; index < count; index++) {
      if (!facing[index]) continue;
      const [nx, ny] = normals[index];
      const lit = (nx * lx + ny * ly + 1) / 2;
      const shade = Math.min(SHADES - 1, Math.max(0, Math.floor(lit * SHADES)));
      const next = (index + 1) % count;
      buckets[shade].push(
        pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true)
      );
    }
  }
  let bevel: string | undefined;
  if (bevelBy > 0) {
    const inset = ring.map(([x, y], index) => {
      const [ax, ay] = normals[(index + count - 1) % count];
      const [bx, by] = normals[index];
      const mx = ax + bx;
      const my = ay + by;
      const length = Math.hypot(mx, my) || 1;
      return iso(
        [x - (mx / length) * bevelBy, y - (my / length) * bevelBy, z + height],
        projection
      );
    });
    bevel = runsOf(facing, true)
      .map((run) =>
        pathOf([
          top[run[0]],
          ...run.slice(1, -1).map((index) => inset[index]),
          top[run[run.length - 1]],
        ])
      )
      .join('');
  }
  return {
    fill: pathOf(convexHull([...top, ...bottom]), true),
    outline: outline.join(''),
    crease: crease.join(''),
    top: pathOf(oriented(top), true),
    shades: buckets.map((paths) => paths.join('')),
    bevel,
  };
}

export const slabOf = (
  plan: Plan,
  z: number,
  height: number,
  projection: Projection,
  steps = 8,
  bevel = 0
) => extrude(roundedPlan(plan, steps), z, height, projection, bevel);

export function circleRing(cx: number, cy: number, radius: number, steps = 40): Plane[] {
  return Array.from({ length: steps }, (_, step) => {
    const angle = (step / steps) * Math.PI * 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)] as Plane;
  });
}

export const cylinder = (
  cx: number,
  cy: number,
  radius: number,
  z: number,
  height: number,
  projection: Projection,
  steps = 32,
  bevel = 0
) => extrude(circleRing(cx, cy, radius, steps), z, height, projection, bevel);

export const insetPlan = ({ x, y, w, d, r }: Plan, by: number): Plan => ({
  x: x + by,
  y: y + by,
  w: w - by * 2,
  d: d - by * 2,
  r: Math.max(0, r - by),
});

export const onTop = (points: Plane[], z: number, projection: Projection, closed = false) =>
  pathOf(
    points.map(([x, y]) => iso([x, y, z], projection)),
    closed
  );

export const planOutline = (plan: Plan, z: number, projection: Projection, steps = 8) =>
  onTop(roundedPlan(plan, steps), z, projection, true);

export const lineOnTop = (from: Plane, to: Plane, z: number, projection: Projection) =>
  onTop([from, to], z, projection);

export const segment = (from: Point3, to: Point3, projection: Projection) =>
  pathOf([iso(from, projection), iso(to, projection)]);

export const ring = (
  cx: number,
  cy: number,
  radius: number,
  z: number,
  projection: Projection,
  steps = 40
) => onTop(circleRing(cx, cy, radius, steps), z, projection, true);

export function corners({ x, y, w, d }: Plan, inset = 0): Plane[] {
  return [
    [x + inset, y + inset],
    [x + w - inset, y + inset],
    [x + inset, y + d - inset],
    [x + w - inset, y + d - inset],
  ];
}

export function boxCorners({ x, y, w, d }: Plan, z0: number, z1: number): Point3[] {
  const out: Point3[] = [];
  for (const px of [x, x + w])
    for (const py of [y, y + d]) for (const z of [z0, z1]) out.push([px, py, z]);
  return out;
}

export function knurl(
  cx: number,
  cy: number,
  radius: number,
  z0: number,
  z1: number,
  count: number,
  projection: Projection,
  inset = 0.4
) {
  const [vx, vy] = towardViewer(projection);
  const lines: string[] = [];
  for (let index = 0; index < count; index++) {
    const angle = (index / count) * Math.PI * 2;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    if (nx * vx + ny * vy < 0.15) continue;
    lines.push(
      segment(
        [cx + radius * nx, cy + radius * ny, z0 + inset],
        [cx + radius * nx, cy + radius * ny, z1 - inset],
        projection
      )
    );
  }
  return lines.join('');
}

export function sideArc(
  cx: number,
  cy: number,
  radius: number,
  z: number,
  projection: Projection,
  steps = 24
) {
  const [vx, vy] = towardViewer(projection);
  const facing = Math.atan2(vy, vx);
  const points: Flat[] = [];
  for (let step = 0; step <= steps; step++) {
    const angle = facing - Math.PI / 2 + (step / steps) * Math.PI;
    points.push(iso([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z], projection));
  }
  return pathOf(points);
}

export function sideSeam(plan: Plan, z: number, projection: Projection, steps = 8) {
  const ring = roundedPlan(plan, steps);
  const count = ring.length;
  const counter = signedArea(ring) > 0;
  const [vx, vy] = towardViewer(projection);
  const facing = ring.map(([ax, ay], index) => {
    const [bx, by] = ring[(index + 1) % count];
    const [nx, ny] = counter ? [by - ay, -(bx - ax)] : [-(by - ay), bx - ax];
    return nx * vx + ny * vy > 1e-9;
  });
  return runsOf(facing, true)
    .map((run) => pathOf(run.map((index) => iso([ring[index][0], ring[index][1], z], projection))))
    .join('');
}

export function axisVector(projection: Projection, [dx, dy, dz]: Point3): Flat {
  const origin = iso([0, 0, 0], projection);
  const moved = iso([dx, dy, dz], projection);
  return [moved[0] - origin[0], moved[1] - origin[1]];
}

export function translateAlong(projection: Projection, by: Point3) {
  const [x, y] = axisVector(projection, by);
  return `translate(${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100})`;
}

const thousandth = (value: number) => Math.round(value * 1000) / 1000;

export function frontMatrix(y: number, projection: Projection) {
  const origin = iso([0, y, 0], projection);
  const x = axisVector(projection, [1, 0, 0]);
  const up = axisVector(projection, [0, 0, 1]);
  return `matrix(${thousandth(x[0])} ${thousandth(x[1])} ${thousandth(-up[0])} ${thousandth(-up[1])} ${thousandth(origin[0])} ${thousandth(origin[1])})`;
}

export function fitProjection(
  points: Point3[],
  width: number,
  height: number,
  { pad = 24, azimuth = 45, elevation = 30 } = {}
): Projection {
  const unit: Projection = { origin: [0, 0], scale: 1, azimuth, elevation };
  const flat = points.map((point) => iso(point, unit));
  const xs = flat.map(([x]) => x);
  const ys = flat.map(([, y]) => y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const up = Math.min(...ys);
  const down = Math.max(...ys);
  const scale = Math.min((width - pad * 2) / (right - left), (height - pad * 2) / (down - up));
  return {
    origin: [width / 2 - ((left + right) / 2) * scale, height / 2 - ((up + down) / 2) * scale],
    scale,
    azimuth,
    elevation,
  };
}

export const haloOf = (plan: Plan, z: number, height: number, projection: Projection) =>
  slabOf(plan, z, height, projection).fill;

export function prismX(
  section: Plane[],
  x0: number,
  x1: number,
  projection: Projection
): SolidPaths {
  const count = section.length;
  const { sinA, cosA, sinE, cosE } = cameraOf(projection);
  let area = 0;
  for (let index = 0; index < count; index++) {
    const [ay, az] = section[index];
    const [by, bz] = section[(index + 1) % count];
    area += ay * bz - by * az;
  }
  const counter = area > 0;
  const view: Point3 = [cosA * cosE, sinA * cosE, sinE];
  const light: Point3 = [0.2, cosA * 0.7, 0.68];
  const near = section.map(([y, z]) => iso([x1, y, z], projection));
  const far = section.map(([y, z]) => iso([x0, y, z], projection));
  const facing: boolean[] = [];
  const buckets: string[][] = Array.from({ length: SHADES }, () => []);
  for (let index = 0; index < count; index++) {
    const [ay, az] = section[index];
    const [by, bz] = section[(index + 1) % count];
    const dy = by - ay;
    const dz = bz - az;
    const length = Math.hypot(dy, dz) || 1;
    const [ny, nz] = counter ? [dz / length, -dy / length] : [-dz / length, dy / length];
    const seen = ny * view[1] + nz * view[2] > 1e-9;
    facing.push(seen);
    if (!seen) continue;
    const lit = (ny * light[1] + nz * light[2] + 1) / 2;
    const shade = Math.min(SHADES - 1, Math.max(0, Math.floor(lit * SHADES)));
    const next = (index + 1) % count;
    buckets[shade].push(pathOf(oriented([near[index], near[next], far[next], far[index]]), true));
  }
  const capSeen = view[0] > 0;
  const cap = capSeen ? near : far;
  const hull = convexHull([...near, ...far]);
  const outline: string[] = [pathOf(hull, true)];
  const crease: string[] = [];
  for (const run of runsOf(facing, true)) crease.push(pathOf(run.map((index) => cap[index])));
  return {
    fill: pathOf(hull, true),
    outline: outline.join(''),
    crease: crease.join(''),
    top: pathOf(oriented(cap), true),
    shades: buckets.map((paths) => paths.join('')),
  };
}
