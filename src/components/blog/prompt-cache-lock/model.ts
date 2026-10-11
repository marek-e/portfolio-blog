export type Ttl = 5 | 60;

export const SYSTEM_TOKENS = 20_000;
export const MEMORY_TOKENS = 4_000;
export const TURN_TOKENS = 6_000;
export const FIRST_TURNS = 3;
export const MOST_TURNS = 6;
export const CUTS = 2 + MOST_TURNS;
export const WAIT_MINUTES = 10;

export const PRICE = {
  input: 4,
  read: 0.2,
  write: { 5: 5, 60: 8 } as Record<Ttl, number>,
};

export interface Entry {
  version: number;
  length: number;
}

export interface Turn {
  total: number;
  read: number;
  written: number;
  cost: number;
  uncached: number;
}

export interface Scene {
  ttl: Ttl;
  turns: number;
  version: number;
  entry: Entry | null;
  idle: number;
  matched: number;
  last: Turn;
  waited: boolean;
}

const SHAPE = [3, 1, 4, 0, 2, 4, 1, 3];
const DEPTHS = 5;

export const blocksOf = (turns: number) => [
  SYSTEM_TOKENS,
  MEMORY_TOKENS,
  ...Array.from({ length: turns }, () => TURN_TOKENS),
];

export const depthOf = (index: number, version: number) =>
  (SHAPE[index % SHAPE.length]! + 2 * version) % DEPTHS;

export const depthsOf = (length: number, version: number) =>
  Array.from({ length }, (_, index) => depthOf(index, version));

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export function priceOf(blocks: number[], matched: number, ttl: Ttl): Turn {
  const total = sum(blocks);
  const read = sum(blocks.slice(0, matched));
  const written = total - read;
  return {
    total,
    read,
    written,
    cost: (read * PRICE.read + written * PRICE.write[ttl]) / 1e6,
    uncached: (total * PRICE.input) / 1e6,
  };
}

export const isLive = (scene: Scene) => scene.entry !== null && scene.idle < scene.ttl;

export function send(scene: Scene, changeSystem = false): Scene {
  const turns = Math.min(scene.turns + 1, MOST_TURNS);
  const version = scene.version + (changeSystem ? 1 : 0);
  const blocks = blocksOf(turns);
  const entry = isLive(scene) ? scene.entry : null;
  const matched = entry && entry.version === version ? Math.min(entry.length, blocks.length) : 0;
  return {
    ttl: scene.ttl,
    turns,
    version,
    entry: { version, length: blocks.length },
    idle: 0,
    matched,
    last: priceOf(blocks, matched, scene.ttl),
    waited: false,
  };
}

export function wait(scene: Scene, minutes = WAIT_MINUTES): Scene {
  const idle = scene.idle + minutes;
  return {
    ...scene,
    idle,
    entry: scene.entry && idle < scene.ttl ? scene.entry : null,
    waited: true,
  };
}

export function sceneOf(ttl: Ttl): Scene {
  const before: Scene = {
    ttl,
    turns: FIRST_TURNS - 1,
    version: 0,
    entry: { version: 0, length: 2 + FIRST_TURNS - 1 },
    idle: 0,
    matched: 0,
    last: priceOf(blocksOf(FIRST_TURNS - 1), 0, ttl),
    waited: false,
  };
  return send(before);
}

export const remainingOf = (scene: Scene) =>
  scene.entry ? Math.max(0, scene.ttl - scene.idle) : 0;

export const atMost = (scene: Scene) => scene.turns >= MOST_TURNS;

export const nextRead = (scene: Scene) =>
  isLive(scene) ? sum(blocksOf(scene.turns).slice(0, scene.entry!.length)) : 0;

export const nextTotal = (scene: Scene) => sum(blocksOf(scene.turns));
