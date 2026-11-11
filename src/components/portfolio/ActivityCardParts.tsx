import { useEffect, useId, useState, type ReactNode } from 'react';
import type { HugeiconsIconProps } from '@hugeicons/react';
import { Calendar03Icon, Heart } from '@hugeicons/core-free-icons';
import type { Lang } from '@/i18n/config';
import { decodePolyline, polylineToSvgPath } from '@/lib/polyline';
import { cn } from '@/lib/utils';
import { getTranslations } from '@/i18n';
import { Icon } from '../shared/Icon';

export type ActivityTone = 'peach' | 'sky' | 'lilac' | 'mint' | 'butter';

const TONES: Record<ActivityTone, { chip: string; tile: string; marker: string; dot: string }> = {
  peach: {
    chip: 'bg-pastel-peach/55 dark:bg-pastel-peach/12 dark:text-pastel-peach',
    tile: 'bg-pastel-peach/15 dark:bg-pastel-peach/6',
    marker: 'text-pastel-peach',
    dot: 'bg-pastel-peach',
  },
  sky: {
    chip: 'bg-pastel-sky/55 dark:bg-pastel-sky/12 dark:text-pastel-sky',
    tile: 'bg-pastel-sky/15 dark:bg-pastel-sky/6',
    marker: 'text-pastel-sky',
    dot: 'bg-pastel-sky',
  },
  lilac: {
    chip: 'bg-pastel-lilac/55 dark:bg-pastel-lilac/12 dark:text-pastel-lilac',
    tile: 'bg-pastel-lilac/15 dark:bg-pastel-lilac/6',
    marker: 'text-pastel-lilac',
    dot: 'bg-pastel-lilac',
  },
  mint: {
    chip: 'bg-pastel-mint/60 dark:bg-pastel-mint/12 dark:text-pastel-mint',
    tile: 'bg-pastel-mint/20 dark:bg-pastel-mint/6',
    marker: 'text-pastel-mint',
    dot: 'bg-pastel-mint',
  },
  butter: {
    chip: 'bg-pastel-butter/70 dark:bg-pastel-butter/12 dark:text-pastel-butter',
    tile: 'bg-pastel-butter/25 dark:bg-pastel-butter/6',
    marker: 'text-pastel-butter',
    dot: 'bg-pastel-butter',
  },
};

export function toneClasses(tone: ActivityTone) {
  return TONES[tone];
}

export function formatActivityDate(
  date: Date,
  lang: Lang,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
) {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', options);
}

export function formatActivityDistance(distance: number, lang: Lang) {
  return distance.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatFinishTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ActivityCardLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group glass relative flex h-full flex-col overflow-hidden rounded-3xl p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_var(--glass-highlight),0_0_0_1px_var(--glass-edge),0_1px_2px_oklch(0_0_0/4%),0_28px_60px_-28px_var(--glass-shadow)]',
        className
      )}
    >
      {children}
    </a>
  );
}

export function ActivityHeader({
  date,
  name,
  tag,
  tone,
  lang,
}: {
  date: string;
  name: string;
  tag?: ReactNode;
  tone: ActivityTone;
  lang: Lang;
}) {
  const names = getTranslations(lang).strava.activityNames;
  const localizedNames: Record<string, string> = {
    'Course à pied le matin': names.morning,
    'Course à pied l’après-midi': names.afternoon,
    "Course à pied l'après-midi": names.afternoon,
    'Course à pied en soirée': names.evening,
    'Course à pied de nuit': names.night,
    'Course à pied le midi': names.lunch,
  };

  return (
    <div className="relative">
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="eyebrow flex items-center gap-1.5">
          <Icon icon={Calendar03Icon} size={12} strokeWidth={2} aria-hidden="true" />
          {date}
        </p>
        {tag && (
          <span
            className={cn(
              'text-foreground/80 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[0.7rem] tracking-wide uppercase',
              TONES[tone].chip
            )}
          >
            {tag}
          </span>
        )}
      </div>
      <h3 className="font-display-soft text-foreground mt-1.5 text-lg font-semibold tracking-tight">
        {localizedNames[name] ?? name}
      </h3>
    </div>
  );
}

export function HeroMetric({
  value,
  unit,
  leading,
}: {
  value: string;
  unit: string;
  leading?: ReactNode;
}) {
  return (
    <p className="text-foreground flex items-center gap-2.5 font-mono text-3xl font-medium tracking-tight tabular-nums">
      {leading}
      <span>
        {value}
        <span className="text-muted-foreground ml-1.5 text-sm font-normal tracking-normal">
          {unit}
        </span>
      </span>
    </p>
  );
}

export function RouteSketch({
  polyline,
  tone,
  className,
}: {
  polyline?: string | null;
  tone: ActivityTone;
  className?: string;
}) {
  const filterId = `route-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!polyline) return null;
  const path = polylineToSvgPath(decodePolyline(polyline), 120, 80, 10);

  return (
    <div
      className={cn(
        'border-foreground/6 flex h-16 w-24 shrink-0 items-center justify-center rounded-2xl border',
        TONES[tone].tile,
        className
      )}
    >
      <svg
        viewBox="0 0 120 80"
        className="route-sketch h-full w-full overflow-visible"
        data-drawn={isDrawn || undefined}
        aria-hidden="true"
      >
        <style>{ROUTE_SKETCH_STYLES}</style>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="1" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
        <path
          d={path}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          transform="translate(1.5 2)"
          strokeLinejoin="round"
          className={cn('route-sketch-stroke dark:opacity-75', TONES[tone].marker)}
        />
        <path
          d={path}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${filterId})`}
          className="route-sketch-stroke text-foreground/80"
        />
      </svg>
    </div>
  );
}

export interface ActivityStat {
  icon: HugeiconsIconProps['icon'];
  value: ReactNode;
  unit: string;
}

const ROUTE_SKETCH_STYLES = `
  .route-sketch .route-sketch-stroke {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
  }
  .route-sketch[data-drawn] .route-sketch-stroke {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 2s cubic-bezier(0.65, 0, 0.35, 1);
  }
  .route-sketch[data-drawn] .route-sketch-stroke + .route-sketch-stroke {
    transition-delay: 0.25s;
  }
  @media (prefers-reduced-motion: reduce) {
    .route-sketch .route-sketch-stroke {
      stroke-dashoffset: 0;
      transition: none;
    }
  }
`;

const STAT_COLUMNS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export function ActivityStats({ stats }: { stats: ActivityStat[] }) {
  return (
    <dl
      className={cn(
        'border-foreground/8 relative mt-auto grid gap-2 border-t pt-4',
        STAT_COLUMNS[stats.length]
      )}
    >
      {stats.map((stat) => (
        <div key={stat.unit} className="flex flex-col-reverse items-center gap-1 text-center">
          <dt className="text-muted-foreground flex items-center gap-1 font-sans text-xs">
            <Icon
              icon={stat.icon}
              size={12}
              strokeWidth={2}
              className={cn(stat.icon === Heart && 'fill-current text-(--ring-rose)')}
            />
            {stat.unit}
          </dt>
          <dd className="text-foreground font-mono text-base font-medium tabular-nums">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
