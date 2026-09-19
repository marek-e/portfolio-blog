import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWorldInput } from './input.ts';

class FakeElement extends EventTarget {
  readonly kind: string;
  constructor(kind: string) {
    super();
    this.kind = kind;
  }
  closest(selector: string) {
    return selector.split(',').includes(this.kind) ? this : null;
  }
}

function setup() {
  const windowTarget = new EventTarget();
  const documentTarget = Object.assign(new EventTarget(), { hidden: false });
  Object.defineProperties(globalThis, {
    window: { value: windowTarget, configurable: true },
    document: { value: documentTarget, configurable: true },
    Element: { value: FakeElement, configurable: true },
  });
  let muted = 0;
  const input = createWorldInput(() => {
    muted++;
  });
  const key = (
    code: string,
    target = new FakeElement('canvas'),
    type = 'keydown',
    repeat = false
  ) => {
    const event = new Event(type, { cancelable: true });
    Object.defineProperties(event, {
      code: { value: code },
      target: { value: target },
      repeat: { value: repeat },
    });
    windowTarget.dispatchEvent(event);
    return event;
  };
  return { input, key, windowTarget, documentTarget, muted: () => muted };
}

test('injected movement is normalized, action edges consumed, and pause discards intents', () => {
  const { input } = setup();
  input.setIntent({ x: 1, interact: true });
  assert.equal(input.read().x, 0);
  input.setEnabled(true);
  input.setIntent({ x: 1, y: 1, interact: true });
  const intent = input.read();
  assert.ok(Math.abs(Math.hypot(intent.x, intent.y) - 1) < 1e-10);
  assert.equal(intent.interact, true);
  assert.equal(input.read().interact, false);
  input.setEnabled(false);
  input.setEnabled(true);
  assert.deepEqual(input.read(), { x: 0, y: 0, interact: false, dismiss: false });
  input.destroy();
});

test('HUD button focus allows movement and mute without intercepting native interaction', () => {
  const { input, key, muted } = setup();
  input.setEnabled(true);
  const button = new FakeElement('button');
  assert.equal(key('Enter', button).defaultPrevented, false);
  assert.equal(input.read().interact, false);
  assert.equal(key('KeyE', button).defaultPrevented, true);
  assert.equal(input.read().interact, true);
  assert.equal(key('ArrowRight', button).defaultPrevented, true);
  assert.equal(input.read().x, 1);
  key('KeyM', button);
  assert.equal(muted(), 1);
  key('ArrowRight', button, 'keyup');
  assert.equal(input.read().x, 0);
  input.destroy();
});

test('editable elements and dialogs retain their keyboard input', () => {
  const { input, key, muted } = setup();
  input.setEnabled(true);
  for (const kind of ['input', 'textarea', 'dialog', '[role="dialog"]', '[contenteditable]']) {
    const target = new FakeElement(kind);
    assert.equal(key('ArrowUp', target).defaultPrevented, false);
    key('KeyM', target);
    key('Enter', target);
    assert.deepEqual(input.read(), { x: 0, y: 0, interact: false, dismiss: false });
  }
  assert.equal(muted(), 0);
  input.destroy();
});

test('blur, hidden tabs, and destroy release held keys and injected movement', () => {
  const { input, key, windowTarget, documentTarget } = setup();
  input.setEnabled(true);
  key('KeyW');
  assert.equal(input.read().y, -1);
  windowTarget.dispatchEvent(new Event('blur'));
  assert.equal(input.read().y, 0);
  input.setIntent({ x: 1 });
  documentTarget.hidden = true;
  documentTarget.dispatchEvent(new Event('visibilitychange'));
  assert.equal(input.read().x, 0);
  input.destroy();
  key('KeyW');
  assert.equal(input.read().y, 0);
});

test('keyboard interaction is edge-triggered and diagonal keyboard speed stays normalized', () => {
  const { input, key } = setup();
  input.setEnabled(true);
  key('KeyW');
  key('KeyD');
  key('KeyE');
  const intent = input.read();
  assert.ok(Math.abs(Math.hypot(intent.x, intent.y) - 1) < 1e-10);
  assert.equal(intent.interact, true);
  key('KeyE', new FakeElement('canvas'), 'keydown', true);
  assert.equal(input.read().interact, false);
  input.destroy();
});
