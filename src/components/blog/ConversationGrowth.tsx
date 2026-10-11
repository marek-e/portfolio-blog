import type { ReactNode } from 'react';
import './conversation-growth.css';

type Lang = 'en' | 'fr';

const STRINGS = {
  en: {
    request: 'Request',
    prefixLong: 'tools + system + CLAUDE.md',
    prefixShort: 'system',
    resent: 'sent again and processed again',
    fresh: 'new in this request',
    total: (requests: number, processed: number, conversation: number) =>
      `${requests} requests, ${processed}k tokens processed for ${conversation}k tokens of conversation`,
    caption: 'Each request carries the full history, not just the new message',
    aria: 'Four requests drawn as growing bars. Each one repeats everything the previous request sent, then adds one new turn.',
  },
  fr: {
    request: 'Requête',
    prefixLong: 'outils + système + CLAUDE.md',
    prefixShort: 'système',
    resent: 'renvoyé et retraité',
    fresh: 'nouveau dans cette requête',
    total: (requests: number, processed: number, conversation: number) =>
      `${requests} requêtes, ${processed}k tokens traités pour ${conversation}k tokens de conversation`,
    caption: "Chaque requête transporte tout l'historique, pas seulement le nouveau message",
    aria: 'Quatre requêtes dessinées comme des barres qui grandissent. Chacune répète tout ce que la précédente a envoyé, puis ajoute un nouveau tour.',
  },
} satisfies Record<Lang, unknown>;

const PREFIX_TOKENS = 24;
const TURN_TOKENS = 6;
const REQUESTS = 4;
const rowTotal = (index: number) => PREFIX_TOKENS + TURN_TOKENS * (index + 1);
const fullTotal = rowTotal(REQUESTS - 1);
const processedTotal = Array.from({ length: REQUESTS }, (_, i) => rowTotal(i)).reduce(
  (sum, value) => sum + value,
  0
);

function Segment({
  share,
  fresh,
  className = '',
  children,
}: {
  share: number;
  fresh: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mr-[2px] flex h-7 min-w-0 shrink-0 items-center justify-center overflow-hidden rounded-[3px] px-1 whitespace-nowrap ${
        fresh ? 'bg-primary text-primary-foreground' : 'bg-foreground/10 text-muted-foreground'
      } ${className}`}
      style={{ width: `calc(${share * 100}% - 2px)` }}
    >
      <span>{children}</span>
    </div>
  );
}

export function ConversationGrowth({ lang = 'en' }: { lang?: Lang }) {
  const t = STRINGS[lang];

  return (
    <figure className="not-prose my-8">
      <div
        role="img"
        aria-label={t.aria}
        className="bg-card text-card-foreground rounded-xl border p-4 font-mono text-[11px] sm:p-6 sm:text-xs"
      >
        <div className="flex flex-col gap-3">
          {Array.from({ length: REQUESTS }, (_, k) => {
            const total = rowTotal(k);
            const isFirst = k === 0;
            const previous = total - TURN_TOKENS;
            return (
              <div key={k} className={`cg-row-${k} flex items-center gap-2 sm:gap-3`}>
                <span className="text-muted-foreground w-6 shrink-0 sm:w-20">
                  <span className="hidden sm:inline">{t.request} </span>
                  {k + 1}
                </span>
                <div className="flex min-w-0 flex-1">
                  <div
                    className={`flex shrink-0 ${isFirst ? '' : `cg-drop-${k}`}`}
                    style={{ width: `${(previous / fullTotal) * 100}%` }}
                  >
                    <Segment share={PREFIX_TOKENS / previous} fresh={isFirst}>
                      <span className="hidden sm:inline">{t.prefixLong}</span>
                      <span className="sm:hidden">{t.prefixShort}</span>
                    </Segment>
                    {Array.from({ length: k }, (_, turn) => (
                      <Segment key={turn} share={TURN_TOKENS / previous} fresh={false}>
                        <span className="hidden sm:inline">turn </span>
                        {turn + 1}
                      </Segment>
                    ))}
                  </div>
                  <Segment
                    share={TURN_TOKENS / fullTotal}
                    fresh
                    className={isFirst ? '' : `cg-grow-${k}`}
                  >
                    <span className="hidden sm:inline">turn </span>
                    {k + 1}
                  </Segment>
                </div>
                <span className="w-9 shrink-0 text-right tabular-nums sm:w-12">{total}k</span>
              </div>
            );
          })}
        </div>
        <div className="text-muted-foreground mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="flex items-center gap-2">
            <span className="bg-foreground/10 inline-block h-3 w-3 rounded-[2px]" />
            {t.resent}
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-primary inline-block h-3 w-3 rounded-[2px]" />
            {t.fresh}
          </span>
        </div>
        <p className="cg-total text-foreground mt-4 border-t pt-4">
          {t.total(REQUESTS, processedTotal, fullTotal)}
        </p>
      </div>
      <figcaption className="text-muted-foreground mt-2 text-center text-sm">
        {t.caption}
      </figcaption>
    </figure>
  );
}
