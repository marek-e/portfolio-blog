// Typed event bridge between the Phaser game and the React DOM layer (loading screen, HUD,
// project card overlay). One instance is created by `ProjectsWorld` and handed to both sides;
// game code and DOM code never import each other.

import type { SfxId } from './audio';

export interface WorldEventMap {
  /** Asset preload progress, 0..1 (game → DOM). */
  'boot:progress': { value: number };
  /** All assets preloaded; the entry button can be shown (game → DOM). */
  'boot:ready': void;
  /** Asset preload or engine creation failed (game → DOM, PRD §6.12). */
  'boot:error': void;
  /** The visitor clicked "Enter the island" (DOM → game). */
  'game:enter': void;
  /** A project interaction zone was activated (game → DOM). */
  'card:open': { slug: string };
  /** A prop interaction zone was activated — house props, library, bench (game → DOM). */
  'prop:open': { id: string };
  /** Whatever overlay was open has closed (DOM → game). */
  'card:close': void;
  /** Discovery list changed; scenes update their sparkle/checkmark markers (DOM → game). */
  'discovery:changed': { discovered: string[] };
  /** Show/hide a translated tutorial hint chip (game → DOM). */
  hint: { id: 'move'; visible: boolean };
  /** Game-side sound triggers, synthesized on the DOM side (game → DOM). */
  sfx: { id: SfxId };
}

type EventKey = keyof WorldEventMap;
type Listener<K extends EventKey> = (payload: WorldEventMap[K]) => void;
type EmitArgs<K extends EventKey> = WorldEventMap[K] extends void ? [] : [WorldEventMap[K]];

/** Registry key under which `createGame` exposes the bridge to scenes. */
export const BRIDGE_REGISTRY_KEY = 'world-bridge';

export function createWorldBridge() {
  const listeners = new Map<EventKey, Set<Listener<EventKey>>>();

  return {
    /** Subscribe to an event. Returns the unsubscribe function. */
    on<K extends EventKey>(event: K, listener: Listener<K>): () => void {
      let set = listeners.get(event);
      if (!set) {
        set = new Set();
        listeners.set(event, set);
      }
      set.add(listener as Listener<EventKey>);
      return () => {
        set.delete(listener as Listener<EventKey>);
      };
    },

    emit<K extends EventKey>(event: K, ...[payload]: EmitArgs<K>): void {
      listeners.get(event)?.forEach((listener) => listener(payload as WorldEventMap[EventKey]));
    },
  };
}

export type WorldBridge = ReturnType<typeof createWorldBridge>;
