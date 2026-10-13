export type Lang = 'en' | 'fr';

export const TOKENS: Record<Lang, string[]> = {
  en: ['The', 'cache', 'is', 'a', 'prefix', 'match', 'rule', '.'],
  fr: ['Le', 'cache', 'lit', 'le', 'début', 'du', 'texte', '.'],
};

export const REPLACEMENT: Record<Lang, string> = { en: 'suffix', fr: 'bout' };

export const CHANGED = 4;
export const COUNT = 8;
export const SEED = '0000';
export const KEY_COUNT = 10;

export function fnv1a(text: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 0x01000193);
  }
  return hash >>> 0;
}

export const hex4 = (value: number) => value.toString(16).padStart(8, '0').slice(0, 4);

export function chain(tokens: string[]) {
  const hashes: string[] = [];
  let previous = SEED;
  for (const token of tokens) {
    previous = hex4(fnv1a(previous + token));
    hashes.push(previous);
  }
  return hashes;
}

export interface PrintedLine {
  index: number;
  token: string;
  hash: string;
}

export function tapeOf(lang: Lang) {
  const before = TOKENS[lang];
  const after = before.map((token, index) => (index === CHANGED ? REPLACEMENT[lang] : token));
  const lineOf = (tokens: string[]) => {
    const hashes = chain(tokens);
    return tokens.map((token, index) => ({ index, token, hash: hashes[index] }));
  };
  return { before: lineOf(before), after: lineOf(after) };
}

export const keysOf = (token: string) =>
  Array.from(token, (char) => char.charCodeAt(0) % KEY_COUNT);

const CYCLE = 1.3;
const KEYING = 0.5;
const CRANK_AT = 0.5;
const CRANK_FOR = 0.5;
const STRIKE_AT = 0.8;
const FEED_AT = 0.86;
const FEED_FOR = 0.3;
const LEAD = 0.6;
const HOLD = 1.4;
const KNIFE_FOR = 0.9;
const SWEEP_FOR = 0.35;
const FALL_FOR = 1.3;
const MARK_FOR = 0.6;
const SETTLE = 0.4;
const DONE_HOLD = 4.2;
const FADE_FOR = 0.9;

const PREFILL_FROM = LEAD;
const PREFILL_TO = PREFILL_FROM + COUNT * CYCLE;
const CHANGE_FROM = PREFILL_TO + HOLD;
const SWEEP_FROM = CHANGE_FROM + KNIFE_FOR;
const FALL_FROM = SWEEP_FROM + SWEEP_FOR;
const MARK_FROM = FALL_FROM + FALL_FOR * 0.6;
const REPRINT_FROM = FALL_FROM + FALL_FOR + SETTLE;
const REPRINT_TO = REPRINT_FROM + (COUNT - CHANGED) * CYCLE;
const FADE_FROM = REPRINT_TO + DONE_HOLD;

export const TIMES = {
  prefillTo: PREFILL_TO,
  change: CHANGE_FROM,
  reprintTo: REPRINT_TO,
  loop: FADE_FROM + FADE_FOR,
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const easeInOut = (value: number) => {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const pulse = (age: number, rise: number, fall: number) =>
  age < 0 ? 0 : age < rise ? smooth(age / rise) : Math.exp(-(age - rise) / fall);

export type Phase = 'prefill' | 'printed' | 'change' | 'reprint' | 'done';

export type Accent =
  { kind: 'head' } | { kind: 'knife' } | { kind: 'line'; index: number } | { kind: 'none' };

export interface Frame {
  phase: Phase;
  oldFeed: number;
  newFeed: number;
  oldInk: number[];
  newInk: number[];
  crank: number;
  strike: number;
  keys: number[];
  bar: number;
  knife: number;
  sweep: number;
  cut: boolean;
  fall: number;
  mark: number;
  fade: number;
  printed: number;
  reprinted: number;
  accent: Accent;
}

interface Cycle {
  crank: number;
  strike: number;
  feed: number;
  ink: number;
  keys: number[];
  bar: number;
}

function cycleAt(age: number, token: string): Cycle {
  const keys = new Array<number>(KEY_COUNT).fill(0);
  const codes = keysOf(token);
  const gap = Math.min(0.12, KEYING / Math.max(1, codes.length));
  codes.forEach((key, order) => {
    const local = age - order * gap;
    if (local >= 0 && local < 0.16) keys[key] = Math.max(keys[key], pulse(local, 0.04, 0.03));
  });
  const crank = easeInOut((age - CRANK_AT) / CRANK_FOR);
  const bar =
    age >= CRANK_AT - 0.08 && age < CRANK_AT + CRANK_FOR + 0.15
      ? smooth((age - CRANK_AT + 0.08) / 0.1) * (1 - smooth((age - CRANK_AT - CRANK_FOR) / 0.15))
      : 0;
  return {
    crank,
    strike: pulse(age - STRIKE_AT, 0.05, 0.06),
    feed: easeInOut((age - FEED_AT) / FEED_FOR),
    ink: smooth((age - STRIKE_AT - 0.02) / 0.06),
    keys,
    bar,
  };
}

const NONE = new Array<number>(KEY_COUNT).fill(0);

export function frameAt(t: number, tokensBefore: string[], tokensAfter: string[]): Frame {
  const oldInk = new Array<number>(COUNT).fill(0);
  const newInk = new Array<number>(COUNT).fill(0);
  let oldFeed = 0;
  let newFeed = 0;
  let crank = 0;
  let strike = 0;
  let keys = NONE;
  let bar = 0;
  let printed = 0;
  let reprinted = 0;
  let phase: Phase = 'prefill';
  let accent: Accent = { kind: 'head' };

  for (let index = 0; index < COUNT; index++) {
    const age = t - (PREFILL_FROM + index * CYCLE);
    if (age < 0) break;
    const cycle = cycleAt(Math.min(age, CYCLE), tokensBefore[index]);
    oldInk[index] = cycle.ink;
    oldFeed = index + cycle.feed;
    crank = index + cycle.crank;
    if (age < CYCLE) {
      strike = cycle.strike;
      keys = cycle.keys;
      bar = cycle.bar;
    }
    if (cycle.ink > 0.5) printed = index + 1;
  }

  const sweep = smooth((t - SWEEP_FROM) / SWEEP_FOR);
  const cut = t >= SWEEP_FROM + SWEEP_FOR * 0.55;
  const fall = clamp01((t - FALL_FROM) / FALL_FOR);
  const mark = smooth((t - MARK_FROM) / MARK_FOR);
  const knifeDown = easeInOut((t - CHANGE_FROM) / KNIFE_FOR);
  const knifeUp = easeInOut((t - REPRINT_FROM) / 1.2);
  const knife = knifeDown * (1 - knifeUp);

  if (t >= PREFILL_TO) phase = 'printed';
  if (t >= CHANGE_FROM) phase = 'change';
  if (t >= PREFILL_TO) accent = { kind: 'none' };
  if (t >= CHANGE_FROM && t < REPRINT_FROM) accent = { kind: 'knife' };

  for (let index = CHANGED; index < COUNT; index++) {
    const age = t - (REPRINT_FROM + (index - CHANGED) * CYCLE);
    if (age < 0) break;
    phase = 'reprint';
    const cycle = cycleAt(Math.min(age, CYCLE), tokensAfter[index]);
    newInk[index] = cycle.ink;
    newFeed = index - CHANGED + cycle.feed;
    crank = index + 4 + cycle.crank;
    if (age < CYCLE) {
      strike = cycle.strike;
      keys = cycle.keys;
      bar = cycle.bar;
    }
    if (cycle.ink > 0.5) reprinted = index - CHANGED + 1;
    accent = cycle.ink > 0 ? { kind: 'line', index } : { kind: 'head' };
  }

  if (t >= REPRINT_TO) {
    phase = 'done';
    accent = { kind: 'line', index: CHANGED };
  }

  return {
    phase,
    oldFeed,
    newFeed,
    oldInk,
    newInk,
    crank,
    strike,
    keys,
    bar,
    knife,
    sweep,
    cut,
    fall,
    mark,
    fade: 1 - smooth((t - FADE_FROM) / FADE_FOR),
    printed,
    reprinted,
    accent,
  };
}
