import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createMotion,
  daylight,
  hitKnob,
  knobGeometry,
  landing,
  resist,
  stepMotion,
} from '../src/components/layout/glass-theme-switch/physics.ts';

const advance = (state, seconds, fps = 60) => {
  for (let frame = 0; frame < seconds * fps; frame++) stepMotion(state, 1 / fps);
};

test('a quick release projects its destination in either direction', () => {
  assert.equal(landing(0.4, 1), 1);
  assert.equal(landing(0.6, -1), 0);
  assert.equal(landing(0.4, 0), 0);
  assert.equal(landing(0.6, 0), 1);
});

test('the track remains clickable outside the rounded knob', () => {
  const state = createMotion(0);
  assert.equal(hitKnob(state, -104, 0), true);
  assert.equal(hitKnob(state, 104, 0), false);
  assert.equal(hitKnob(state, -203, -99), false);
});

test('overdrag resists the pointer and compresses the lens at either end', () => {
  const state = createMotion(0);
  const rest = knobGeometry(state);
  assert.equal(resist(-1), -0.22);
  assert.equal(resist(2), 1.22);
  for (const progress of [-0.22, 1.22, -100, 100]) {
    state.progress = progress;
    const knob = knobGeometry(state);
    assert.ok(knob.halfX < rest.halfX);
    assert.ok(knob.halfY > rest.halfY);
    assert.ok(knob.radius > 0 && knob.radius < knob.halfX);
    assert.ok(Math.abs(knob.x) + knob.halfX <= 216);
  }
});

test('velocity stretches the knob, press compresses it, and hover lifts it', () => {
  const state = createMotion(0);
  const rest = knobGeometry(state);
  state.velocity = 2;
  const moving = knobGeometry(state);
  assert.ok(moving.halfX > rest.halfX && moving.halfY < rest.halfY);
  state.hoverTarget = state.pressTarget = 1;
  advance(state, 1);
  assert.ok(state.press > 0.99);
  assert.ok(knobGeometry(state).lift < 0.01);
  state.pressTarget = 0;
  advance(state, 1);
  assert.ok(knobGeometry(state).lift > 0.99);
});

test('the spring overshoots gently, converges, and stays stable at 30–144Hz', () => {
  for (const fps of [30, 60, 144]) {
    const state = createMotion(0);
    state.target = 1;
    let maximum = 0;
    for (let frame = 0; frame < fps * 3; frame++) {
      stepMotion(state, 1 / fps);
      maximum = Math.max(maximum, state.progress);
    }
    assert.ok(maximum > 1.04 && maximum < 1.11);
    assert.ok(Math.abs(state.progress - 1) < 0.0001);
    assert.ok(Math.abs(state.velocity) < 0.0001);
  }
});

test('the light lags translation and returns around the other side', () => {
  const state = createMotion(0);
  state.target = 1;
  advance(state, 0.2);
  assert.ok(state.progress > state.orbit);
  const outward = knobGeometry(state).angle;
  assert.ok(outward > -Math.PI / 2 && outward < Math.PI / 2);
  advance(state, 2);
  assert.equal(state.direction, -1);
  state.target = 0;
  advance(state, 0.2);
  const returning = knobGeometry(state).angle;
  assert.ok(returning < -Math.PI / 2 && returning > -Math.PI * 1.5);
});

test('the light keeps settling while a drag holds the knob halfway', () => {
  const state = createMotion(0);
  state.dragging = true;
  state.progress = 0.5;
  advance(state, 0.1);
  const first = state.orbit;
  advance(state, 2);
  assert.equal(state.progress, 0.5);
  assert.ok(state.orbit > first);
  assert.ok(Math.abs(state.orbit - 0.5) < 0.0001);
});

test('immediate transitions settle physics and lighting without intermediate frames', () => {
  const state = createMotion(0);
  state.target = 1;
  state.velocity = 3;
  stepMotion(state, 0, true);
  assert.equal(state.progress, 1);
  assert.equal(state.orbit, 1);
  assert.equal(state.velocity, 0);
  assert.equal(daylight(-1), 0);
  assert.equal(daylight(0.5), 0.5);
  assert.equal(daylight(2), 1);
});
