// localStorage schema + helpers (PRD §9.6). Slugs are the canonical language-agnostic form,
// so discovery survives switching languages. Every access degrades to in-memory state when
// storage is unavailable (Safari private mode, lockdown — PRD §6.12): everything keeps
// working for the session, persistence is lost silently.

const DISCOVERED_KEY = 'world:discovered';
const INTRO_DONE_KEY = 'world:intro-done';
const MUTED_KEY = 'world:muted';

const memory = new Map<string, string>();

function read(key: string): string | null {
  try {
    const value = window.localStorage.getItem(key);
    if (value !== null) return value;
  } catch {
    // storage unavailable — fall through to memory
  }
  return memory.get(key) ?? null;
}

function write(key: string, value: string): void {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable — memory already holds the session value
  }
}

export function getDiscovered(): string[] {
  const raw = read(DISCOVERED_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

/** Idempotent; returns the updated list. */
export function addDiscovered(slug: string): string[] {
  const current = getDiscovered();
  if (current.includes(slug)) return current;
  const next = [...current, slug];
  write(DISCOVERED_KEY, JSON.stringify(next));
  return next;
}

export function isIntroDone(): boolean {
  return read(INTRO_DONE_KEY) === 'true';
}

export function setIntroDone(): void {
  write(INTRO_DONE_KEY, 'true');
}

export function isMuted(): boolean {
  return read(MUTED_KEY) === 'true';
}

export function setMuted(muted: boolean): void {
  write(MUTED_KEY, String(muted));
}
