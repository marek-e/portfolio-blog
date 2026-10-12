import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { chain } from './kv-adding-machine/model';

type Lang = 'en' | 'fr';
type Scenario = 'append' | 'system';
type Result = 'hit' | 'miss' | 'skip';

const SCENARIOS: Scenario[] = ['append', 'system'];
const CACHED = 5;
const SYSTEM = 2;
const STEP_MS = 650;
const STILLNESS = '(prefers-reduced-motion: reduce)';

const STRINGS = {
  en: {
    blocks: ['tools', 'tools', 'system', 'CLAUDE.md', 'msg 1', 'reply 1', 'msg 2'],
    newSystem: 'system v2',
    scenarios: { append: 'Next turn', system: 'New system prompt' },
    cache: 'Cache, 5 blocks written by request 1, stored by name',
    request: 'Request 2, 7 blocks of 16 tokens',
    rule: 'name = hash(previous name + the 16 tokens of the block)',
    badges: { hit: 'HIT', miss: 'MISS', skip: 'SKIP' },
    block: 'block',
    was: 'was',
    checking: (block: number, name: string) => `block ${block}: looking up ${name}`,
    summary: {
      append:
        '5 blocks read from the cache, 2 computed. The first unknown name is reply 1, which request 1 did not have, and the engine stops there.',
      system:
        '2 blocks read from the cache, 5 computed. CLAUDE.md and msg 1 hold the same tokens as in request 1, but their names changed with the system prompt, so the cache cannot find them.',
    },
    caption:
      'The engine names the blocks of request 2 in order and stops at the first name the cache does not know',
    aria: {
      append:
        'Request 2 has 7 blocks. The cache holds the 5 blocks of request 1. The engine looks up blocks 1 to 5 by name and finds them, then block 6, reply 1, is not in the cache, so it stops. 5 blocks are read from the cache and 2 are computed.',
      system:
        'Request 2 has a new system prompt in block 3. Blocks 1 and 2, the tools, are found in the cache. Block 3 has a new name and is not in the cache, so the engine stops. Blocks 4 and 5 hold the same tokens as before but have new names. 2 blocks are read from the cache and 5 are computed.',
    },
  },
  fr: {
    blocks: ['outils', 'outils', 'système', 'CLAUDE.md', 'msg 1', 'réponse 1', 'msg 2'],
    newSystem: 'système v2',
    scenarios: { append: 'Tour suivant', system: 'Nouveau prompt système' },
    cache: 'Cache, 5 blocs écrits par la requête 1, rangés par nom',
    request: 'Requête 2, 7 blocs de 16 tokens',
    rule: 'nom = hash(nom précédent + les 16 tokens du bloc)',
    badges: { hit: 'SUCCÈS', miss: 'RATÉ', skip: 'IGNORÉ' },
    block: 'bloc',
    was: 'avant',
    checking: (block: number, name: string) => `bloc ${block} : recherche de ${name}`,
    summary: {
      append:
        '5 blocs lus depuis le cache, 2 calculés. Le premier nom inconnu est la réponse 1, absente de la requête 1, et le moteur s’arrête là.',
      system:
        '2 blocs lus depuis le cache, 5 calculés. CLAUDE.md et msg 1 contiennent les mêmes tokens que dans la requête 1, mais leurs noms ont changé avec le prompt système, donc le cache ne les trouve pas.',
    },
    caption:
      'Le moteur nomme les blocs de la requête 2 dans l’ordre et s’arrête au premier nom que le cache ne connaît pas',
    aria: {
      append:
        'La requête 2 a 7 blocs. Le cache contient les 5 blocs de la requête 1. Le moteur cherche les blocs 1 à 5 par leur nom et les trouve, puis le bloc 6, la réponse 1, n’est pas dans le cache, donc il s’arrête. 5 blocs sont lus depuis le cache et 2 sont calculés.',
      system:
        'La requête 2 a un nouveau prompt système dans le bloc 3. Les blocs 1 et 2, les outils, sont trouvés dans le cache. Le bloc 3 a un nouveau nom et n’est pas dans le cache, donc le moteur s’arrête. Les blocs 4 et 5 contiennent les mêmes tokens qu’avant mais ont de nouveaux noms. 2 blocs sont lus depuis le cache et 5 sont calculés.',
    },
  },
} satisfies Record<Lang, unknown>;

const BADGE_STYLES: Record<Result, string> = {
  hit: 'bg-green-600 text-white dark:bg-green-500 dark:text-green-950',
  miss: 'bg-red-600 text-white dark:bg-red-500 dark:text-red-950',
  skip: 'bg-foreground/10 text-muted-foreground',
};

const CELL_STYLES: Record<Result, string> = {
  hit: 'border-green-600/60 bg-green-600/10 dark:border-green-500/60 dark:bg-green-500/10',
  miss: 'border-red-600/60 bg-red-600/10 dark:border-red-500/60 dark:bg-red-500/10',
  skip: 'opacity-60',
};

function lookupOf(lang: Lang, scenario: Scenario) {
  const first = STRINGS[lang].blocks;
  const labels =
    scenario === 'system'
      ? first.map((label, index) => (index === SYSTEM ? STRINGS[lang].newSystem : label))
      : first;
  const written = chain(first.slice(0, CACHED));
  const stored = new Set(written);
  const names = chain(labels);
  const stop = names.findIndex((name) => !stored.has(name));
  const results: Result[] = names.map((_, index) =>
    index < stop ? 'hit' : index === stop ? 'miss' : 'skip'
  );
  const cache = written
    .map((name, index) => ({ name, label: first[index] }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const previous = names.map((name, index) =>
    written[index] && written[index] !== name ? written[index] : ''
  );
  return { labels, names, previous, results, stop, cache };
}

export function PrefixLookup({ lang = 'en' }: { lang?: Lang }) {
  const t = STRINGS[lang];
  const [scenario, setScenario] = useState<Scenario>('append');
  const lookup = useMemo(() => lookupOf(lang, scenario), [lang, scenario]);
  const [step, setStep] = useState(lookup.stop + 1);
  const [playing, setPlaying] = useState(false);
  const done = step > lookup.stop;

  useEffect(() => {
    if (!playing || step > lookup.stop) return;
    const id = window.setTimeout(() => setStep((value) => value + 1), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, step, lookup.stop]);

  const run = (next: Scenario) => {
    const still = window.matchMedia(STILLNESS).matches;
    setScenario(next);
    setStep(still ? lookupOf(lang, next).stop + 1 : 0);
    setPlaying(!still);
  };

  const resultAt = (index: number) => (index < step || done ? lookup.results[index] : undefined);
  const checkedName = done ? undefined : lookup.names[step];
  const hitNames = new Set(lookup.names.slice(0, Math.min(step, lookup.stop)));

  return (
    <figure className="not-prose my-8">
      <div className="bg-card text-card-foreground rounded-xl border p-3 font-mono text-[9px] sm:p-6 sm:text-xs">
        <div role="img" aria-label={t.aria[scenario]}>
          <div className="text-muted-foreground mb-2">{t.cache}</div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {lookup.cache.map((entry) => (
              <div
                key={entry.name}
                className={`rounded-md border px-1.5 py-1 transition-colors sm:px-2 ${
                  entry.name === checkedName
                    ? 'ring-2 ring-green-600 dark:ring-green-500'
                    : hitNames.has(entry.name)
                      ? 'border-green-600/60 dark:border-green-500/60'
                      : ''
                }`}
              >
                <span className="text-foreground font-bold">{entry.name}</span>
                <span className="text-muted-foreground"> {entry.label}</span>
              </div>
            ))}
          </div>

          <div className="text-muted-foreground mt-5 mb-2 border-t pt-4">{t.request}</div>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7 sm:gap-2">
            {lookup.labels.map((label, index) => {
              const result = resultAt(index);
              const changed = scenario === 'system' && index === SYSTEM;
              return (
                <div key={index} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full rounded-md border px-1 py-1.5 text-center transition-colors sm:py-2 ${
                      result ? CELL_STYLES[result] : ''
                    } ${!done && index === step ? 'ring-primary ring-2' : ''}`}
                  >
                    <div className="text-muted-foreground">
                      {t.block} {index + 1}
                    </div>
                    <div className={`truncate ${changed ? 'text-primary' : 'text-foreground'}`}>
                      {label}
                    </div>
                    <div className="text-foreground font-bold">{lookup.names[index]}</div>
                    <div
                      className={`text-muted-foreground ${lookup.previous[index] ? '' : 'invisible'}`}
                    >
                      {t.was}{' '}
                      <span className="line-through">{lookup.previous[index] || '0000'}</span>
                    </div>
                  </div>
                  <span
                    className={`rounded-[3px] px-1 py-0.5 font-bold tracking-wide sm:px-1.5 ${
                      result ? BADGE_STYLES[result] : 'invisible'
                    }`}
                  >
                    {result ? t.badges[result] : t.badges.skip}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-muted-foreground mt-3">{t.rule}</div>
        </div>

        <p className="mt-4 border-t pt-4 sm:text-xs" aria-live="polite">
          {done ? t.summary[scenario] : t.checking(step + 1, lookup.names[step])}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {SCENARIOS.map((option) => (
            <Button
              key={option}
              type="button"
              variant="outline"
              size="xs"
              aria-pressed={option === scenario}
              className="aria-pressed:bg-muted font-mono"
              onClick={() => run(option)}
            >
              {t.scenarios[option]}
            </Button>
          ))}
        </div>
      </div>
      <figcaption className="text-muted-foreground mt-2 text-center text-sm">
        {t.caption}
      </figcaption>
    </figure>
  );
}
