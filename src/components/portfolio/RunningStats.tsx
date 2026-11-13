import { useState } from 'react';
import type { RunningStats as RunningStatsType } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

interface RunningStatsProps {
  stats: RunningStatsType;
  lang?: Lang;
}

type StatsMode = 'allTime' | 'thisYear';

export function RunningStats({ stats, lang = 'fr' }: RunningStatsProps) {
  const [mode, setMode] = useState<StatsMode>('allTime');
  const t = getTranslations(lang);

  const statItems =
    mode === 'allTime'
      ? [
          {
            value: stats.allTimeDistanceKm,
            label: t.strava.totalDistance,
            suffix: ' km',
            highlight: true,
          },
          {
            value: stats.allTimeRuns,
            label: t.strava.runs,
            suffix: '',
            highlight: false,
          },
        ]
      : [
          {
            value: stats.yearDistanceKm,
            label: t.strava.totalDistance,
            suffix: ' km',
            highlight: true,
          },
          {
            value: stats.yearRuns,
            label: t.strava.runs,
            suffix: '',
            highlight: false,
          },
        ];

  const toggleClass = (isActive: boolean) =>
    cn(
      'min-h-11 rounded-full px-4 text-sm font-medium transition-colors focus-visible:transition-none motion-reduce:transition-none',
      isActive
        ? 'bg-foreground text-background shadow-sm'
        : 'text-muted-foreground hover:text-foreground cursor-pointer'
    );

  return (
    <div className="space-y-5">
      <div className="flex justify-start">
        <div className="glass inline-flex gap-1 rounded-full p-1">
          <button
            onClick={() => setMode('allTime')}
            className={toggleClass(mode === 'allTime')}
            aria-pressed={mode === 'allTime'}
          >
            {t.strava.allTime}
          </button>
          <button
            onClick={() => setMode('thisYear')}
            className={toggleClass(mode === 'thisYear')}
            aria-pressed={mode === 'thisYear'}
          >
            {t.strava.thisYear}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 md:gap-5">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="glass relative overflow-hidden rounded-3xl p-4 sm:p-5 md:p-8"
          >
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute -right-10 -bottom-12 size-40 rounded-full blur-2xl md:size-56',
                item.highlight
                  ? 'bg-pastel-lilac/50 dark:bg-pastel-lilac/15'
                  : 'bg-pastel-mint/55 dark:bg-pastel-mint/12'
              )}
            />
            <p className="eyebrow relative">{item.label}</p>
            <p className="text-foreground relative mt-3 font-mono text-[clamp(1.6rem,7.5vw,2.25rem)] font-medium tracking-tight tabular-nums md:mt-4 md:text-6xl">
              {Math.round(item.value).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}
              {item.suffix && (
                <span className="text-muted-foreground ml-1 text-sm font-normal tracking-normal md:ml-1.5 md:text-2xl">
                  {item.suffix.trim()}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
