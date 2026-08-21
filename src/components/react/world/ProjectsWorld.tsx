import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '@/i18n/config';
import type { WorldTranslations } from '@/i18n/translations/world';
import { createWorldBridge } from './bridge';
import { createFakeTouchSource } from './input/fakeTouchSource';
import { createInputManager } from './input/manager';
import { createKeyboardSource } from './input/keyboardSource';
import type { WorldAudio } from './audio';
import { createWorldAudio } from './audio';
import { Confetti } from './Confetti';
import { GameCanvas } from './GameCanvas';
import { ProjectCardOverlay } from './ProjectCardOverlay';
import { PropCardOverlay } from './PropCardOverlay';
import { addDiscovered, getDiscovered, isMuted, setMuted } from './state';
import { WorldHud } from './WorldHud';

export interface WorldProjectDTO {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
  imageUrl?: string;
  detailUrl: string;
}

interface ProjectsWorldProps {
  projects: WorldProjectDTO[];
  t: WorldTranslations;
  lang: Lang;
}

type Phase = 'loading' | 'ready' | 'entered' | 'error';

/** Preload watchdog: past this, the loading screen becomes the §6.12 error card. */
const STALL_TIMEOUT_MS = 15_000;
const CELEBRATION_MS = 4500;

function detectSmallViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches;
}

export function ProjectsWorld({ projects, t, lang }: ProjectsWorldProps) {
  // Evaluated once at mount: resizing after entry never swaps to the teaser (PRD §6.10).
  const [isSmallViewport] = useState(detectSmallViewport);
  const [bridge] = useState(createWorldBridge);
  const [inputManager] = useState(createInputManager);
  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState(0);
  const [discovered, setDiscovered] = useState<string[]>(getDiscovered);
  const [hint, setHint] = useState<string | null>(null);
  const [muted, setMutedState] = useState<boolean>(isMuted);
  const [celebrating, setCelebrating] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<WorldAudio | null>(null);
  const discoveredRef = useRef(discovered);
  discoveredRef.current = discovered;
  const pendingCelebrationRef = useRef(false);

  const toggleMute = useCallback(() => {
    setMutedState((current) => {
      const next = !current;
      setMuted(next);
      audioRef.current?.setMuted(next);
      return next;
    });
  }, []);

  const listUrl = lang === 'en' ? '/en/projects' : '/projects';

  useEffect(() => {
    if (isSmallViewport) return;
    const offProgress = bridge.on('boot:progress', ({ value }) => setProgress(value));
    const offReady = bridge.on('boot:ready', () => {
      setProgress(1);
      setPhase((current) => (current === 'loading' ? 'ready' : current));
    });
    const offError = bridge.on('boot:error', () => {
      setPhase((current) => (current === 'entered' ? current : 'error'));
    });
    return () => {
      offProgress();
      offReady();
      offError();
    };
  }, [bridge, isSmallViewport]);

  // Preload watchdog (PRD §6.12) + rotating loading-screen hints.
  useEffect(() => {
    if (isSmallViewport || phase !== 'loading') return;
    const stall = window.setTimeout(() => {
      setPhase((current) => (current === 'loading' ? 'error' : current));
    }, STALL_TIMEOUT_MS);
    return () => window.clearTimeout(stall);
  }, [isSmallViewport, phase]);

  useEffect(() => {
    if (isSmallViewport || phase === 'entered' || phase === 'error') return;
    const rotate = window.setInterval(() => {
      setHintIndex((index) => (index + 1) % t.entry.hints.length);
    }, 3200);
    return () => window.clearInterval(rotate);
  }, [isSmallViewport, phase, t]);

  // Input sources detach with the island (covers ClientRouter view-transition navigation).
  useEffect(() => {
    if (isSmallViewport) return;
    return () => inputManager.destroy();
  }, [inputManager, isSmallViewport]);

  // Input pause protocol (plan decision 6): world input dies while a card is open; on close
  // the world resumes and the canvas regains focus so keyboard play continues seamlessly.
  // First open of a project card marks it discovered (PRD §6.7) and notifies the game so
  // its sparkle swaps for the checkmark marker.
  useEffect(() => {
    if (isSmallViewport) return;
    const offOpen = bridge.on('card:open', ({ slug }) => {
      inputManager.setPaused(true);
      audioRef.current?.playSfx('card-open');
      const isNew = !discoveredRef.current.includes(slug);
      if (isNew) audioRef.current?.playSfx('discovery');
      const next = addDiscovered(slug);
      // The 6/6 celebration fires once the completing card closes (PRD §6.8) —
      // re-triggerable only by clearing storage.
      if (isNew && next.length === projects.length) pendingCelebrationRef.current = true;
      setDiscovered(next);
      bridge.emit('discovery:changed', { discovered: next });
    });
    const offProp = bridge.on('prop:open', () => {
      inputManager.setPaused(true);
      audioRef.current?.playSfx('card-open');
    });
    const offClose = bridge.on('card:close', () => {
      inputManager.setPaused(false);
      audioRef.current?.playSfx('card-close');
      canvasContainerRef.current?.focus();
      if (pendingCelebrationRef.current) {
        pendingCelebrationRef.current = false;
        audioRef.current?.playSfx('confetti');
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setCelebrating(true);
          window.setTimeout(() => setCelebrating(false), CELEBRATION_MS);
        }
      }
    });
    const offHint = bridge.on('hint', ({ id, visible }) => {
      setHint(visible ? t.hints[id] : null);
    });
    const offSfx = bridge.on('sfx', ({ id }) => audioRef.current?.playSfx(id));
    return () => {
      offOpen();
      offProp();
      offClose();
      offHint();
      offSfx();
    };
  }, [bridge, inputManager, isSmallViewport, projects.length, t]);

  // Audio lifecycle: mute toggle (HUD button + M key), tab-hidden music fade (PRD §6.11),
  // context teardown with the island.
  useEffect(() => {
    if (isSmallViewport) return;
    const offToggle = inputManager.onToggleMute(toggleMute);
    const onVisibilityChange = () => audioRef.current?.setBackgrounded(document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      offToggle();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      audioRef.current?.destroy();
      audioRef.current = null;
    };
  }, [inputManager, isSmallViewport, toggleMute]);

  if (isSmallViewport) {
    return (
      <section className="bg-card border-border mx-auto flex max-w-md flex-col items-center gap-4 overflow-hidden rounded-2xl border pb-8 text-center shadow-sm">
        <img
          src="/world/island-hero-v1.webp"
          alt=""
          width={1200}
          height={675}
          className="aspect-video w-full object-cover"
        />
        <div className="flex flex-col items-center gap-4 px-8">
          <h2 className="text-2xl font-bold tracking-tight">{t.teaser.title}</h2>
          <p className="text-muted-foreground">{t.teaser.body}</p>
          <a
            href={listUrl}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
          >
            {t.teaser.cta}
          </a>
        </div>
      </section>
    );
  }

  const handleEnter = () => {
    // Keyboard attaches only now: on the entry screen, Enter/Tab must keep their native
    // behavior so the entry button stays keyboard-activatable. `?input=fake-touch` swaps in
    // the dev-only touch stand-in — the P0 proof of the input abstraction (plan slice 6).
    const useFakeTouch = new URLSearchParams(window.location.search).get('input') === 'fake-touch';
    inputManager.addSource(useFakeTouch ? createFakeTouchSource() : createKeyboardSource());
    // The entry click is the browser's audio-unlock gesture (PRD §10).
    audioRef.current ??= createWorldAudio(muted);
    bridge.emit('game:enter');
    setPhase('entered');
    canvasContainerRef.current?.focus();
  };

  // The world is immersive: a fixed layer under the site's language toggle (z-40, top-right).
  return (
    <div className="bg-background fixed inset-0 z-30">
      <GameCanvas
        bridge={bridge}
        inputManager={inputManager}
        containerRef={canvasContainerRef}
        label={t.canvasLabel}
      />

      <ProjectCardOverlay bridge={bridge} projects={projects} t={t} />
      <PropCardOverlay
        bridge={bridge}
        t={t}
        lang={lang}
        allDiscovered={projects.length > 0 && discovered.length >= projects.length}
      />

      {celebrating && <Confetti />}

      {phase === 'entered' ? (
        <WorldHud
          t={t}
          listUrl={listUrl}
          discoveredCount={discovered.length}
          totalCount={projects.length}
          hint={hint}
          muted={muted}
          onToggleMute={toggleMute}
          celebrating={celebrating}
        />
      ) : (
        <div className="bg-background absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-4">
          <div className="border-border w-full max-w-lg overflow-hidden rounded-2xl border shadow-md">
            <img
              src="/world/island-hero-v1.webp"
              alt=""
              width={1200}
              height={675}
              className="aspect-video w-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{t.heading}</h2>

          {phase === 'error' ? (
            <div className="flex max-w-md flex-col items-center gap-4 text-center">
              <p className="text-foreground font-semibold">{t.entry.errorTitle}</p>
              <p className="text-muted-foreground text-sm">{t.entry.errorBody}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                >
                  {t.entry.retry}
                </button>
                <a
                  href={listUrl}
                  className="border-border hover:bg-muted focus-visible:ring-ring/50 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                >
                  {t.teaser.cta}
                </a>
              </div>
            </div>
          ) : phase === 'ready' ? (
            <button
              type="button"
              onClick={handleEnter}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 rounded-lg px-6 py-3 text-base font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
            >
              {t.entry.enter}
            </button>
          ) : (
            <div className="flex w-full max-w-xs flex-col items-center gap-3">
              <div
                role="progressbar"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t.entry.loading}
                className="bg-muted h-2 w-full overflow-hidden rounded-full"
              >
                <div
                  className="bg-primary h-full rounded-full transition-[width] duration-200"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <p className="text-muted-foreground text-sm">{t.entry.loading}</p>
            </div>
          )}

          {phase !== 'error' && (
            <p className="text-muted-foreground/80 text-sm" aria-live="polite">
              {t.entry.hints[hintIndex]}
            </p>
          )}

          <a
            href={listUrl}
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            {t.hud.viewAsList}
          </a>
        </div>
      )}
    </div>
  );
}
