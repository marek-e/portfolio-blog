import { Briefcase01Icon, Mortarboard01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card3D } from '@/components/ui/card-3d';
import { formatDateRange, type TimelineEntry } from '@/types/timeline';
import type { Lang } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface TimelineCardsProps {
  entries: TimelineEntry[];
  presentLabel: string;
  lang: Lang;
}

const ACCENTS = [
  {
    color: 'var(--pastel-peach)',
    className: 'bg-pastel-peach/60 dark:bg-pastel-peach/12 dark:text-pastel-peach',
  },
  {
    color: 'var(--pastel-sky)',
    className: 'bg-pastel-sky/60 dark:bg-pastel-sky/12 dark:text-pastel-sky',
  },
  {
    color: 'var(--pastel-mint)',
    className: 'bg-pastel-mint/60 dark:bg-pastel-mint/12 dark:text-pastel-mint',
  },
  {
    color: 'var(--pastel-lilac)',
    className: 'bg-pastel-lilac/60 dark:bg-pastel-lilac/12 dark:text-pastel-lilac',
  },
  {
    color: 'var(--pastel-butter)',
    className: 'bg-pastel-butter/70 dark:bg-pastel-butter/12 dark:text-pastel-butter',
  },
];

const LINE_PATH = 'M48 0C0 80 0 170 48 250S96 420 48 500S0 670 48 750S96 920 48 1000';

function TimelineLine({ count }: { count: number }) {
  return (
    <div
      aria-hidden="true"
      data-timeline-line=""
      className="pointer-events-none absolute inset-y-2 left-6 w-12 -translate-x-1/2 [mask-image:linear-gradient(to_bottom,black_85%,transparent)] md:left-1/2 md:w-24"
    >
      <svg
        viewBox="0 0 96 1000"
        preserveAspectRatio="none"
        fill="none"
        className="text-foreground/15 absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          data-timeline-path=""
          d={LINE_PATH}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="1 6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        viewBox="0 0 96 1000"
        preserveAspectRatio="none"
        fill="none"
        className="timeline-progress absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="timeline-ink" x1="0" y1="0" x2="0" y2="1">
            {Array.from({ length: count }, (_, index) => (
              <stop
                key={index}
                offset={`${((index + 0.5) / count) * 100}%`}
                style={{ stopColor: ACCENTS[index % ACCENTS.length].color }}
              />
            ))}
          </linearGradient>
        </defs>
        <path
          data-timeline-path=""
          d={LINE_PATH}
          stroke="url(#timeline-ink)"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function OrganizationLogo({ entry }: { entry: TimelineEntry }) {
  if (!entry.logo) return null;

  const image = (
    <img
      src={entry.logo}
      alt={`${entry.organization} logo`}
      className={cn(
        'h-6 w-auto max-w-24 object-contain md:max-w-28',
        entry.logoInverted && 'dark:invert'
      )}
      width={entry.logoWidth}
      height={32}
      loading="lazy"
    />
  );

  if (!entry.link) return <div className="shrink-0">{image}</div>;

  return (
    <a
      href={entry.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${entry.organization} website`}
      className="-m-2 flex min-h-11 shrink-0 items-center rounded-xl p-2 transition-opacity hover:opacity-70"
    >
      {image}
    </a>
  );
}

function TimelineCard({
  entry,
  accent,
  lang,
  presentLabel,
}: {
  entry: TimelineEntry;
  accent: string;
  lang: Lang;
  presentLabel: string;
}) {
  const icon = entry.type === 'education' ? Mortarboard01Icon : Briefcase01Icon;
  const isCurrentRole = entry.type === 'work' && entry.endDate === null;

  return (
    <Card3D
      as="article"
      variant={isCurrentRole ? 'default' : 'glass'}
      className="gap-0 p-5 sm:p-6 md:p-7"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-foreground/75 hidden size-10 shrink-0 items-center justify-center rounded-2xl sm:flex',
              accent
            )}
          >
            <HugeiconsIcon icon={icon} className="size-4.5" strokeWidth={1.8} />
          </span>
          <time
            className="text-muted-foreground font-mono text-xs whitespace-nowrap"
            dateTime={entry.startDate}
          >
            {formatDateRange(entry.startDate, entry.endDate, lang, presentLabel)}
          </time>
        </div>
        <OrganizationLogo entry={entry} />
      </div>
      <header className="mb-3">
        <h3 className="font-display-soft text-foreground text-xl leading-snug font-semibold tracking-tight text-balance md:text-2xl">
          {entry.title}
        </h3>
        <p className="text-foreground/70 mt-1.5 text-sm font-medium">{entry.organization}</p>
      </header>
      <p className="text-muted-foreground text-sm leading-relaxed">{entry.description}</p>
      {entry.tags && entry.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {entry.tags.slice(0, 3).map((tag) => (
            <li
              key={tag}
              className={cn(
                'text-foreground/80 rounded-full px-2.5 py-0.5 font-mono text-xs',
                accent
              )}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </Card3D>
  );
}

export function TimelineCards({ entries, presentLabel, lang }: TimelineCardsProps) {
  return (
    <div className="timeline relative mx-auto w-full max-w-[76rem]">
      <TimelineLine count={entries.length} />
      <ol className="relative">
        {entries.map((entry, index) => {
          const isLeft = index % 2 === 0;
          const accent = ACCENTS[index % ACCENTS.length].className;

          return (
            <li
              key={entry.id}
              className="timeline-item relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-2 pb-16 last:pb-0 md:grid-cols-[1fr_6rem_1fr] md:gap-x-0 md:not-first:-mt-8"
            >
              <div className="col-start-1 row-start-1 flex items-start justify-center pt-7 md:col-start-2">
                <span
                  data-timeline-year=""
                  className="bg-card ring-foreground/5 relative z-10 rounded-full shadow-sm ring-1"
                >
                  <span
                    className={cn(
                      'text-foreground/85 block rounded-full px-2.5 py-1 font-mono text-xs font-medium',
                      accent
                    )}
                  >
                    {entry.startDate.slice(0, 4)}
                  </span>
                </span>
              </div>
              <div
                className={cn(
                  'timeline-card col-start-2 row-start-1 min-w-0',
                  isLeft ? 'md:col-start-1' : 'md:col-start-3'
                )}
              >
                <TimelineCard
                  entry={entry}
                  accent={accent}
                  lang={lang}
                  presentLabel={presentLabel}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
