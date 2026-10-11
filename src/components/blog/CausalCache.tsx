import './causal-cache.css';

type Lang = 'en' | 'fr';

const STRINGS = {
  en: {
    tokens: ['The', 'cache', 'is', 'a', 'prefix', 'match', 'rule', '.'],
    replacement: 'suffix',
    layer: 'layer',
    steps: [
      'Prefill: each token is computed from all the tokens before it',
      'One token changes: everything after it is now wrong',
      'Only the tokens after the change are computed again',
    ],
    lookBack: 'what the current token looks back at',
    computed: 'computed now',
    read: 'read from the KV cache',
    invalid: 'invalid, must be computed again',
    total: '4 tokens read from cache, 4 tokens computed again',
    caption:
      "Each token's keys and values depend on every token before it, so a change invalidates everything after it",
    aria: 'Eight tokens with their keys and values on three layers. They are computed left to right, then the fifth token changes: the first four are read from the cache and the last four are computed again.',
  },
  fr: {
    tokens: ['Le', 'cache', 'lit', 'le', 'début', 'du', 'texte', '.'],
    replacement: 'bout',
    layer: 'couche',
    steps: [
      'Prefill : chaque token est calculé à partir de tous ceux qui le précèdent',
      'Un token change : tout ce qui suit devient faux',
      'Seuls les tokens après le changement sont recalculés',
    ],
    lookBack: 'ce que le token en cours regarde',
    computed: 'calculé maintenant',
    read: 'lu depuis le KV cache',
    invalid: 'invalide, à recalculer',
    total: '4 tokens lus depuis le cache, 4 tokens recalculés',
    caption:
      'Les clés et valeurs de chaque token dépendent de tous les tokens qui le précèdent, donc un changement invalide tout ce qui suit',
    aria: 'Huit tokens avec leurs clés et valeurs sur trois couches. Ils sont calculés de gauche à droite, puis le cinquième token change : les quatre premiers sont lus depuis le cache et les quatre derniers sont recalculés.',
  },
} satisfies Record<Lang, unknown>;

const CHANGED_INDEX = 4;
const LAYERS = 3;

export function CausalCache({ lang = 'en' }: { lang?: Lang }) {
  const t = STRINGS[lang];

  return (
    <figure className="not-prose my-8">
      <div
        role="img"
        aria-label={t.aria}
        className="bg-card text-card-foreground rounded-xl border p-3 font-mono text-[11px] sm:p-6 sm:text-xs"
      >
        <div className="relative mb-5 min-h-10 sm:min-h-6">
          {t.steps.map((step, index) => (
            <p
              key={step}
              className={`kv-step-${index + 1} text-foreground absolute inset-x-0 top-0`}
            >
              {step}
            </p>
          ))}
        </div>

        <div className="flex gap-1.5 sm:gap-3">
          <div className="text-muted-foreground w-3 shrink-0 sm:w-16">
            <div className="h-7" />
            <div className="h-1.5" />
            {Array.from({ length: LAYERS }, (_, layer) => (
              <div key={layer} className="mt-1.5 flex h-5 items-center">
                <span className="hidden sm:inline">{t.layer}&nbsp;</span>
                {layer + 1}
              </div>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-8 gap-1">
              {t.tokens.map((token, index) => (
                <div
                  key={index}
                  className={`relative flex h-7 min-w-0 items-center justify-center overflow-hidden rounded-[3px] border text-[9px] tracking-tight sm:px-0.5 sm:text-xs sm:tracking-normal ${
                    index === CHANGED_INDEX ? 'kv-chip' : ''
                  }`}
                >
                  {index === CHANGED_INDEX ? (
                    <>
                      <span className="kv-old absolute truncate">{token}</span>
                      <span className="kv-new text-destructive absolute truncate">
                        {t.replacement}
                      </span>
                    </>
                  ) : (
                    <span className="truncate">{token}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-1 h-0.5">
              <div className="kv-bar bg-primary/60 h-full rounded-full" />
            </div>

            {Array.from({ length: LAYERS }, (_, layer) => (
              <div key={layer} className={`kv-layer-${layer} mt-1.5 grid grid-cols-8 gap-1`}>
                {t.tokens.map((_, index) => (
                  <div
                    key={index}
                    className={`kv-cell kv-cell-${index} h-5 rounded-[3px] border`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="flex items-center gap-2">
            <span className="bg-primary/60 inline-block h-0.5 w-4 rounded-full" />
            {t.lookBack}
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-primary inline-block h-3 w-3 rounded-[2px]" />
            {t.computed}
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-foreground/10 inline-block h-3 w-3 rounded-[2px]" />
            {t.read}
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-destructive inline-block h-3 w-3 rounded-[2px]" />
            {t.invalid}
          </span>
        </div>
        <p className="kv-total text-foreground mt-4 border-t pt-4">{t.total}</p>
      </div>
      <figcaption className="text-muted-foreground mt-2 text-center text-sm">
        {t.caption}
      </figcaption>
    </figure>
  );
}
