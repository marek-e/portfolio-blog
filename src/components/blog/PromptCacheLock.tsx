import { useCallback, useEffect, useRef, useState } from 'react';

import {
  BACK_ART,
  DIAL_ART,
  HEIGHT,
  KEY_HANDLE,
  WIDTH,
  bladeSvg,
  camSvg,
  keyShiftOf,
  needleSvg,
  stackSvg,
} from './prompt-cache-lock/geometry';
import {
  CUTS,
  atMost,
  nextRead,
  remainingOf,
  sceneOf,
  send,
  wait,
  type Scene,
  type Ttl,
} from './prompt-cache-lock/model';
import { endOf, frameOf, restOf, type Frame, type Move } from './prompt-cache-lock/motion';
import './prompt-cache-lock/lock.css';

type Lang = 'en' | 'fr';
type Action = 'send' | 'system' | 'wait' | 'ttl5' | 'ttl60' | 'reset';

const STRINGS = {
  en: {
    fig: 'Fig. 1',
    title: 'Prompt cache',
    hint: 'Send a turn, change the prompt, or wait',
    next: 'Next turn',
    restart: 'Start over',
    system: 'Change system prompt',
    wait: 'Wait 10 min',
    ttl: 'TTL',
    ttlGroup: 'Cache time to live',
    five: '5 min',
    hour: '1 h',
    controls: 'Lock controls',
    group: (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    money: (value: number) => `$${value.toFixed(4)}`,
    read: (read: string, written: string) => `read ${read} · write ${written} tok`,
    cost: (cost: string, uncached: string) => `${cost} · no cache ${uncached}`,
    sending: (turns: number) => `sending turn ${turns}…`,
    tokens: (total: string) => `${total} tokens`,
    idle: (idle: number, left: number) => `idle ${idle} min · ${left} min left`,
    expired: (idle: number) => `idle ${idle} min · cache expired`,
    cached: (tokens: string) => `${tokens} tokens still cached`,
    rewrite: 'next turn writes it all again',
    keys: {
      lit: 'Pins at the shear line: read from cache, $0.20 per million tokens',
      raised: 'Re-cut pins: written to cache, $5 (5 min) or $8 (1 h) per million',
    },
    caption:
      'A pin-tumbler lock, cut open. The key is the request Claude Code sends, cut in prefix order: tools and system prompt (20,000 tokens), CLAUDE.md and memory (4,000), then one cut per conversation turn (6,000). Each cut depends on everything before it. The pins are the cache entry the previous request left behind: every pin up to the first mismatch lines up and is read at $0.20 per million tokens on Claude Opus 5.5, instead of $4. From the first mismatch on, pins are re-cut and written at $5 with the 5-minute TTL or $8 with the 1-hour TTL. The dial counts down the entry’s time to live, and each request starts it again. Claude Code uses the 1-hour TTL for the main conversation on a subscription, and 5 minutes with an API key, on cloud providers, in overage and for subagents.',
    label:
      'An isometric cutaway of a pin-tumbler lock on a bench. A key with up to eight cuts sits in the plug; above each cut a stack of a key pin, a driver pin and a spring sits in its chamber. Pins whose key pin meets the shear line are highlighted. A tailpiece at the back turns when the lock opens, and a dial timer on the bench shows the time left on the cache entry.',
  },
  fr: {
    fig: 'Fig. 1',
    title: 'Cache de prompt',
    hint: 'Envoyez un tour, changez le prompt ou attendez',
    next: 'Tour suivant',
    restart: 'Recommencer',
    system: 'Modifier le prompt système',
    wait: 'Attendre 10 min',
    ttl: 'TTL',
    ttlGroup: 'Durée de vie du cache',
    five: '5 min',
    hour: '1 h',
    controls: 'Commandes de la serrure',
    group: (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f'),
    money: (value: number) => `${value.toFixed(4).replace('.', ',')}\u00a0$`,
    read: (read: string, written: string) => `lu ${read} · écrit ${written} jetons`,
    cost: (cost: string, uncached: string) => `${cost} · sans cache ${uncached}`,
    sending: (turns: number) => `envoi du tour ${turns}…`,
    tokens: (total: string) => `${total} jetons`,
    idle: (idle: number, left: number) => `inactif ${idle} min · reste ${left} min`,
    expired: (idle: number) => `inactif ${idle} min · cache expiré`,
    cached: (tokens: string) => `${tokens} jetons encore en cache`,
    rewrite: 'le prochain tour réécrit tout',
    keys: {
      lit: 'Goupilles sur la ligne de cisaillement : lues en cache, 0,20 $ par million de jetons',
      raised: 'Goupilles retaillées : écrites en cache, 5 $ (5 min) ou 8 $ (1 h) par million',
    },
    caption:
      'Une serrure à goupilles ouverte en coupe. La clé est la requête qu’envoie Claude Code, taillée dans l’ordre du préfixe : outils et prompt système (20 000 jetons), CLAUDE.md et mémoire (4 000), puis une taille par tour de conversation (6 000). Chaque taille dépend de tout ce qui la précède. Les goupilles sont l’entrée de cache laissée par la requête précédente : jusqu’au premier désaccord, elles s’alignent et sont lues à 0,20 $ par million de jetons sur Claude Opus 5.5, au lieu de 4 $. À partir du premier désaccord, elles sont retaillées et écrites à 5 $ avec le TTL de 5 minutes, ou 8 $ avec le TTL d’une heure. Le cadran décompte la durée de vie de l’entrée, et chaque requête la relance. Claude Code utilise le TTL d’une heure pour la conversation principale avec un abonnement, et 5 minutes avec une clé d’API, chez les fournisseurs cloud, en dépassement de forfait et pour les sous-agents.',
    label:
      'Vue isométrique en coupe d’une serrure à goupilles posée sur un établi. Une clé à huit tailles au plus est engagée dans le rotor ; au-dessus de chaque taille, une goupille, une contre-goupille et un ressort occupent leur logement. Les goupilles qui affleurent la ligne de cisaillement sont mises en évidence. Un panneton tourne à l’arrière quand la serrure s’ouvre, et un minuteur à cadran sur l’établi indique le temps restant à l’entrée de cache.',
  },
};

type Strings = (typeof STRINGS)[Lang];

const TOUR: Action[] = ['send', 'wait', 'send', 'system', 'ttl5', 'wait', 'send', 'ttl60'];
const TOUR_FIRST = 1400;
const TOUR_BACK = 3600;
const PAUSE = 1700;
const LONGEST_FRAME = 1 / 30;
const STILLNESS = '(prefers-reduced-motion: reduce)';

const FIRST = sceneOf(60);
const FIRST_FRAME = restOf(FIRST);
const FIRST_KEY = keyShiftOf(0);
const FIRST_BLADE = bladeSvg(FIRST_FRAME.tops);
const FIRST_STACKS = FIRST_FRAME.stacks.map((stack, index) =>
  stackSvg(index, stack, 0, FIRST_FRAME.tops)
);
const FIRST_CAM = camSvg(FIRST_FRAME.cam);
const FIRST_NEEDLE = needleSvg(FIRST_FRAME.dial);
const CHAMBERS = Array.from({ length: CUTS }, (_, index) => index);

function resultLines(scene: Scene, t: Strings): [string, string] {
  const { read, written, cost, uncached } = scene.last;
  return [t.read(t.group(read), t.group(written)), t.cost(t.money(cost), t.money(uncached))];
}

function waitLines(scene: Scene, t: Strings): [string, string] {
  if (!scene.entry) return [t.expired(scene.idle), t.rewrite];
  return [t.idle(scene.idle, remainingOf(scene)), t.cached(t.group(nextRead(scene)))];
}

const linesOf = (scene: Scene, t: Strings) =>
  scene.waited ? waitLines(scene, t) : resultLines(scene, t);

interface Run {
  move: Move;
  from: Scene;
  to: Scene;
  t: number;
  seated: boolean;
  spoken: boolean;
}

interface Drawn {
  key: string;
  blade: string;
  stacks: string[];
  cam: string;
  needle: string;
}

export function PromptCacheLock({ lang = 'en' }: { lang?: Lang }) {
  const t = STRINGS[lang];
  const [scene, setScene] = useState<Scene>(FIRST);
  const [lines, setLines] = useState<[string, string]>(() => resultLines(FIRST, t));
  const [spoken, setSpoken] = useState('');
  const [visible, setVisible] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [still, setStill] = useState(false);
  const root = useRef<HTMLElement>(null);
  const keyNode = useRef<SVGGElement>(null);
  const bladeNode = useRef<SVGGElement>(null);
  const stackNodes = useRef<(SVGGElement | null)[]>([]);
  const camNode = useRef<SVGGElement>(null);
  const needleNode = useRef<SVGGElement>(null);
  const current = useRef<Scene>(FIRST);
  const run = useRef<Run | null>(null);
  const frame = useRef(0);
  const last = useRef(0);
  const drawn = useRef<Drawn>({
    key: FIRST_KEY,
    blade: FIRST_BLADE,
    stacks: [...FIRST_STACKS],
    cam: FIRST_CAM,
    needle: FIRST_NEEDLE,
  });
  const touring = useRef(false);
  const tourStep = useRef(0);
  const tourTimer = useRef(0);
  const actRef = useRef<(action: Action, byUser: boolean) => void>(() => {});

  const draw = useCallback((state: Frame) => {
    const memo = drawn.current;
    const key = keyShiftOf(state.keyShift);
    if (key !== memo.key && keyNode.current) {
      keyNode.current.setAttribute('transform', key);
      memo.key = key;
    }
    const blade = bladeSvg(state.tops);
    if (blade !== memo.blade && bladeNode.current) {
      bladeNode.current.innerHTML = blade;
      memo.blade = blade;
    }
    state.stacks.forEach((stack, index) => {
      const markup = stackSvg(index, stack, state.keyShift, state.tops);
      const node = stackNodes.current[index];
      if (markup !== memo.stacks[index] && node) {
        node.innerHTML = markup;
        memo.stacks[index] = markup;
      }
    });
    const cam = camSvg(state.cam);
    if (cam !== memo.cam && camNode.current) {
      camNode.current.innerHTML = cam;
      memo.cam = cam;
    }
    const needle = needleSvg(state.dial);
    if (needle !== memo.needle && needleNode.current) {
      needleNode.current.innerHTML = needle;
      memo.needle = needle;
    }
  }, []);

  const scheduleTour = useCallback((delay: number) => {
    window.clearTimeout(tourTimer.current);
    if (!touring.current) return;
    tourTimer.current = window.setTimeout(() => {
      if (!touring.current) return;
      const action = TOUR[tourStep.current % TOUR.length]!;
      tourStep.current += 1;
      actRef.current(action, false);
    }, delay);
  }, []);

  const finishRun = useCallback(
    (active: Run) => {
      run.current = null;
      draw(restOf(active.to));
      setLines(linesOf(active.to, t));
      scheduleTour(PAUSE);
    },
    [draw, scheduleTour, t]
  );

  const tick = useCallback(
    (now: number) => {
      const active = run.current;
      if (!active) {
        frame.current = 0;
        return;
      }
      const dt = last.current ? Math.min((now - last.current) / 1000, LONGEST_FRAME) : 1 / 60;
      last.current = now;
      active.t += dt;
      const end = endOf(active.move);
      const state = frameOf(active.move, active.from, active.to, Math.min(active.t, end));
      draw(state);
      if (state.seated && !active.seated) {
        active.seated = true;
        setLines(linesOf(active.to, t));
        if (active.spoken) setSpoken(linesOf(active.to, t).join('. '));
      }
      if (active.t >= end) {
        frame.current = 0;
        finishRun(active);
        return;
      }
      frame.current = requestAnimationFrame(tick);
    },
    [draw, finishRun, t]
  );

  const kick = useCallback(() => {
    if (frame.current || !run.current) return;
    last.current = 0;
    frame.current = requestAnimationFrame(tick);
  }, [tick]);

  const settleNow = useCallback(() => {
    const active = run.current;
    if (!active) return;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (!active.seated && active.spoken) setSpoken(linesOf(active.to, t).join('. '));
    finishRun(active);
  }, [finishRun, t]);

  const act = useCallback(
    (action: Action, byUser: boolean) => {
      if (byUser) {
        touring.current = false;
        window.clearTimeout(tourTimer.current);
      }
      settleNow();
      const from = current.current;
      const restart = action === 'reset' || (action === 'send' && atMost(from));
      if (restart || action === 'ttl5' || action === 'ttl60') {
        const ttl: Ttl = action === 'ttl5' ? 5 : action === 'ttl60' ? 60 : from.ttl;
        const fresh = sceneOf(ttl);
        current.current = fresh;
        setScene(fresh);
        draw(restOf(fresh));
        setLines(resultLines(fresh, t));
        if (byUser) setSpoken(resultLines(fresh, t).join('. '));
        scheduleTour(PAUSE);
        return;
      }
      if (action === 'system' && atMost(from)) return;
      const move: Move = action === 'wait' ? 'wait' : 'send';
      const to = move === 'wait' ? wait(from) : send(from, action === 'system');
      current.current = to;
      setScene(to);
      if (move === 'send') setLines([t.sending(to.turns), t.tokens(t.group(to.last.total))]);
      const next: Run = { move, from, to, t: 0, seated: false, spoken: byUser };
      run.current = next;
      if (window.matchMedia(STILLNESS).matches || !visible) {
        settleNow();
        return;
      }
      kick();
    },
    [draw, kick, scheduleTour, settleNow, t, visible]
  );

  useEffect(() => {
    actRef.current = act;
  }, [act]);

  useEffect(() => {
    const query = window.matchMedia(STILLNESS);
    const update = () => setStill(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => setVisible(Boolean(entries[entries.length - 1]?.isIntersecting)),
      { rootMargin: '120px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) settleNow();
  }, [visible, settleNow]);

  useEffect(() => {
    if (!visible || engaged || still) {
      touring.current = false;
      window.clearTimeout(tourTimer.current);
      return;
    }
    const delay = tourStep.current === 0 ? TOUR_FIRST : TOUR_BACK;
    const timer = window.setTimeout(() => {
      touring.current = true;
      if (!run.current) scheduleTour(0);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      touring.current = false;
      window.clearTimeout(tourTimer.current);
    };
  }, [visible, engaged, still, scheduleTour]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      window.clearTimeout(tourTimer.current);
    },
    []
  );

  const full = atMost(scene);

  return (
    <figure
      ref={root}
      className="pcl not-prose"
      data-ttl={scene.ttl}
      onPointerEnter={(event) => event.pointerType === 'mouse' && setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEngaged(false);
      }}
    >
      <div className="pcl-plate">
        <div className="pcl-head" aria-hidden="true">
          <span>{t.fig}</span>
          <span>{t.title}</span>
        </div>
        <div className="pcl-stage">
          <svg
            className="pcl-svg"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={t.label}
            focusable="false"
          >
            <g dangerouslySetInnerHTML={{ __html: BACK_ART }} />
            <g ref={camNode} dangerouslySetInnerHTML={{ __html: FIRST_CAM }} />
            <g ref={keyNode} transform={FIRST_KEY}>
              <g ref={bladeNode} dangerouslySetInnerHTML={{ __html: FIRST_BLADE }} />
              <g dangerouslySetInnerHTML={{ __html: KEY_HANDLE }} />
            </g>
            {CHAMBERS.map((index) => (
              <g
                key={index}
                ref={(node) => {
                  stackNodes.current[index] = node;
                }}
                dangerouslySetInnerHTML={{ __html: FIRST_STACKS[index]! }}
              />
            ))}
            <g dangerouslySetInnerHTML={{ __html: DIAL_ART }} />
            <g ref={needleNode} dangerouslySetInnerHTML={{ __html: FIRST_NEEDLE }} />
          </svg>
        </div>
        <div className="pcl-controls" role="group" aria-label={t.controls}>
          <button type="button" className="pcl-button" onClick={() => act('send', true)}>
            {full ? t.restart : t.next}
          </button>
          <button
            type="button"
            className="pcl-button"
            disabled={full}
            aria-disabled={full}
            onClick={() => act('system', true)}
          >
            {t.system}
          </button>
          <button type="button" className="pcl-button" onClick={() => act('wait', true)}>
            {t.wait}
          </button>
          <div className="pcl-ttl" role="group" aria-label={t.ttlGroup}>
            <span aria-hidden="true">{t.ttl}</span>
            <button type="button" aria-pressed={scene.ttl === 5} onClick={() => act('ttl5', true)}>
              {t.five}
            </button>
            <button
              type="button"
              aria-pressed={scene.ttl === 60}
              onClick={() => act('ttl60', true)}
            >
              {t.hour}
            </button>
          </div>
        </div>
        <div className="pcl-foot">
          <span>{t.hint}</span>
          <span className="pcl-readout" data-readout="">
            <span>{lines[0]}</span>
            <span>{lines[1]}</span>
          </span>
        </div>
        <p className="pcl-hidden" aria-live="polite">
          {spoken}
        </p>
      </div>
      <figcaption className="pcl-legend">
        <span className="pcl-keys">
          <span className="pcl-key">
            <svg className="pcl-swatch" data-mark="lit" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z" />
            </svg>
            {t.keys.lit}
          </span>
          <span className="pcl-key">
            <svg className="pcl-swatch" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z" />
              <path className="pcl-swatch-crease" d="M2 4.5 8 7.5 14 4.5" />
            </svg>
            {t.keys.raised}
          </span>
        </span>
        <span>{t.caption}</span>
      </figcaption>
    </figure>
  );
}
