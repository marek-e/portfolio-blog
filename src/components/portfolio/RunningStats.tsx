import { useEffect, useState, useRef } from 'react';
import type { RunningStats as RunningStatsType } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/utils';

interface RunningStatsProps {
  stats: RunningStatsType;
  lang?: Lang;
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
}

function AnimatedCounter({ value, duration = 1500, suffix = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const isReducedMotion = useReducedMotion();
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplayValue(value);
    }
  }, [isReducedMotion, value]);

  useEffect(() => {
    if (isReducedMotion || hasAnimated.current) return;

    const animateValue = () => {
      const startTime = performance.now();
      const startValue = 0;

      const easeOutExpo = (t: number): number => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      };

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);

        const current = Math.round(startValue + (value - startValue) * easedProgress);
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateValue();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isReducedMotion, value, duration]);

  return (
    <span ref={counterRef}>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
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
      'min-h-10 rounded-full px-4 text-sm font-medium transition-all',
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

      <div className="grid grid-cols-2 gap-3 md:gap-5">
        {statItems.map((item, index) => (
          <div
            key={`${mode}-${item.label}`}
            className="glass relative overflow-hidden rounded-3xl p-5 md:p-8"
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
            <p className="text-foreground relative mt-3 font-mono text-4xl font-medium tracking-tight tabular-nums md:mt-4 md:text-6xl">
              <AnimatedCounter value={item.value} duration={1000 + index * 200} />
              {item.suffix && (
                <span className="text-muted-foreground ml-1.5 text-base font-normal tracking-normal md:text-2xl">
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
