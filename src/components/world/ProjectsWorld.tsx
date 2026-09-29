import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Link } from '@/components/ui/button';
import type { ProjectsWorldProps } from '@/i18n/translations/world';
import type { WorldAudio } from './audio';
import type { createWorld } from './game';
import { createWorldState } from './state';
import { ProjectCardOverlay, type WorldInteraction } from './ProjectCardOverlay';
import './world.css';

type Controller = Awaited<ReturnType<typeof createWorld>>;
type Stage = 'loading' | 'ready' | 'playing' | 'error' | 'teaser';

export default function ProjectsWorld({ projects, t, lang, developer }: ProjectsWorldProps) {
  const [desktop] = useState(() => !matchMedia('(max-width: 1023px), (pointer: coarse)').matches);
  const [reducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [state] = useState(() => createWorldState(projects.map((project) => project.slug)));
  const [snapshot, setSnapshot] = useState(state.snapshot);
  const [stage, setStage] = useState<Stage>(desktop ? 'loading' : 'teaser');
  const [progress, setProgress] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [hint, setHint] = useState(0);
  const [moved, setMoved] = useState(snapshot.introDone);
  const [interaction, setInteraction] = useState<WorldInteraction | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const game = useRef<Controller | null>(null);
  const audio = useRef<WorldAudio | null>(null);
  const listUrl = lang === 'en' ? '/en/projects' : '/projects';
  const complete = snapshot.discovered.length === projects.length && projects.length > 0;

  const toggleMute = useCallback(() => {
    audio.current?.setMuted(state.toggleMuted());
    setSnapshot(state.snapshot());
  }, [state]);

  useEffect(() => {
    if (!desktop || !host.current) return;
    let disposed = false;
    let localGame: Controller | undefined;
    let localAudio: WorldAudio | undefined;
    const fail = () => {
      if (disposed) return;
      disposed = true;
      clearTimeout(timeout);
      localGame?.destroy();
      localAudio?.destroy();
      game.current = null;
      audio.current = null;
      setStage('error');
    };
    const timeout = setTimeout(fail, 15000);
    const parent = host.current;
    void Promise.all([import('./game'), import('./audio')])
      .then(async ([engine, sound]) => {
        if (disposed) return;
        localAudio = sound.createWorldAudio(state.snapshot().muted);
        audio.current = localAudio;
        const soundsReady = localAudio.prepare();
        localGame = await engine.createWorld(parent, {
          reducedMotion,
          introDone: state.snapshot().introDone,
          discovered: state.snapshot().discovered,
          canvasLabel: t.canvasLabel,
          interactionLabel: `E · ${t.interact}`,
          onProgress: (value) => {
            if (!disposed) setProgress(value);
          },
          onReady: () => {
            void soundsReady.then(() => {
              if (disposed) return;
              clearTimeout(timeout);
              setProgress(1);
              setStage('ready');
            });
          },
          onError: fail,
          onUnsupported: () => {
            fail();
            setStage('teaser');
          },
          onMove: () => {
            if (!disposed) setMoved(true);
          },
          onMute: toggleMute,
          onSound: (name) => localAudio?.play(name),
          onExitHouse: () => state.finishIntro(),
          onInteract: (value) => {
            if (disposed) return;
            localGame?.setPaused(true);
            setInteraction(value);
            localAudio?.play('open');
            if (value.type === 'project' && state.discover(value.id)) {
              const next = state.snapshot();
              setSnapshot(next);
              localGame?.setDiscovered(next.discovered);
              localAudio?.play('discovery');
              if (next.discovered.length === projects.length) {
                setCelebrating(true);
                localAudio?.play('celebrate');
              }
            }
          },
        });
        if (disposed) localGame.destroy();
        else game.current = localGame;
      })
      .catch(fail);
    return () => {
      disposed = true;
      clearTimeout(timeout);
      localGame?.destroy();
      localAudio?.destroy();
      game.current = null;
      audio.current = null;
    };
  }, [attempt, desktop, projects, reducedMotion, state, t, toggleMute]);

  useEffect(() => {
    if (stage !== 'loading') return;
    const interval = setInterval(() => setHint((value) => (value + 1) % t.hints.length), 3500);
    return () => clearInterval(interval);
  }, [stage, t.hints.length]);

  useEffect(() => {
    if (!celebrating) return;
    const timeout = setTimeout(() => setCelebrating(false), 6000);
    return () => clearTimeout(timeout);
  }, [celebrating]);

  function closeCard() {
    setInteraction(null);
    audio.current?.play('close');
    game.current?.setPaused(false);
    requestAnimationFrame(() => host.current?.querySelector('canvas')?.focus());
  }

  function enter() {
    audio.current?.enter();
    game.current?.enter();
    setStage('playing');
    host.current?.querySelector('canvas')?.focus();
  }

  return (
    <div className="projects-world">
      <div ref={host} className="world-canvas" aria-hidden={stage !== 'playing'} />
      {stage !== 'playing' ? (
        <section className="world-entry" aria-labelledby="world-title">
          <img
            className="world-entry-art"
            src="/world/teaser-v1.webp"
            alt=""
            width={1600}
            height={1000}
          />
          <div className="world-entry-shade" />
          <Link href={listUrl} variant="outline" className="world-back">
            ← {t.backToProjects}
          </Link>
          <div className="world-entry-panel">
            <p className="world-eyebrow">Marek Elmayan · Portfolio</p>
            <h1 id="world-title">{t.title}</h1>
            <p className="world-subtitle">{stage === 'teaser' ? t.teaserTitle : t.subtitle}</p>
            {stage === 'teaser' ? (
              <div className="world-entry-actions">
                <p>{t.teaserDescription}</p>
                <Link href={listUrl} size="lg">
                  {t.backToProjects} →
                </Link>
              </div>
            ) : stage === 'error' ? (
              <div className="world-entry-actions" role="alert">
                <p>{t.loadError}</p>
                <Button
                  size="lg"
                  onClick={() => {
                    setProgress(0);
                    setStage('loading');
                    setAttempt((value) => value + 1);
                  }}
                >
                  {t.retry}
                </Button>
                <Link href={listUrl} variant="outline">
                  {t.backToProjects}
                </Link>
              </div>
            ) : (
              <div className="world-entry-actions">
                {stage === 'ready' ? (
                  <Button size="lg" className="world-enter" onClick={enter}>
                    {t.enter} <span aria-hidden="true">→</span>
                  </Button>
                ) : (
                  <div className="world-loading" role="status">
                    <span>
                      {t.loading}{' '}
                      <span className="tabular-nums">{Math.round(progress * 100)}%</span>
                    </span>
                    <progress max={1} value={progress} aria-label={t.loading} />
                  </div>
                )}
                <p className="world-hint">{t.hints[hint]}</p>
              </div>
            )}
            <span className="world-entry-caption">
              {t.projectList} · {projects.length}
            </span>
          </div>
        </section>
      ) : (
        <>
          <nav className="world-hud" aria-label={t.controls}>
            <Link href={listUrl} variant="outline" className="world-hud-pill">
              ← {t.backToProjects}
            </Link>
            <div
              className={`world-hud-pill world-discovery ${celebrating ? 'world-celebrating' : ''}`}
              role="status"
              aria-live="polite"
            >
              <span aria-hidden="true">{complete ? '✓' : '◇'}</span> {t.discovered}{' '}
              <span className="tabular-nums">
                {snapshot.discovered.length}/{projects.length}
              </span>
            </div>
            <Button
              variant="outline"
              className="world-hud-pill"
              aria-pressed={!snapshot.muted}
              onClick={toggleMute}
            >
              {snapshot.muted ? t.soundOn : t.soundOff} <kbd>M</kbd>
            </Button>
          </nav>
          <div className="world-controls">
            <span>
              <kbd>WASD</kbd> <kbd>↑←↓→</kbd> {t.move}
            </span>
            <span>
              <kbd>E</kbd> {t.interact}
            </span>
          </div>
          {!moved && <p className="world-movement-hint">{t.keyboardHint}</p>}
          {celebrating && (
            <div className="world-celebration" role="status">
              {t.celebration}
            </div>
          )}
          {celebrating && !reducedMotion && (
            <div className="world-confetti" aria-hidden="true">
              {Array.from({ length: 36 }, (_, index) => (
                <i
                  key={index}
                  style={{
                    left: `${(index * 37) % 100}%`,
                    background: ['#f6c967', '#6ccac3', '#f39883', '#e9e4c4'][index % 4],
                    animationDelay: `${(index % 9) * 0.09}s`,
                    rotate: `${index * 41}deg`,
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
      {interaction && (
        <ProjectCardOverlay
          interaction={interaction}
          projects={projects}
          t={t}
          developer={developer}
          complete={complete}
          onClose={closeCard}
          onMute={toggleMute}
        />
      )}
    </div>
  );
}
