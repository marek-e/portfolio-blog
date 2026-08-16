import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { decodePolyline, polylineToSvgPath } from '@/lib/polyline';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Icon } from '../shared/Icon';
import {
  WorkoutRunIcon,
  MountainIcon,
  HeartCheckIcon,
  Clock05Icon,
  Calendar01Icon,
} from '@hugeicons/core-free-icons';

interface IntervalsActivityCardProps {
  activity: RunningActivity;
  lang?: Lang;
}

// Uniform on purpose: varying the heights would read as lap data, which this isn't.
const TICKS = Array.from({ length: 28 }, (_, i) => ({ delay: i * 0.05 }));

export function IntervalsActivityCard({ activity, lang = 'fr' }: IntervalsActivityCardProps) {
  const t = getTranslations(lang);
  const reducedMotion = useReducedMotion();

  const routePath = activity.routePolyline
    ? polylineToSvgPath(decodePolyline(activity.routePolyline), 120, 80)
    : null;

  const formattedDate = activity.date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <>
      <style>{`
        @keyframes intervalsPulse {
          0%, 100% { transform: scaleY(0.4); opacity: 0.35; }
          50% { transform: scaleY(1); opacity: 0.9; }
        }
        .intervals-tick {
          transform-origin: center;
          animation: intervalsPulse 1.8s ease-in-out infinite;
        }
      `}</style>

      <a
        href={activity.stravaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      >
        <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-violet-500/40 bg-violet-50 p-4 shadow-sm transition-all hover:border-violet-500/70 hover:shadow-md dark:bg-violet-950/40">
          <div className="mb-1 flex items-center justify-between">
            <p className="flex items-center gap-1 text-xs tracking-wide text-violet-700 uppercase dark:text-violet-400">
              <Icon icon={Calendar01Icon} size={14} strokeWidth={2} />
              {formattedDate}
            </p>
            <span className="inline-flex items-center rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-semibold tracking-widest text-white uppercase dark:bg-violet-500 dark:text-violet-950">
              {t.strava.tagIntervals}
            </span>
          </div>

          <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-violet-950 dark:text-violet-100">
            {activity.name}
          </h3>

          <div className="my-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 text-violet-700 dark:text-violet-300">
              <span
                className="text-3xl font-black tracking-tight"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {activity.paceMinPerKm}
              </span>
              <span className="text-sm font-semibold">{t.strava.pace}</span>
            </div>
            {routePath && (
              <div className="h-10 w-14 shrink-0">
                <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
                  <path
                    d={routePath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-violet-600 dark:text-violet-400"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="mb-3 flex h-4 items-center gap-[3px]" aria-hidden="true">
            {TICKS.map((tick, i) => (
              <span
                key={i}
                className={`h-3 flex-1 rounded-full bg-violet-500/60 dark:bg-violet-400/60 ${
                  reducedMotion ? '' : 'intervals-tick'
                }`}
                style={{ animationDelay: `${tick.delay}s` }}
              />
            ))}
          </div>

          <div
            className={`mt-auto grid gap-2 border-t border-violet-600/20 pt-2 dark:border-violet-400/20 ${activity.averageHeartRate ? 'grid-cols-4' : 'grid-cols-3'}`}
          >
            <div className="text-center">
              <div className="mb-1 flex justify-center text-violet-600 dark:text-violet-500">
                <Icon icon={WorkoutRunIcon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-violet-900 dark:text-violet-200">
                {activity.distanceKm.toFixed(1)}
              </p>
              <p className="text-xs text-violet-700/70 dark:text-violet-500">km</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex justify-center text-violet-600 dark:text-violet-500">
                <Icon icon={MountainIcon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-violet-900 dark:text-violet-200">
                {activity.elevationGain}
              </p>
              <p className="text-xs text-violet-700/70 dark:text-violet-500">m</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex justify-center text-violet-600 dark:text-violet-500">
                <Icon icon={Clock05Icon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-violet-900 dark:text-violet-200">
                {activity.durationMinutes}
              </p>
              <p className="text-xs text-violet-700/70 dark:text-violet-500">min</p>
            </div>
            {activity.averageHeartRate && (
              <div className="text-center">
                <div className="mb-1 flex justify-center text-violet-600 dark:text-violet-500">
                  <Icon icon={HeartCheckIcon} size={13} strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-violet-900 dark:text-violet-200">
                  {activity.averageHeartRate}
                </p>
                <p className="text-xs text-violet-700/70 dark:text-violet-500">
                  {t.strava.heartRate}
                </p>
              </div>
            )}
          </div>
        </div>
      </a>
    </>
  );
}
