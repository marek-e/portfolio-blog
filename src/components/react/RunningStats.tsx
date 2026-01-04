import { useEffect, useState, useRef } from 'react';
import type { RunningStats as RunningStatsType } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { useReducedMotion } from '@/lib/useReducedMotion';

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

  return (
    <div className="space-y-4">
      {/* Toggle Switch */}
      <div className="flex justify-center">
        <div className="bg-muted inline-flex rounded-lg p-1">
          <button
            onClick={() => setMode('allTime')}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all ${
              mode === 'allTime'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-pressed={mode === 'allTime'}
          >
            {t.strava.allTime}
          </button>
          <button
            onClick={() => setMode('thisYear')}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all ${
              mode === 'thisYear'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-pressed={mode === 'thisYear'}
          >
            {t.strava.thisYear}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {statItems.map((item, index) => (
          <div
            key={`${mode}-${item.label}`}
            className={`rounded-xl p-4 text-center transition-colors ${
              item.highlight
                ? 'border-primary/20 bg-primary/10 border'
                : 'bg-muted/50 border-border border'
            }`}
          >
            <p
              className={`text-2xl font-bold md:text-3xl ${
                item.highlight ? 'text-primary' : 'text-foreground'
              }`}
            >
              <AnimatedCounter
                value={item.value}
                duration={1000 + index * 200}
                suffix={item.suffix}
              />
            </p>
            <p className="text-muted-foreground mt-1 text-xs md:text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
