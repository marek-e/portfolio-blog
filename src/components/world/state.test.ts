import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWorldState } from './state.ts';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

test('discovery is unique, validated and shared across language visits', () => {
  const storage = memoryStorage();
  storage.setItem('world:discovered', JSON.stringify(['elemix', 'removed', 'elemix', 42]));
  const first = createWorldState(['elemix', 'petanque'], storage);
  assert.deepEqual(first.snapshot().discovered, ['elemix']);
  assert.equal(first.discover('removed'), false);
  assert.equal(first.discover('elemix'), false);
  assert.equal(first.discover('petanque'), true);
  assert.deepEqual(createWorldState(['elemix', 'petanque'], storage).snapshot().discovered, [
    'elemix',
    'petanque',
  ]);
});

test('intro is saved only on exit and mute survives another visit', () => {
  const storage = memoryStorage();
  const first = createWorldState(['elemix'], storage);
  first.discover('elemix');
  assert.equal(createWorldState(['elemix'], storage).snapshot().introDone, false);
  first.finishIntro();
  first.toggleMuted();
  assert.deepEqual(createWorldState(['elemix'], storage).snapshot(), {
    discovered: ['elemix'],
    introDone: true,
    muted: true,
  });
});

test('blocked storage retains all state for the session', () => {
  const storage = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
  };
  const state = createWorldState(['elemix'], storage);
  assert.equal(state.discover('elemix'), true);
  state.finishIntro();
  assert.equal(state.toggleMuted(), true);
  assert.deepEqual(state.snapshot(), { discovered: ['elemix'], introDone: true, muted: true });
  const copy = state.snapshot();
  copy.discovered.length = 0;
  assert.deepEqual(state.snapshot().discovered, ['elemix']);
});

test('corrupt JSON and nonboolean flags fall back safely', () => {
  const storage = memoryStorage();
  storage.setItem('world:discovered', '{broken');
  storage.setItem('world:muted', '"false"');
  storage.setItem('world:intro-done', '123');
  assert.deepEqual(createWorldState(['elemix'], storage).snapshot(), {
    discovered: [],
    introDone: false,
    muted: false,
  });
});
