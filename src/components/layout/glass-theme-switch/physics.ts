export const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
export const ease = (value: number) =>
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

export function daylight(progress: number) {
  const value = clamp((progress - 0.18) / 0.64);
  return value * value * (3 - 2 * value);
}

export function createMotion(initial: number) {
  return {
    progress: initial,
    target: initial,
    velocity: 0,
    dragging: false,
    hover: 0,
    hoverTarget: 0,
    press: 0,
    pressTarget: 0,
    kick: 0,
    orbit: initial,
    orbitVelocity: 0,
    direction: initial ? -1 : 1,
  };
}

export type GlassMotion = ReturnType<typeof createMotion>;

export function stepMotion(state: GlassMotion, dt: number, immediate = false) {
  if (immediate) {
    state.progress = state.target;
    state.velocity = state.orbitVelocity = state.kick = 0;
    state.orbit = state.target;
    state.hover = state.hoverTarget;
    state.press = state.pressTarget;
  } else {
    for (let index = 0; index < 4; index++) {
      const h = dt / 4;
      if (!state.dragging) {
        state.velocity +=
          ((state.target - state.progress) * 129 - state.velocity * 2 * Math.sqrt(129) * 0.6) * h;
        state.progress += state.velocity * h;
      }
      state.orbitVelocity +=
        ((ease(clamp(state.progress)) - state.orbit) * 70 -
          state.orbitVelocity * 2 * Math.sqrt(70)) *
        h;
      state.orbit += state.orbitVelocity * h;
    }
    state.hover += (state.hoverTarget - state.hover) * Math.min(1, dt * 10);
    state.press += (state.pressTarget - state.press) * Math.min(1, dt * 18);
    state.kick *= Math.exp(-dt * 3.5);
  }
  if (state.orbit < 0.015) state.direction = 1;
  else if (state.orbit > 0.985) state.direction = -1;
}

export function knobGeometry(state: GlassMotion) {
  const over = Math.min(0.5, Math.max(-state.progress, state.progress - 1, 0));
  const stretch = Math.min(Math.abs(state.velocity) * 6.5, 16);
  const squeeze = 1 - state.press * 0.035;
  const halfX = (99 + stretch - over * 110) * squeeze;
  const halfY = Math.min(99 - stretch * 0.45 + over * 30, 104) * squeeze;
  const x = -104 + 208 * clamp(state.progress) + Math.sign(state.progress - 0.5) * over * 110;
  const phase = clamp(state.orbit);
  return {
    x,
    halfX,
    halfY,
    radius: Math.min(58, halfX - 1, halfY - 1),
    angle:
      state.direction > 0 ? Math.PI / 2 - Math.PI * phase : -Math.PI / 2 - Math.PI * (1 - phase),
    energy:
      (1 +
        state.hover * 0.08 +
        Math.min(Math.abs(state.velocity) * 0.05, 0.18) +
        state.kick * 0.12) *
      1.89,
    lift: state.hover * (1 - state.press),
  };
}

export function hitKnob(state: GlassMotion, x: number, y: number) {
  const knob = knobGeometry(state);
  const dx = Math.abs(x - knob.x) - knob.halfX + knob.radius;
  const dy = Math.abs(y) - knob.halfY + knob.radius;
  return (
    Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0) <= knob.radius
  );
}

export function resist(progress: number) {
  return progress < 0 ? progress * 0.22 : progress > 1 ? 1 + (progress - 1) * 0.22 : progress;
}

export const landing = (progress: number, velocity: number) =>
  progress + velocity * 0.15 > 0.5 ? 1 : 0;
