import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react';
import './kv-adding-machine/kv-adding-machine.css';
import { Items, Solid, writeSolid } from './kv-adding-machine/art';
import {
  ART,
  COUNTER_BOX,
  COUNTER_MATRIX,
  CUT,
  FRONT_MATRIX,
  HEAD_PATHS,
  KNIFE_PATHS,
  TAPE,
  TEAR,
  VIEW_NARROW,
  VIEW_WIDE,
  curl,
  curlCrown,
  curlEdges,
} from './kv-adding-machine/geometry';
import {
  CHANGED,
  COUNT,
  TIMES,
  frameAt,
  tapeOf,
  type Frame,
  type Lang,
} from './kv-adding-machine/model';
import { poseOf } from './kv-adding-machine/pose';

const STRINGS = {
  en: {
    fig: 'Fig 1',
    title: 'Adding machine',
    hint: 'Change a token or replay',
    change: 'Change token 5',
    replay: 'Replay',
    prefill: (n: number) => `prefill · ${n} of 8 lines printed`,
    cut: (from: string, to: string) => `token 5: ${from} → ${to} · cut after line 4`,
    reprint: (n: number) => `4 lines read from the cache · ${n} printed again`,
    lit: 'Lit: the print head, then each line printed again',
    cache: 'Shaded: lines read from the cache',
    caption:
      'Each line carries its token and a running hash of itself and every line above it. Change token 5 and lines 1 to 4 keep their hashes, so the server finds them in the cache. Lines 5 to 8 depended on the old token: they drop into the bin and print again.',
    label:
      'A printing adding machine on a bench. Each token of the prompt is keyed in, the crank turns and the print head prints one line on the paper tape: the token and a running hash of that line and every line before it. When token 5 changes, the tape is cut after line 4, lines 5 to 8 fall into a bin, and they are printed again with new hashes while lines 1 to 4 stay on the tape.',
    changed: 'Token 5 changed. Lines 1 to 4 are read from the cache, lines 5 to 8 print again.',
    replaying: 'Replaying the prefill from the first token.',
  },
  fr: {
    fig: 'Fig 1',
    title: 'Calculatrice imprimante',
    hint: 'Changez un token ou rejouez',
    change: 'Changer le token 5',
    replay: 'Rejouer',
    prefill: (n: number) => `prefill · ${n} ${n > 1 ? 'lignes imprimées' : 'ligne imprimée'} sur 8`,
    cut: (from: string, to: string) => `token 5 : ${from} → ${to} · coupe après la ligne 4`,
    reprint: (n: number) =>
      `4 lignes lues depuis le cache · ${n} ${n > 1 ? 'réimprimées' : 'réimprimée'}`,
    lit: 'En couleur : la tête d’impression, puis chaque ligne réimprimée',
    cache: 'Grisées : les lignes lues depuis le cache',
    caption:
      'Chaque ligne porte son token et un hash cumulé d’elle-même et de toutes les lignes au-dessus. Changez le token 5 : les lignes 1 à 4 gardent leur hash, le serveur les retrouve dans le cache. Les lignes 5 à 8 dépendaient de l’ancien token : elles tombent dans le bac et sont réimprimées.',
    label:
      'Une calculatrice imprimante sur un établi. Chaque token du prompt est tapé, la manivelle tourne et la tête imprime une ligne sur la bande de papier : le token et un hash cumulé de cette ligne et de toutes les précédentes. Quand le token 5 change, la bande est coupée après la ligne 4, les lignes 5 à 8 tombent dans un bac, puis sont réimprimées avec de nouveaux hash, tandis que les lignes 1 à 4 restent sur la bande.',
    changed:
      'Token 5 changé. Les lignes 1 à 4 sont lues depuis le cache, les lignes 5 à 8 sont réimprimées.',
    replaying: 'Le prefill rejoue depuis le premier token.',
  },
} satisfies Record<Lang, unknown>;

const STILLNESS = '(prefers-reduced-motion: reduce)';
const NARROW = '(max-width: 520px)';
const BASELINE = TAPE.font * 0.36;
const TAPE_WIDTH = TAPE.x1 - TAPE.x0;
const CACHE_TOP = TAPE.print + COUNT * TAPE.pitch + TAPE.pitch / 2;

function readoutOf(frame: Frame, lang: Lang, from: string, to: string) {
  const t = STRINGS[lang];
  if (frame.phase === 'prefill' || frame.phase === 'printed') return t.prefill(frame.printed);
  if (frame.phase === 'change') return t.cut(from, to);
  return t.reprint(frame.reprinted);
}

const leaderOf = (token: string) => ' ' + '·'.repeat(Math.max(0, 6 - token.length));

function TapeLine({
  slot,
  feed,
  token,
  hash,
  opacity,
  lit,
  refs,
}: {
  slot: number;
  feed: number;
  token: string;
  hash: string;
  opacity: string;
  lit?: boolean;
  refs: RefObject<(SVGGElement | null)[]>;
}) {
  return (
    <g
      className="kvam-line"
      opacity={opacity}
      data-lit={lit ? '' : undefined}
      ref={(node) => {
        refs.current[slot] = node;
      }}
    >
      <text
        className="kvam-text"
        fontSize={TAPE.font}
        y={-(TAPE.print - feed * TAPE.pitch) + BASELINE}
      >
        <tspan data-col="index" x={TAPE.x0 + 3}>
          {slot + 1}
        </tspan>
        <tspan x={TAPE.x0 + 9.5}>{token}</tspan>
        <tspan data-col="lead">{leaderOf(token)}</tspan>
        <tspan x={TAPE.x0 + 37.5}>{hash}</tspan>
      </text>
    </g>
  );
}

const set = (node: Element | null | undefined, name: string, value: string) => {
  if (node && node.getAttribute(name) !== value) node.setAttribute(name, value);
};

export function KvAddingMachine({ lang = 'en' }: { lang?: Lang }) {
  const t = STRINGS[lang];
  const tape = useMemo(() => tapeOf(lang), [lang]);
  const before = useMemo(() => tape.before.map((line) => line.token), [tape]);
  const after = useMemo(() => tape.after.map((line) => line.token), [tape]);
  const rest = useMemo(() => frameAt(TIMES.reprintTo, before, after), [before, after]);
  const pose = useMemo(() => poseOf(rest), [rest]);

  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const keys = useRef<(SVGGElement | null)[]>([]);
  const bar = useRef<SVGGElement>(null);
  const head = useRef<SVGGElement>(null);
  const headSolid = useRef<SVGGElement>(null);
  const arm = useRef<SVGGElement>(null);
  const grip = useRef<SVGGElement>(null);
  const cap = useRef<SVGGElement>(null);
  const knife = useRef<SVGGElement>(null);
  const knifeSolid = useRef<SVGGElement>(null);
  const cutLine = useRef<SVGPathElement>(null);
  const oldLines = useRef<(SVGGElement | null)[]>([]);
  const newLines = useRef<(SVGGElement | null)[]>([]);
  const upperText = useRef<SVGGElement>(null);
  const stripText = useRef<SVGGElement>(null);
  const freshText = useRef<SVGGElement>(null);
  const strip = useRef<SVGGElement>(null);
  const stripEdges = useRef<SVGPathElement>(null);
  const freshPaper = useRef<SVGRectElement>(null);
  const freshEdges = useRef<SVGPathElement>(null);
  const freshTop = useRef<SVGPathElement>(null);
  const edges = useRef<SVGGElement>(null);
  const cache = useRef<SVGGElement>(null);
  const digits = useRef<SVGTextElement>(null);

  const state = useRef({
    clock: TIMES.reprintTo,
    mode: 'tour' as 'tour' | 'play' | 'still',
    until: TIMES.reprintTo,
    fast: 0,
    visible: false,
    frame: 0,
    last: 0,
  });

  const draw = useCallback(
    (frame: Frame) => {
      const p = poseOf(frame);
      keys.current.forEach((node, index) => set(node, 'transform', p.keys[index]));
      set(bar.current, 'transform', p.bar);
      set(head.current, 'transform', p.head);
      headSolid.current?.toggleAttribute('data-lit', p.headLit);
      writeSolid(arm.current, p.arm);
      writeSolid(grip.current, p.grip);
      writeSolid(cap.current, p.cap);
      set(knife.current, 'transform', p.knife);
      knifeSolid.current?.toggleAttribute('data-lit', p.knifeLit);
      set(cutLine.current, 'd', p.cut);
      set(upperText.current, 'transform', p.oldFeed);
      set(stripText.current, 'transform', p.oldFeed);
      set(freshText.current, 'transform', p.newFeed);
      oldLines.current.forEach((node, index) => set(node, 'opacity', p.oldOpacity[index]));
      newLines.current.forEach((node, index) => {
        set(node, 'opacity', p.newOpacity[index]);
        node?.toggleAttribute('data-lit', p.newLit[index]);
      });
      set(strip.current, 'transform', p.strip);
      set(strip.current, 'opacity', p.fade);
      set(stripEdges.current, 'opacity', p.edges);
      set(freshPaper.current, 'y', p.freshY);
      set(freshPaper.current, 'height', p.freshHeight);
      set(freshEdges.current, 'd', p.freshEdges);
      set(freshTop.current, 'd', p.freshTop);
      set(edges.current, 'opacity', p.edges);
      set(cache.current, 'opacity', p.cache);
      if (digits.current && digits.current.textContent !== p.count)
        digits.current.textContent = p.count;
      const text = readoutOf(frame, lang, tape.before[CHANGED].token, tape.after[CHANGED].token);
      if (readout.current && readout.current.textContent !== text)
        readout.current.textContent = text;
    },
    [lang, tape]
  );

  const render = useCallback(() => {
    draw(frameAt(state.current.clock, before, after));
  }, [draw, before, after]);

  const tick = useCallback(
    (now: number) => {
      const s = state.current;
      const dt = s.last ? Math.min((now - s.last) / 1000, 1 / 30) : 1 / 60;
      s.last = now;
      s.clock += dt * (s.fast > s.clock ? 4 : 1);
      let more = true;
      if (s.mode === 'tour' && s.clock >= TIMES.loop) s.clock = 0;
      if (s.mode === 'play' && s.clock >= s.until) {
        s.clock = s.until;
        more = false;
      }
      render();
      s.frame = more && s.visible ? requestAnimationFrame(tick) : 0;
    },
    [render]
  );

  const run = useCallback(() => {
    const s = state.current;
    if (s.frame || !s.visible || s.mode === 'still') return;
    if (s.mode === 'play' && s.clock >= s.until) return;
    s.last = 0;
    s.frame = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const s = state.current;
    const still = window.matchMedia(STILLNESS);
    const narrow = window.matchMedia(NARROW);
    const frame = () =>
      svg.current?.setAttribute('viewBox', narrow.matches ? VIEW_NARROW : VIEW_WIDE);
    frame();
    narrow.addEventListener('change', frame);
    if (still.matches) s.mode = 'still';
    const settle = () => {
      if (still.matches) {
        s.mode = 'still';
        cancelAnimationFrame(s.frame);
        s.frame = 0;
        s.clock = TIMES.reprintTo;
        render();
      } else if (s.mode === 'still') {
        s.mode = 'tour';
        run();
      }
    };
    still.addEventListener('change', settle);
    render();
    const observer = new IntersectionObserver(
      (entries) => {
        s.visible = Boolean(entries[entries.length - 1]?.isIntersecting);
        if (s.visible) run();
      },
      { rootMargin: '120px 0px' }
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      narrow.removeEventListener('change', frame);
      still.removeEventListener('change', settle);
      cancelAnimationFrame(s.frame);
      s.frame = 0;
    };
  }, [render, run]);

  const play = (from: number, message: string) => {
    const s = state.current;
    if (status.current) status.current.textContent = message;
    if (window.matchMedia(STILLNESS).matches) {
      s.mode = 'still';
      s.clock = from <= 0 ? TIMES.prefillTo : TIMES.reprintTo;
      render();
      return;
    }
    s.clock = from;
    s.fast = from < TIMES.prefillTo && from > 0 ? TIMES.prefillTo : 0;
    s.mode = 'play';
    s.until = TIMES.reprintTo;
    run();
  };

  const change = () => {
    const s = state.current;
    const from = s.clock >= TIMES.change ? TIMES.prefillTo : s.clock;
    play(Math.max(from, 0.0001), t.changed);
    if (from < TIMES.prefillTo) s.fast = TIMES.prefillTo;
  };

  const replay = () => play(0, t.replaying);

  return (
    <figure className="kvam not-prose my-8">
      <div ref={root} className="kvam-card bg-card text-card-foreground rounded-xl border">
        <span className="kvam-corner" data-corner="fig" aria-hidden="true">
          {t.fig}
        </span>
        <span className="kvam-corner" data-corner="title" aria-hidden="true">
          {t.title}
        </span>
        <span className="kvam-corner" data-corner="hint" aria-hidden="true">
          {t.hint}
        </span>
        <span ref={readout} className="kvam-corner" data-corner="readout" aria-hidden="true">
          {readoutOf(rest, lang, tape.before[CHANGED].token, tape.after[CHANGED].token)}
        </span>
        <svg ref={svg} className="kvam-svg" viewBox={VIEW_WIDE} role="img" aria-label={t.label}>
          <defs>
            <clipPath id={`kvam-tape-${lang}`}>
              <rect x={TAPE.x0} y={-TAPE.top} width={TAPE_WIDTH} height={TAPE.top} />
            </clipPath>
          </defs>
          <Items name="plate" items={ART.plate} />
          <Items name="binBack" items={ART.binBack} />
          <Items name="housing" items={ART.housing} />
          <path className="kvam-tape" d={curl()} />
          <path className="kvam-tape-shade" d={curlCrown()} />
          <path className="kvam-edge" d={curlEdges()} />
          <g transform={FRONT_MATRIX}>
            <rect
              className="kvam-tape"
              x={TAPE.x0}
              y={-TAPE.top}
              width={TAPE_WIDTH}
              height={TAPE.top - CUT}
            />
            <path
              className="kvam-edge"
              d={`M${TAPE.x0} ${-TAPE.top}V${-CUT}M${TAPE.x1} ${-TAPE.top}V${-CUT}`}
            />
            <rect
              ref={freshPaper}
              className="kvam-tape"
              x={TAPE.x0}
              y={pose.freshY}
              width={TAPE_WIDTH}
              height={pose.freshHeight}
            />
            <path ref={freshEdges} className="kvam-edge" d={pose.freshEdges} />
          </g>
          <g ref={strip} transform={pose.strip} opacity={pose.fade}>
            <rect
              className="kvam-tape"
              x={TAPE.x0}
              y={-CUT}
              width={TAPE_WIDTH}
              height={CUT - TEAR}
            />
            <path
              className="kvam-edge"
              d={`M${TAPE.x0} ${-CUT}V${-TEAR}M${TAPE.x1} ${-CUT}V${-TEAR}`}
            />
            <path
              ref={stripEdges}
              className="kvam-edge"
              opacity={pose.edges}
              d={`M${TAPE.x0} ${-CUT}H${TAPE.x1}M${TAPE.x0} ${-TEAR}H${TAPE.x1}`}
            />
            <g ref={stripText} transform={pose.oldFeed}>
              {tape.before.slice(CHANGED).map((line) => (
                <TapeLine
                  key={`old-${line.index}`}
                  slot={line.index}
                  feed={line.index}
                  token={line.token}
                  hash={line.hash}
                  opacity={pose.oldOpacity[line.index]}
                  refs={oldLines}
                />
              ))}
            </g>
          </g>
          <g transform={FRONT_MATRIX} clipPath={`url(#kvam-tape-${lang})`}>
            <g ref={cache} opacity={pose.cache}>
              <rect
                className="kvam-cache"
                x={TAPE.x0}
                y={-CACHE_TOP}
                width={TAPE_WIDTH}
                height={CHANGED * TAPE.pitch}
              />
              <path
                className="iso-line"
                data-tone="mid"
                d={`M${TAPE.x0 + 1.4} ${-CACHE_TOP + 1}V${-CUT - 1}`}
              />
            </g>
            <g ref={upperText} transform={pose.oldFeed}>
              {tape.before.slice(0, CHANGED).map((line) => (
                <TapeLine
                  key={`old-${line.index}`}
                  slot={line.index}
                  feed={line.index}
                  token={line.token}
                  hash={line.hash}
                  opacity={pose.oldOpacity[line.index]}
                  refs={oldLines}
                />
              ))}
            </g>
            <g ref={freshText} transform={pose.newFeed}>
              {tape.after.slice(CHANGED).map((line) => (
                <TapeLine
                  key={`new-${line.index}`}
                  slot={line.index}
                  feed={line.index - CHANGED}
                  token={line.token}
                  hash={line.hash}
                  opacity={pose.newOpacity[line.index]}
                  lit={pose.newLit[line.index]}
                  refs={newLines}
                />
              ))}
            </g>
            <g ref={edges} opacity={pose.edges}>
              <path className="kvam-edge" d={`M${TAPE.x0} ${-CUT}H${TAPE.x1}`} />
              <path ref={freshTop} className="kvam-edge" d={pose.freshTop} />
            </g>
            <path ref={cutLine} className="kvam-cut" d={pose.cut} />
          </g>
          <Items name="binFront" items={ART.binFront} />
          <Items name="knifeRail" items={ART.knifeRail} />
          <g ref={knife} transform={pose.knife}>
            <Solid ref={knifeSolid} paths={KNIFE_PATHS.carriage} lit={pose.knifeLit} />
            <Solid paths={KNIFE_PATHS.thumb} />
          </g>
          {ART.steps.map((group, row) => (
            <g key={`row-${row}`}>
              <Items name={`step-${row}`} items={group} />
              {row === 0 ? (
                <>
                  <Items name="print" items={ART.printUnit} />
                  <g ref={head} transform={pose.head}>
                    <Solid paths={HEAD_PATHS[0]} />
                    <Solid
                      ref={headSolid}
                      paths={HEAD_PATHS[1]}
                      tone="hi"
                      crease="lo"
                      lit={pose.headLit}
                    />
                  </g>
                </>
              ) : (
                ART.keysByRow[row - 1].map((digit) => (
                  <g
                    key={`key-${digit}`}
                    transform={pose.keys[digit]}
                    ref={(node) => {
                      keys.current[digit] = node;
                    }}
                  >
                    <Items name={`key-${digit}`} items={ART.keys[digit]} />
                  </g>
                ))
              )}
              <Items name={`funcs-${row}`} items={ART.funcs[row]} />
              {row === 3 ? (
                <g ref={bar} transform={pose.bar}>
                  <Items name="bar" items={ART.bar} />
                </g>
              ) : null}
            </g>
          ))}
          <Items name="hub" items={ART.hub} />
          <Solid ref={arm} paths={pose.arm} />
          <Solid ref={grip} paths={pose.grip} />
          <Solid ref={cap} paths={pose.cap} />
          <text
            ref={digits}
            className="kvam-digits"
            transform={COUNTER_MATRIX}
            x={(COUNTER_BOX.x0 + COUNTER_BOX.x1) / 2}
            y={-(COUNTER_BOX.z0 + COUNTER_BOX.z1) / 2 + 2.4}
            fontSize={6.6}
            textAnchor="middle"
            letterSpacing={3}
          >
            {pose.count}
          </text>
        </svg>
        <span ref={status} className="kvam-sr" role="status" aria-live="polite" />
      </div>
      <div className="kvam-controls">
        <button type="button" className="kvam-button" onClick={change}>
          {t.change}
        </button>
        <button type="button" className="kvam-button" onClick={replay}>
          {t.replay}
        </button>
      </div>
      <figcaption className="kvam-legend">
        <span className="kvam-keys">
          <span className="kvam-key">
            <span className="kvam-swatch" data-mark="lit" />
            {t.lit}
          </span>
          <span className="kvam-key">
            <span className="kvam-swatch" data-mark="cache" />
            {t.cache}
          </span>
        </span>
        <span>{t.caption}</span>
      </figcaption>
    </figure>
  );
}
