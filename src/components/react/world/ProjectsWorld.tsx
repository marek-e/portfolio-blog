import { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/i18n/config';
import type { WorldTranslations } from '@/i18n/translations/world';
import { createWorldBridge } from './bridge';
import { createFakeTouchSource } from './input/fakeTouchSource';
import { createInputManager } from './input/manager';
import { createKeyboardSource } from './input/keyboardSource';
import { GameCanvas } from './GameCanvas';
import { ProjectCardOverlay } from './ProjectCardOverlay';
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

type Phase = 'loading' | 'ready' | 'entered';

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
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const listUrl = lang === 'en' ? '/en/projects' : '/projects';

  useEffect(() => {
    if (isSmallViewport) return;
    const offProgress = bridge.on('boot:progress', ({ value }) => setProgress(value));
    const offReady = bridge.on('boot:ready', () => {
      setProgress(1);
      setPhase((current) => (current === 'loading' ? 'ready' : current));
    });
    return () => {
      offProgress();
      offReady();
    };
  }, [bridge, isSmallViewport]);

  // Input sources detach with the island (covers ClientRouter view-transition navigation).
  useEffect(() => {
    if (isSmallViewport) return;
    return () => inputManager.destroy();
  }, [inputManager, isSmallViewport]);

  // Input pause protocol (plan decision 6): world input dies while a card is open; on close
  // the world resumes and the canvas regains focus so keyboard play continues seamlessly.
  useEffect(() => {
    if (isSmallViewport) return;
    const offOpen = bridge.on('card:open', () => inputManager.setPaused(true));
    const offClose = bridge.on('card:close', () => {
      inputManager.setPaused(false);
      canvasContainerRef.current?.focus();
    });
    return () => {
      offOpen();
      offClose();
    };
  }, [bridge, inputManager, isSmallViewport]);

  if (isSmallViewport) {
    return (
      <section className="bg-card border-border mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">{t.teaser.title}</h2>
        <p className="text-muted-foreground">{t.teaser.body}</p>
        <a
          href={listUrl}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
        >
          {t.teaser.cta}
        </a>
      </section>
    );
  }

  const handleEnter = () => {
    // Keyboard attaches only now: on the entry screen, Enter/Tab must keep their native
    // behavior so the entry button stays keyboard-activatable. `?input=fake-touch` swaps in
    // the dev-only touch stand-in — the P0 proof of the input abstraction (plan slice 6).
    const useFakeTouch = new URLSearchParams(window.location.search).get('input') === 'fake-touch';
    inputManager.addSource(useFakeTouch ? createFakeTouchSource() : createKeyboardSource());
    bridge.emit('game:enter');
    setPhase('entered');
    canvasContainerRef.current?.focus();
  };

  // The world is immersive: a fixed layer under the site's language toggle (z-40, top-right).
  return (
    <div className="bg-background fixed inset-0 z-30">
      <GameCanvas bridge={bridge} inputManager={inputManager} containerRef={canvasContainerRef} />

      <ProjectCardOverlay bridge={bridge} projects={projects} t={t} />

      {phase === 'entered' ? (
        <WorldHud t={t} listUrl={listUrl} />
      ) : (
        <div className="bg-background absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-4">
          <h2 className="text-3xl font-bold tracking-tight">{t.heading}</h2>

          {phase === 'ready' ? (
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
