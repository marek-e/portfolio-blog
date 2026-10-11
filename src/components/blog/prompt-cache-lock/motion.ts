import { BLANK, KEY_TRAVEL, cutTopOf, keyPinOf, type StackFrame } from './geometry';
import { CUTS, blocksOf, depthOf, isLive, remainingOf, type Scene } from './model';

export type Move = 'send' | 'wait';

export interface Frame {
  keyShift: number;
  tops: number[];
  stacks: StackFrame[];
  cam: number;
  dial: number;
  seated: boolean;
}

export const SEND = {
  camBack: [0, 0.4],
  out: [0.4, 0.95],
  recut: [0.95, 1.7],
  in: [1.7, 2.4],
  seat: 2.4,
  repin: [2.6, 3.4],
  turn: [3.4, 3.9],
  end: 3.9,
} as const;

export const WAIT = { sweep: [0, 1.4], fall: [1.3, 1.95], end: 1.95 } as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (t: number) => {
  const u = clamp(t);
  return u * u * (3 - 2 * u);
};
const span = (t: number, [from, to]: readonly [number, number]) => ease((t - from) / (to - from));
const mix = (a: number, b: number, share: number) => a + (b - a) * share;

const topsOf = (scene: Scene) => {
  const length = blocksOf(scene.turns).length;
  return Array.from({ length: CUTS }, (_, index) =>
    index < length ? cutTopOf(depthOf(index, scene.version)) : BLANK
  );
};

const stacksOf = (scene: Scene): StackFrame[] =>
  Array.from({ length: CUTS }, (_, index) => {
    const entry = scene.entry;
    const present = entry !== null && index < entry.length;
    return {
      shown: present ? 1 : 0,
      drop: 0,
      length: keyPinOf(depthOf(index, entry?.version ?? 0)),
      lit: present && index < scene.matched,
    };
  });

export function restOf(scene: Scene): Frame {
  return {
    keyShift: 0,
    tops: topsOf(scene),
    stacks: stacksOf(scene),
    cam: 1,
    dial: remainingOf(scene) / scene.ttl,
    seated: true,
  };
}

export function sendFrame(from: Scene, to: Scene, t: number): Frame {
  const a = restOf(from);
  const b = restOf(to);
  const live = isLive(from);
  const before = live ? a.stacks : a.stacks.map((stack) => ({ ...stack, shown: 0 }));
  const seated = t >= SEND.seat;
  const repin = span(t, SEND.repin);
  const recut = span(t, SEND.recut);
  const stacks = b.stacks.map((target, index) => {
    const old = before[index]!;
    const lit = seated && target.lit;
    if (target.shown === 0) return target;
    if (index < to.matched) return { ...target, lit };
    if (old.shown > 0)
      return { shown: 1, drop: 0, length: mix(old.length, target.length, repin), lit };
    return { shown: repin, drop: 7 * (1 - repin), length: target.length, lit };
  });
  const keyShift =
    t < SEND.recut[0]
      ? -KEY_TRAVEL * span(t, SEND.out)
      : t < SEND.in[0]
        ? -KEY_TRAVEL
        : -KEY_TRAVEL * (1 - span(t, SEND.in));
  return {
    keyShift,
    tops: a.tops.map((top, index) => mix(top, b.tops[index]!, recut)),
    stacks,
    cam: t < SEND.turn[0] ? 1 - span(t, SEND.camBack) : span(t, SEND.turn),
    dial: mix(a.dial, 1, span(t, [0, 0.45])),
    seated,
  };
}

export function waitFrame(from: Scene, to: Scene, t: number): Frame {
  const a = restOf(from);
  const expires = from.entry !== null && to.entry === null;
  const fall = span(t, WAIT.fall);
  const stacks = a.stacks.map((stack) =>
    expires && t >= WAIT.fall[0]
      ? { ...stack, shown: stack.shown * (1 - fall), drop: -2.5 * fall, lit: false }
      : stack
  );
  return {
    ...a,
    stacks,
    dial: mix(a.dial, remainingOf(to) / to.ttl, span(t, WAIT.sweep)),
    seated: t >= WAIT.end,
  };
}

export const frameOf = (move: Move, from: Scene, to: Scene, t: number) =>
  move === 'send' ? sendFrame(from, to, t) : waitFrame(from, to, t);

export const endOf = (move: Move) => (move === 'send' ? SEND.end : WAIT.end);
