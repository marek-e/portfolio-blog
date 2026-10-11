import type { Flat, SolidPaths } from './iso';
import {
  CUT,
  FRONT_MATRIX,
  HEAD_STRIKE,
  KEY_DOWN,
  KNIFE,
  TAPE,
  TEAR,
  UP,
  crankPaths,
} from './geometry';
import { CHANGED, type Frame } from './model';

export interface Pose {
  keys: string[];
  bar: string;
  head: string;
  headLit: boolean;
  arm: SolidPaths;
  grip: SolidPaths;
  cap: SolidPaths;
  knife: string;
  knifeLit: boolean;
  cut: string;
  oldFeed: string;
  newFeed: string;
  oldOpacity: string[];
  newOpacity: string[];
  newLit: boolean[];
  strip: string;
  fade: string;
  freshY: string;
  freshHeight: string;
  freshEdges: string;
  freshTop: string;
  edges: string;
  cache: string;
  count: string;
}

const shift = ([x, y]: Flat, by: number) =>
  by ? `translate(${(x * by).toFixed(2)} ${(y * by).toFixed(2)})` : '';

export function stripTransform(fall: number) {
  if (fall <= 0) return FRONT_MATRIX;
  const slide = 1 - Math.pow(1 - Math.min(1, fall / 0.6), 3);
  const drop = Math.pow(Math.max(0, (fall - 0.12) / 0.88), 2);
  const tilt = -16 * Math.sin(Math.PI * Math.min(1, fall / 0.85));
  const dx = -80 * slide;
  const dy = (TEAR - 2.2) * drop;
  return `${FRONT_MATRIX} translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${tilt.toFixed(2)} ${TAPE.x0} ${-TEAR})`;
}

export function poseOf(frame: Frame): Pose {
  const crank = crankPaths(frame.crank);
  const knifeZ = KNIFE.park - (KNIFE.park - (CUT - 3.5)) * frame.knife;
  const sweeping = frame.sweep > 0 && frame.fall < 0.15;
  const top = TEAR + frame.newFeed * TAPE.pitch;
  const lit = frame.accent;
  const onTape = frame.cut ? CHANGED + frame.reprinted : frame.printed;
  return {
    keys: frame.keys.map((depth) => shift(KEY_DOWN, depth)),
    bar: shift(KEY_DOWN, frame.bar),
    head: shift(HEAD_STRIKE, frame.strike),
    headLit: lit.kind === 'head',
    arm: crank.arm,
    grip: crank.grip,
    cap: crank.cap,
    knife: shift(UP, knifeZ),
    knifeLit: lit.kind === 'knife',
    cut: sweeping
      ? `M${TAPE.x1 + 1} ${-CUT}H${(TAPE.x1 + 1 - frame.sweep * (TAPE.x1 - TAPE.x0 + 2)).toFixed(2)}`
      : '',
    oldFeed: `translate(0 ${(-frame.oldFeed * TAPE.pitch).toFixed(2)})`,
    newFeed: `translate(0 ${(-frame.newFeed * TAPE.pitch).toFixed(2)})`,
    oldOpacity: frame.oldInk.map((ink) => (ink * frame.fade).toFixed(3)),
    newOpacity: frame.newInk.map((ink) => (ink * frame.fade).toFixed(3)),
    newLit: frame.newInk.map((_, index) => lit.kind === 'line' && lit.index === index),
    strip: stripTransform(frame.fall),
    fade: frame.fade.toFixed(3),
    freshY: (-top).toFixed(2),
    freshHeight: (top - TAPE.print + 8).toFixed(2),
    freshEdges: `M${TAPE.x0} ${(-top).toFixed(2)}V${-TAPE.print + 6}M${TAPE.x1} ${(-top).toFixed(2)}V${-TAPE.print + 6}`,
    freshTop: `M${TAPE.x0} ${(-top).toFixed(2)}H${TAPE.x1}`,
    edges: frame.cut ? frame.fade.toFixed(3) : '0',
    cache: (frame.mark * frame.fade).toFixed(3),
    count: String(Math.round(onTape)).padStart(2, '0'),
  };
}
