type Lang = 'en' | 'fr';
type Badge = 'write' | 'hit' | 'miss';

const STRINGS = {
  en: {
    badges: { write: 'WRITE', hit: 'HIT', miss: 'MISS' },
    lanes: ['5 min TTL', '1 h TTL'],
    columns: [
      ['12:00', 'message'],
      ['12:03', 'message'],
      ['12:04 → 12:50', 'lunch break'],
      ['12:50', 'back'],
    ],
    cold: 'cold from 12:08',
    warm: 'warm until 13:03',
    summary5: 'With 5 minutes, the whole conversation is processed and written again at 12:50',
    summary1: 'With 1 hour, 12:50 is a cheap read and the entry lives until 13:50',
    caption: 'The same lunch break with a 5 minute and a 1 hour TTL',
    aria: 'Messages at 12:00 and 12:03, lunch break from 12:04 to 12:50. With a 5 minute TTL the entry is cold from 12:08 and the message at 12:50 is a miss. With a 1 hour TTL the entry is still warm and the message at 12:50 is a hit.',
  },
  fr: {
    badges: { write: 'ÉCRITURE', hit: 'SUCCÈS', miss: 'RATÉ' },
    lanes: ['TTL 5 min', 'TTL 1 h'],
    columns: [
      ['12:00', 'message'],
      ['12:03', 'message'],
      ['12:04 → 12:50', 'pause déjeuner'],
      ['12:50', 'retour'],
    ],
    cold: 'froid dès 12:08',
    warm: "chaud jusqu'à 13:03",
    summary5: 'Avec 5 minutes, toute la conversation est retraitée et réécrite à 12:50',
    summary1: "Avec 1 heure, 12:50 est une lecture peu chère et l'entrée vit jusqu'à 13:50",
    caption: "La même pause déjeuner avec un TTL de 5 minutes et d'1 heure",
    aria: "Messages à 12:00 et 12:03, pause déjeuner de 12:04 à 12:50. Avec un TTL de 5 minutes, l'entrée est froide dès 12:08 et le message de 12:50 est un raté. Avec un TTL d'1 heure, l'entrée est encore chaude et le message de 12:50 est un succès.",
  },
} satisfies Record<Lang, unknown>;

const BADGE_STYLES: Record<Badge, string> = {
  write: 'bg-primary text-primary-foreground',
  hit: 'bg-green-600 text-white dark:bg-green-500 dark:text-green-950',
  miss: 'bg-red-600 text-white dark:bg-red-500 dark:text-red-950',
};

const LANES: { badges: [Badge, Badge, Badge]; expires: boolean }[] = [
  { badges: ['write', 'hit', 'miss'], expires: true },
  { badges: ['write', 'hit', 'hit'], expires: false },
];

const GRID =
  'grid grid-cols-[2.75rem_1fr_1fr_2fr_1fr] items-center gap-x-1.5 sm:grid-cols-[5rem_1fr_1fr_2fr_1fr] sm:gap-x-3';

function BadgeChip({ badge, label }: { badge: Badge; label: string }) {
  return (
    <span
      className={`inline-block rounded-[3px] px-1 py-0.5 font-bold tracking-wide sm:px-1.5 ${BADGE_STYLES[badge]}`}
    >
      {label}
    </span>
  );
}

export function TtlTimeline({ lang = 'en' }: { lang?: Lang }) {
  const t = STRINGS[lang];

  return (
    <figure className="not-prose my-8">
      <div
        role="img"
        aria-label={t.aria}
        className="bg-card text-card-foreground rounded-xl border p-3 font-mono text-[9px] sm:p-6 sm:text-xs"
      >
        <div className={GRID}>
          <div />
          {t.columns.map(([time, label]) => (
            <div key={time} className="text-center leading-tight">
              <div className="text-foreground">{time}</div>
              <div className="text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {LANES.map((lane, index) => (
          <div key={index} className={`${GRID} mt-4 border-t pt-4`}>
            <div className="text-muted-foreground leading-tight">{t.lanes[index]}</div>
            <div className="text-center">
              <BadgeChip badge={lane.badges[0]} label={t.badges[lane.badges[0]]} />
            </div>
            <div className="text-center">
              <BadgeChip badge={lane.badges[1]} label={t.badges[lane.badges[1]]} />
            </div>
            {lane.expires ? (
              <div className="flex h-6 gap-[2px]">
                <div className="bg-foreground/15 w-[12%] shrink-0 rounded-[3px]" />
                <div className="flex flex-1 items-center justify-center rounded-[3px] border border-dashed border-red-500/70 text-red-600 dark:text-red-400">
                  {t.cold}
                </div>
              </div>
            ) : (
              <div className="bg-foreground/15 text-muted-foreground flex h-6 items-center justify-center rounded-[3px]">
                {t.warm}
              </div>
            )}
            <div className="text-center">
              <BadgeChip badge={lane.badges[2]} label={t.badges[lane.badges[2]]} />
            </div>
          </div>
        ))}

        <div className="mt-5 flex flex-col gap-2 border-t pt-4 sm:text-xs">
          <p className="flex items-start gap-2">
            <span className="shrink-0">
              <BadgeChip badge="miss" label={t.badges.miss} />
            </span>
            <span className="pt-0.5">{t.summary5}</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="shrink-0">
              <BadgeChip badge="hit" label={t.badges.hit} />
            </span>
            <span className="pt-0.5">{t.summary1}</span>
          </p>
        </div>
      </div>
      <figcaption className="text-muted-foreground mt-2 text-center text-sm">
        {t.caption}
      </figcaption>
    </figure>
  );
}
