import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/utils';
import {
  WorkoutRunIcon,
  MountainIcon,
  HeartCheckIcon,
  Clock05Icon,
} from '@hugeicons/core-free-icons';
import {
  ActivityCardLink,
  ActivityHeader,
  ActivityStats,
  HeroMetric,
  RouteSketch,
  formatActivityDate,
  toneClasses,
  type ActivityStat,
} from './ActivityCardParts';

interface IntervalsActivityCardProps {
  activity: RunningActivity;
  lang?: Lang;
}

// Uniform on purpose: varying the heights would read as lap data, which this isn't.
const TICKS = Array.from({ length: 28 }, (_, i) => ({ delay: i * 0.05 }));

export function IntervalsActivityCard({ activity, lang = 'fr' }: IntervalsActivityCardProps) {
  const t = getTranslations(lang);
  const reducedMotion = useReducedMotion();
  const { dot } = toneClasses('lilac');

  const stats: ActivityStat[] = [
    { icon: WorkoutRunIcon, value: activity.distanceKm.toFixed(1), unit: 'km' },
    { icon: MountainIcon, value: activity.elevationGain, unit: 'm' },
    { icon: Clock05Icon, value: activity.durationMinutes, unit: 'min' },
    ...(activity.averageHeartRate
      ? [{ icon: HeartCheckIcon, value: activity.averageHeartRate, unit: t.strava.heartRate }]
      : []),
  ];

  return (
    <>
      <style>{`
        @keyframes intervalsPulse {
          0%, 100% { transform: scaleY(0.4); opacity: 0.45; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .intervals-tick {
          transform-origin: center;
          animation: intervalsPulse 1.8s ease-in-out infinite;
        }
      `}</style>

      <ActivityCardLink href={activity.stravaUrl}>
        <ActivityHeader
          date={formatActivityDate(activity.date, lang)}
          name={activity.name}
          tag={t.strava.tagIntervals}
          tone="lilac"
        />

        <div className="my-5 flex items-center justify-between gap-3">
          <HeroMetric value={activity.paceMinPerKm} unit={t.strava.pace} />
          <RouteSketch polyline={activity.routePolyline} tone="lilac" />
        </div>

        <div className="mb-5 flex h-4 items-center gap-[3px]" aria-hidden="true">
          {TICKS.map((tick, i) => (
            <span
              key={i}
              className={cn('h-3 flex-1 rounded-full', dot, !reducedMotion && 'intervals-tick')}
              style={{ animationDelay: `${tick.delay}s` }}
            />
          ))}
        </div>

        <ActivityStats stats={stats} />
      </ActivityCardLink>
    </>
  );
}
