import { clamp, ease } from './physics';

type Cell = { x: number; y: number; brightness: number; kind: string; angle: number };

export function iconCells(sun: boolean) {
  const cells = new Map<string, Cell>();
  const add = (x: number, y: number, brightness: number, kind: string, angle = 0) => {
    const key = `${x},${y}`;
    if (!cells.has(key)) cells.set(key, { x, y, brightness, kind, angle });
  };
  for (let y = 0; y < 17; y++) {
    for (let x = 0; x < 17; x++) {
      const distance = Math.hypot(x - 8, y - 8);
      if (sun) {
        if (distance <= 3.7) add(x, y, 1, 'core');
      } else if (distance <= 6.6) {
        const shadow = Math.hypot(x - 11.3, y - 5.6) <= 5.4;
        const crater = (x === 3 && y === 9) || ((x === 6 || x === 4) && y === 12);
        if (!shadow || (x + y) % 2 === 0)
          add(x, y, crater ? 0.5 : shadow ? 0.2 : 1, shadow ? 'earth' : 'lit');
      }
    }
  }
  if (sun) {
    for (let index = 0; index < 8; index++) {
      const angle = (index * Math.PI) / 4;
      for (const radius of index % 2 ? [5.9, 7.2] : [5.6, 6.6, 7.6])
        add(
          Math.round(8 + Math.cos(angle) * radius),
          Math.round(8 + Math.sin(angle) * radius),
          1,
          'ray',
          angle
        );
    }
  } else {
    for (const [x, y, brightness] of [
      [15, 1, 1],
      [14, 1, 0.45],
      [16, 1, 0.45],
      [15, 0, 0.45],
      [15, 2, 0.45],
      [11, 0, 0.75],
      [16, 5, 0.6],
    ])
      add(x, y, brightness, 'star');
  }
  const order = (cell: Cell) =>
    ((Math.atan2(cell.y - 8, cell.x - 8) + Math.PI * 2.75) % (Math.PI * 2)) +
    Math.hypot(cell.x - 8, cell.y - 8) * 0.001;
  return [...cells.values()].sort((a, b) => order(a) - order(b));
}

export function createParticles() {
  const moon = iconCells(false);
  const sun = iconCells(true);
  const count = Math.max(moon.length, sun.length);
  const random = (index: number, salt: number) => {
    const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  return Array.from({ length: count }, (_, index) => {
    const endpoint = (cells: Cell[]) => {
      const position = Math.floor((index * cells.length) / count);
      const duplicate = index > 0 && position === Math.floor(((index - 1) * cells.length) / count);
      return { ...cells[position], brightness: duplicate ? 0 : cells[position].brightness };
    };
    const a = endpoint(moon);
    return {
      a,
      b: endpoint(sun),
      delay: 0.04 + (1 - a.x / 16) * 0.26 + random(index, 1) * 0.06,
      curl: (random(index, 2) * 2 - 1) * 16 + (a.y - 8) * 0.9,
      lift: 2 + random(index, 3) * 10,
      stiffness: 260 + random(index, 4) * 200,
      drag: 0.004 + random(index, 5) * 0.012,
      phase: random(index, 6) * Math.PI * 2,
      frequency: 1.5 + random(index, 7) * 1.7,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      initialized: false,
    };
  });
}

type Particle = ReturnType<typeof createParticles>[number];

export function pixelTarget(dot: Particle, progress: number, time: number) {
  const fraction = ease(clamp((progress - dot.delay) / 0.62));
  const arc = Math.sin(Math.PI * fraction);
  const dx = (dot.b.x - dot.a.x) * 5.7;
  const dy = (dot.b.y - dot.a.y) * 5.7;
  const length = Math.hypot(dx, dy) || 1;
  let x = (dot.a.x - 8) * 5.7 + dx * fraction - (dy / length) * dot.curl * 1.62 * arc;
  let y = (dot.a.y - 8) * 5.7 + dy * fraction + (dx / length) * dot.curl * 1.62 * arc;
  const radius = Math.hypot(x, y) || 1;
  const burst = dot.lift * arc * 1.4 * 0.38;
  x += (x / radius) * burst;
  y += (y / radius) * burst;
  const moonBrightness =
    dot.a.brightness *
    (dot.a.kind === 'star' ? 0.45 + 0.55 * Math.sin(time * dot.frequency + dot.phase) ** 2 : 1);
  const sunBrightness =
    dot.b.brightness *
    (dot.b.kind === 'ray' ? 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(time * 2.2 - dot.b.angle)) : 1);
  return {
    x,
    y,
    brightness: (moonBrightness + (sunBrightness - moonBrightness) * fraction) * (1 + 0.3 * arc),
    size: 4.6 * (1 - 0.45 * arc),
  };
}

export function createPixelRaster() {
  const sharp = document.createElement('canvas');
  const bloom = document.createElement('canvas');
  const context = sharp.getContext('2d')!;
  const glow = bloom.getContext('2d')!;
  const particles = createParticles();
  let dpr = 1;
  return {
    sharp,
    bloom,
    resize(nextDpr: number) {
      dpr = nextDpr;
      sharp.width = sharp.height = Math.round(192 * dpr);
      bloom.width = bloom.height = Math.round(96 * dpr);
    },
    draw(progress: number, velocity: number, time: number, dt: number, immediate: boolean) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, sharp.width, sharp.height);
      context.setTransform(dpr, 0, 0, dpr, 96 * dpr, 96 * dpr);
      context.fillStyle = '#fff';
      for (const dot of particles) {
        const target = pixelTarget(dot, progress, immediate ? 0 : time);
        if (!dot.initialized || immediate) {
          dot.x = target.x;
          dot.y = target.y;
          dot.vx = dot.vy = 0;
          dot.initialized = true;
        }
        for (let index = 0; index < 4; index++) {
          const h = dt / 4;
          const damping = 2 * Math.sqrt(dot.stiffness) * 0.72;
          dot.vx += ((target.x - dot.x) * dot.stiffness - dot.vx * damping) * h;
          dot.vy += ((target.y - dot.y) * dot.stiffness - dot.vy * damping) * h;
          dot.x += dot.vx * h;
          dot.y += dot.vy * h;
        }
        const inertia = immediate ? 0 : clamp(-velocity * 208 * dot.drag, -14, 14);
        context.globalAlpha = clamp(target.brightness);
        context.fillRect(
          dot.x + inertia - target.size / 2,
          dot.y - target.size / 2,
          target.size,
          target.size
        );
      }
      glow.clearRect(0, 0, bloom.width, bloom.height);
      glow.filter = `blur(${2 * dpr}px)`;
      glow.drawImage(sharp, 0, 0, bloom.width, bloom.height);
      glow.filter = 'none';
    },
  };
}
