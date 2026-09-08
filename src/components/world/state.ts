export interface WorldSnapshot {
  discovered: string[];
  introDone: boolean;
  muted: boolean;
}

export function createWorldState(slugs: string[], storage?: Pick<Storage, 'getItem' | 'setItem'>) {
  const validSlugs = new Set(slugs);
  let backing = storage;
  if (!backing) {
    try {
      backing = window.localStorage;
    } catch {
      backing = undefined;
    }
  }
  function read(key: string): unknown {
    try {
      return JSON.parse(backing?.getItem(`world:${key}`) ?? 'null');
    } catch {
      return null;
    }
  }
  function write(key: string, value: unknown) {
    try {
      backing?.setItem(`world:${key}`, JSON.stringify(value));
    } catch {
      backing = undefined;
    }
  }
  const saved = read('discovered');
  const snapshot: WorldSnapshot = {
    discovered: Array.isArray(saved)
      ? [
          ...new Set(
            saved.filter((slug): slug is string => typeof slug === 'string' && validSlugs.has(slug))
          ),
        ]
      : [],
    introDone: read('intro-done') === true,
    muted: read('muted') === true,
  };
  return {
    snapshot: () => ({ ...snapshot, discovered: [...snapshot.discovered] }),
    discover(slug: string) {
      if (!validSlugs.has(slug) || snapshot.discovered.includes(slug)) return false;
      snapshot.discovered.push(slug);
      write('discovered', snapshot.discovered);
      return true;
    },
    finishIntro() {
      snapshot.introDone = true;
      write('intro-done', true);
    },
    toggleMuted() {
      snapshot.muted = !snapshot.muted;
      write('muted', snapshot.muted);
      return snapshot.muted;
    },
  };
}

export type WorldState = ReturnType<typeof createWorldState>;
