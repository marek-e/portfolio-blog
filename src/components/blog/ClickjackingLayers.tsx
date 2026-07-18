'use client';

import { useEffect, useRef, useState } from 'react';

// ── Geometry ────────────────────────────────────────────────────────────────
// Two real layers make the attack: the attacker's visible lure page (back) and
// the invisible iframe of the real target (front). Both carry a button at the
// SAME card coordinates, so head-on they overlap pixel-perfectly. Rotating the
// camera fans them apart in z-space to reveal the trick.
const CARD_W = 340;
const CARD_H = 220;
const MAX_SEPARATION = 168; // px of z-depth between layers at full rotation
const MAX_ANGLE = 60; // degrees of camera swing at the slider's right end
const XRAY_ANGLE = 42; // preset angle for the "X-ray view" button

// Shared button box: the lure's "Accept" and the target's "Star" both render
// at these exact card coordinates, so they stack pixel-perfectly in z.
const BTN_W = 112;
const BTN_H = 28;
const BTN_RIGHT = 12;
const BTN_BOTTOM = 6;

// UI strings per language. The mock GitHub page stays in English on purpose:
// it depicts github.com, whose real UI is English.
const STRINGS = {
  en: {
    header: 'X-Ray the Attack',
    victimView: "Victim's view",
    xrayView: 'X-ray view',
    flat: 'Flat',
    sliderAria: "Rotation angle, from the victim's flat view to a profile X-ray view",
    degrees: 'degrees',
    iframeTag: 'Invisible iframe',
    iframeSub: 'the real target · opacity 0.001 · gets the click',
    lureTag: "Attacker's lure page",
    lureSub: 'what the victim actually sees',
    fire: 'Fire the click',
    fired: 'Click stolen ⭐',
    captionFlat1: 'This is exactly what the victim sees: a single page with an ',
    captionFlatAccept: '“Accept all cookies”',
    captionFlat2: ' button. ',
    captionFlatDrag: 'Drag the slider',
    captionFlat3: ' to rotate the scene and reveal what is really stacked on top.',
    captionXray1: 'The ',
    captionXrayIframe: 'invisible iframe',
    captionXray2: ' floats above the lure, its hidden ',
    captionXrayStar: 'Star',
    captionXray3:
      ' button pinned exactly over “Accept all cookies.” The click never reaches the button the victim aimed for.',
    lureCategory: 'Web Security',
    lureHeadline: 'Top 10 open-source security tools',
    lureNav1: 'Articles',
    lureNav2: 'Jobs',
    cookieNotice: 'This site uses cookies',
    acceptBtn: 'Accept all cookies',
  },
  fr: {
    header: "L'attaque aux rayons X",
    victimView: 'Vue de la victime',
    xrayView: 'Vue rayons X',
    flat: 'À plat',
    sliderAria:
      'Angle de rotation, de la vue à plat de la victime à une vue de profil aux rayons X',
    degrees: 'degrés',
    iframeTag: 'Iframe invisible',
    iframeSub: 'la vraie cible · opacity 0.001 · reçoit le clic',
    lureTag: "Page leurre de l'attaquant",
    lureSub: 'ce que la victime voit vraiment',
    fire: 'Déclencher le clic',
    fired: 'Clic volé ⭐',
    captionFlat1: "C'est exactement ce que voit la victime : une seule page avec un bouton ",
    captionFlatAccept: '« Accepter tous les cookies »',
    captionFlat2: '. ',
    captionFlatDrag: 'Faites glisser le curseur',
    captionFlat3: ' pour faire pivoter la scène et révéler ce qui est réellement empilé au-dessus.',
    captionXray1: "L'",
    captionXrayIframe: 'iframe invisible',
    captionXray2: ' flotte au-dessus du leurre, son bouton ',
    captionXrayStar: 'Star',
    captionXray3:
      " caché est épinglé exactement sur « Accepter tous les cookies ». Le clic n'atteint jamais le bouton que la victime visait.",
    lureCategory: 'Sécurité Web',
    lureHeadline: 'Top 10 des outils de sécurité open-source',
    lureNav1: 'Articles',
    lureNav2: 'Emplois',
    cookieNotice: 'Ce site utilise des cookies',
    acceptBtn: 'Accepter tous les cookies',
  },
} as const;

type Lang = keyof typeof STRINGS;

export function ClickjackingLayers({ lang = 'en' }: { lang?: Lang }) {
  const t9n = STRINGS[lang];
  const [angle, setAngle] = useState(0); // 0° = victim's view, MAX_ANGLE = full profile
  const [animate, setAnimate] = useState(false); // smooth tween only for presets
  const [firing, setFiring] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [narrow, setNarrow] = useState(false); // shrink the scene so rotated layers fit
  const fireTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrowMq = window.matchMedia('(max-width: 480px)');
    setReduced(motionMq.matches);
    setNarrow(narrowMq.matches);
    const onMotion = () => setReduced(motionMq.matches);
    const onNarrow = () => setNarrow(narrowMq.matches);
    motionMq.addEventListener('change', onMotion);
    narrowMq.addEventListener('change', onNarrow);
    return () => {
      motionMq.removeEventListener('change', onMotion);
      narrowMq.removeEventListener('change', onNarrow);
    };
  }, []);

  useEffect(
    () => () => {
      if (fireTimeout.current) clearTimeout(fireTimeout.current);
    },
    []
  );

  function toView(target: number) {
    setAnimate(!reduced);
    setAngle(target);
  }

  function onSlide(deg: number) {
    setAnimate(false);
    setAngle(deg);
  }

  function fireClick() {
    if (fireTimeout.current) clearTimeout(fireTimeout.current);
    setFiring(true);
    fireTimeout.current = setTimeout(() => setFiring(false), reduced ? 300 : 1600);
  }

  // Camera + layer transforms derived from the rotation angle.
  // Front-load the depth so even a small drag pops the layers apart cleanly.
  const t = Math.min(1, angle / XRAY_ANGLE); // progress used for reveals
  const ease = angle <= 0 ? 0 : Math.pow(angle / MAX_ANGLE, 0.7);
  const rotY = -angle; // swing to the side
  const rotX = -Math.min(18, angle * 0.45); // tilt down to see depth
  const sep = ease * MAX_SEPARATION;
  const iframeVisibility = 0.03 + t * 0.97; // truly invisible head-on, revealed in X-ray
  const labelOpacity = Math.max(0, Math.min(1, (t - 0.18) / 0.35));

  const sceneTransition =
    reduced || !animate ? 'none' : 'transform 0.6s cubic-bezier(0.22,0.61,0.36,1)';

  return (
    <div className="not-prose bg-card border-border my-8 overflow-hidden rounded-2xl border p-4 shadow-sm dark:shadow-[0_0_60px_-15px_rgba(217,70,239,0.25)]">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="bg-linear-to-r from-cyan-600 to-fuchsia-600 bg-clip-text text-xs font-black tracking-widest text-transparent uppercase dark:from-cyan-300 dark:to-fuchsia-400">
          {t9n.header}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => toView(0)}
            className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-bold transition ${
              angle < 5
                ? 'bg-cyan-500 text-white dark:bg-cyan-400 dark:text-cyan-950'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {t9n.victimView}
          </button>
          <button
            onClick={() => toView(XRAY_ANGLE)}
            className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-bold transition ${
              angle > XRAY_ANGLE - 5
                ? 'bg-fuchsia-500 text-white dark:bg-fuchsia-400 dark:text-fuchsia-950'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {t9n.xrayView}
          </button>
        </div>
      </div>

      {/* Rotation slider */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-muted-foreground w-10 shrink-0 text-[10px] font-medium tracking-wide uppercase">
          {t9n.flat}
        </span>
        <AngleSlider
          value={angle}
          max={MAX_ANGLE}
          onChange={onSlide}
          ariaLabel={t9n.sliderAria}
          degreesLabel={t9n.degrees}
        />
        <span className="w-10 shrink-0 text-right text-[11px] font-bold text-fuchsia-600 tabular-nums dark:text-fuchsia-300">
          {Math.round(angle)}°
        </span>
      </div>

      {/* 3D stage */}
      <div
        className="border-border bg-secondary/50 relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-xl border"
        style={{
          height: 420,
          perspective: 1100,
          backgroundImage:
            'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      >
        <div
          className="relative"
          style={{
            width: CARD_W,
            height: CARD_H,
            transformStyle: 'preserve-3d',
            transform: `scale(${narrow ? 0.72 : 1}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: sceneTransition,
          }}
        >
          {/* ── Back layer: attacker's visible lure page ────────────────────── */}
          <Layer
            z={-sep / 2}
            transition={sceneTransition}
            accent="cyan"
            glow="0 0 34px -6px rgba(34,211,238,0.45)"
          >
            <LurePage t9n={t9n} />
          </Layer>

          {/* Alignment spine: shows the Star and Accept buttons share one (x,y) at
              different depths — the crux of the trick. Anchored at their common box. */}
          <div
            className="pointer-events-none absolute"
            style={{
              right: BTN_RIGHT,
              bottom: BTN_BOTTOM,
              width: BTN_W,
              height: BTN_H,
              transformStyle: 'preserve-3d',
              transition: sceneTransition,
            }}
          >
            {/* ring around the back "Accept" button */}
            <div
              className="absolute -inset-1 rounded-md border-2 border-dashed border-amber-500/70 dark:border-amber-300/70"
              style={{
                transform: `translateZ(${-sep / 2}px)`,
                transition: sceneTransition,
                opacity: labelOpacity,
              }}
            />
            {/* ring around the front "Star" button */}
            <div
              className="absolute -inset-1 rounded-md border-2 border-amber-500 dark:border-amber-300"
              style={{
                transform: `translateZ(${sep / 2}px)`,
                boxShadow: '0 0 14px rgba(252,211,77,0.6)',
                transition: sceneTransition,
                opacity: labelOpacity,
              }}
            />
            {/* spine running through z, linking the two rings */}
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: 2,
                height: Math.max(1, sep),
                transform: 'translate(-50%,-50%) rotateX(90deg)',
                background:
                  'repeating-linear-gradient(to bottom,rgba(245,158,11,0.95) 0 5px,transparent 5px 10px)',
                opacity: labelOpacity,
                transition: sceneTransition,
              }}
            />
          </div>

          {/* ── Front layer: the invisible iframe (real target) ─────────────── */}
          <Layer
            z={sep / 2}
            transition={sceneTransition}
            accent="fuchsia"
            glow="0 0 34px -6px rgba(217,70,239,0.5)"
            contentOpacity={iframeVisibility}
            hatch={t > 0.15}
          >
            <TargetPage />
          </Layer>

          {/* Click ray: cursor above the front layer, click drives down to the Star.
              Anchored to the same shared button box as the spine. */}
          <div
            className="pointer-events-none absolute"
            style={{
              right: BTN_RIGHT,
              bottom: BTN_BOTTOM,
              width: BTN_W,
              height: BTN_H,
              transform: `translateZ(${sep / 2}px)`,
              transformStyle: 'preserve-3d',
              transition: sceneTransition,
            }}
          >
            {/* vertical ray coming toward the viewer */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-linear-to-t from-amber-400 to-transparent"
              style={{
                bottom: BTN_H / 2,
                width: firing ? 3 : 2,
                height: 70,
                transformOrigin: 'bottom center',
                transform: 'rotateX(90deg)',
                opacity: firing ? 1 : 0.35 + labelOpacity * 0.4,
                boxShadow: firing ? '0 0 16px rgba(252,211,77,0.9)' : 'none',
                transition: 'opacity 0.2s, width 0.2s',
              }}
            />
            {/* cursor */}
            <div
              className="absolute left-1/2 -translate-x-1/2 text-lg"
              style={{
                bottom: BTN_H / 2 - 9,
                transform: `translateZ(70px) ${firing ? 'translateZ(-70px) scale(0.85)' : ''}`,
                transition: reduced ? 'none' : 'transform 0.4s cubic-bezier(0.5,0,0.4,1)',
                filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
              }}
            >
              👆
            </div>
          </div>
        </div>

        {/* Floating layer labels (screen-space, fade in with rotation).
            On narrow screens both labels sit at the top so the bottom strip
            stays clear for the fire-click button. */}
        <div
          className={`pointer-events-none absolute top-4 left-4 ${narrow ? 'max-w-[145px]' : 'max-w-[180px]'}`}
          style={{ opacity: labelOpacity, transition: 'opacity 0.4s' }}
        >
          <LayerTag color="fuchsia" title={t9n.iframeTag} sub={t9n.iframeSub} />
        </div>
        <div
          className={`pointer-events-none absolute text-right ${
            narrow ? 'top-4 right-4 max-w-[140px]' : 'right-4 bottom-4 max-w-[180px]'
          }`}
          style={{ opacity: labelOpacity, transition: 'opacity 0.4s' }}
        >
          <LayerTag color="cyan" title={t9n.lureTag} sub={t9n.lureSub} alignRight />
        </div>

        {/* Fire-click control */}
        <button
          onClick={fireClick}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-[11px] font-black tracking-wide text-orange-950 uppercase shadow-[0_0_20px_-2px_rgba(251,146,60,0.6)] transition hover:brightness-110 active:scale-95"
        >
          {firing ? t9n.fired : t9n.fire}
        </button>
      </div>

      {/* Caption */}
      <p className="text-muted-foreground mt-4 text-center text-xs leading-relaxed">
        {t < 0.15 ? (
          <>
            {t9n.captionFlat1}
            <span className="font-semibold text-cyan-600 dark:text-cyan-300">
              {t9n.captionFlatAccept}
            </span>
            {t9n.captionFlat2}
            <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-300">
              {t9n.captionFlatDrag}
            </span>
            {t9n.captionFlat3}
          </>
        ) : (
          <>
            {t9n.captionXray1}
            <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-300">
              {t9n.captionXrayIframe}
            </span>
            {t9n.captionXray2}
            <span className="font-semibold text-amber-600 dark:text-amber-300">
              {t9n.captionXrayStar}
            </span>
            {t9n.captionXray3}
          </>
        )}
      </p>
    </div>
  );
}

// ── Custom angle slider ───────────────────────────────────────────────────────
// Pointer-driven track (no native <input type="range">) so the thumb, fill and
// hit area can be styled freely. Value is the camera rotation in degrees.
function AngleSlider({
  value,
  max,
  onChange,
  ariaLabel,
  degreesLabel,
}: {
  value: number;
  max: number;
  onChange: (deg: number) => void;
  ariaLabel: string;
  degreesLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = (value / max) * 100;

  function setFromClientX(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    onChange(Math.round(ratio * max));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const step: Record<string, number> = {
      ArrowRight: 3,
      ArrowUp: 3,
      ArrowLeft: -3,
      ArrowDown: -3,
      PageUp: 10,
      PageDown: -10,
    };
    let next: number | null = null;
    if (e.key in step) next = Math.min(max, Math.max(0, value + step[e.key]));
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = max;
    if (next !== null) {
      e.preventDefault();
      onChange(next);
    }
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      aria-valuetext={`${Math.round(value)} ${degreesLabel}`}
      className="focus-visible:ring-ring relative h-6 flex-1 cursor-ew-resize touch-none rounded-full select-none focus-visible:ring-2 focus-visible:outline-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromClientX(e.clientX);
      }}
      onKeyDown={onKeyDown}
    >
      {/* track */}
      <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-linear-to-r from-cyan-500/25 to-fuchsia-500/25" />
      {/* fill */}
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-linear-to-r from-cyan-500 to-fuchsia-500"
        style={{ width: `${pct}%` }}
      />
      {/* degree ticks */}
      {[25, 50, 75].map((p) => (
        <span
          key={p}
          className="bg-foreground/20 absolute top-1/2 h-2.5 w-px -translate-y-1/2"
          style={{ left: `${p}%` }}
        />
      ))}
      {/* thumb */}
      <div
        className="border-background absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.7)] dark:bg-fuchsia-300"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

// ── Layer wrapper ─────────────────────────────────────────────────────────────
function Layer({
  z,
  transition,
  accent,
  glow,
  children,
  contentOpacity = 1,
  hatch = false,
}: {
  z: number;
  transition: string;
  accent: 'cyan' | 'fuchsia';
  glow: string;
  children: React.ReactNode;
  contentOpacity?: number;
  hatch?: boolean;
}) {
  const border = accent === 'cyan' ? 'rgba(34,211,238,0.7)' : 'rgba(232,121,249,0.7)';
  return (
    <div
      className="absolute inset-0 rounded-lg"
      style={{
        transform: `translateZ(${z}px)`,
        transition,
        border: `1.5px solid ${border}`,
        boxShadow: glow,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="h-full w-full overflow-hidden rounded-lg bg-white"
        style={{ opacity: contentOpacity, transition }}
      >
        {children}
      </div>
      {hatch && (
        <div
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            opacity: 1 - contentOpacity + 0.12,
            backgroundImage:
              'repeating-linear-gradient(45deg,rgba(232,121,249,0.25) 0 6px,transparent 6px 12px)',
            transition,
          }}
        />
      )}
    </div>
  );
}

function LayerTag({
  color,
  title,
  sub,
  alignRight = false,
}: {
  color: 'cyan' | 'fuchsia';
  title: string;
  sub: string;
  alignRight?: boolean;
}) {
  const dot =
    color === 'cyan' ? 'bg-cyan-500 dark:bg-cyan-400' : 'bg-fuchsia-500 dark:bg-fuchsia-400';
  const text =
    color === 'cyan'
      ? 'text-cyan-700 dark:text-cyan-200'
      : 'text-fuchsia-700 dark:text-fuchsia-200';
  return (
    <div className={alignRight ? 'flex flex-col items-end' : ''}>
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${dot} shadow-[0_0_8px_currentColor]`} />
        <span className={`text-[11px] font-bold ${text}`}>{title}</span>
      </div>
      <span className="text-muted-foreground mt-0.5 text-[10px] leading-tight">{sub}</span>
    </div>
  );
}

// ── Layer content (compact mock pages) ────────────────────────────────────────
// The mock pages stay light-on-white in both themes: they depict real websites,
// not UI of this site.
function LurePage({ t9n }: { t9n: (typeof STRINGS)[Lang] }) {
  return (
    <div className="relative h-full w-full text-neutral-900">
      <div className="flex h-8 items-center justify-between border-b border-neutral-100 px-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
          <span className="text-[11px] font-black">devnews.io</span>
        </div>
        <div className="flex gap-1.5 text-[8px] text-neutral-400">
          <span>{t9n.lureNav1}</span>
          <span>{t9n.lureNav2}</span>
        </div>
      </div>
      <div className="px-3 pt-2.5">
        <div className="text-[7px] font-bold tracking-widest text-cyan-600 uppercase">
          {t9n.lureCategory}
        </div>
        <div className="mt-0.5 text-[12px] leading-tight font-black">{t9n.lureHeadline}</div>
        <div className="mt-1.5 h-1.5 w-full rounded bg-neutral-100" />
        <div className="mt-1 h-1.5 w-4/5 rounded bg-neutral-100" />
        <div className="mt-1 h-1.5 w-3/5 rounded bg-neutral-100" />
      </div>
      {/* Cookie banner */}
      <div className="absolute right-0 bottom-0 left-0 flex h-10 items-center border-t border-neutral-200 bg-neutral-50 px-3">
        <div className="flex items-center gap-1">
          <span className="text-xs">🍪</span>
          <span className="text-[8px] font-semibold text-neutral-600">{t9n.cookieNotice}</span>
        </div>
        {/* aligned button — same shared box as the target's Star button */}
        <div
          className="absolute flex items-center justify-center rounded-md bg-neutral-900 text-[9px] font-bold whitespace-nowrap text-white"
          style={{ right: BTN_RIGHT, bottom: BTN_BOTTOM, width: BTN_W, height: BTN_H }}
        >
          {t9n.acceptBtn}
        </div>
      </div>
    </div>
  );
}

function TargetPage() {
  return (
    <div className="relative h-full w-full text-neutral-900">
      <div className="flex h-8 items-center gap-2 bg-[#0d1117] px-3">
        <svg height="14" viewBox="0 0 16 16" fill="white" className="shrink-0">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span className="text-[9px] font-semibold text-white/90">github.com</span>
      </div>
      <div className="px-3 pt-2.5">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="font-semibold text-blue-600">attacker</span>
          <span className="text-neutral-400">/</span>
          <span className="font-bold text-blue-600">evil-repo</span>
          <span className="ml-1 rounded-full border border-neutral-300 px-1.5 text-[7px] text-neutral-500">
            Public
          </span>
        </div>
        <div className="mt-1 flex gap-2 text-[8px] text-neutral-500">
          <span>⭐ 1.2k</span>
          <span>🍴 234</span>
        </div>
      </div>
      {/* Star button — same shared box as the lure's Accept button */}
      <div className="absolute right-0 bottom-0 left-0 flex h-10 items-center border-t border-neutral-200 px-3">
        <div
          className="absolute flex items-center justify-center rounded-md border border-neutral-300 bg-neutral-100 text-[9px] font-bold whitespace-nowrap text-neutral-800"
          style={{ right: BTN_RIGHT, bottom: BTN_BOTTOM, width: BTN_W, height: BTN_H }}
        >
          ⭐ Star
        </div>
      </div>
    </div>
  );
}
