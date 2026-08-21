import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { decodePolyline, polylineToSvgPath } from '@/lib/polyline';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Icon } from '../shared/Icon';
import {
  DashboardSpeed01Icon,
  MountainIcon,
  HeartCheckIcon,
  Clock05Icon,
  Calendar01Icon,
} from '@hugeicons/core-free-icons';

interface LongRunActivityCardProps {
  activity: RunningActivity;
  lang?: Lang;
}

export function LongRunActivityCard({ activity, lang = 'fr' }: LongRunActivityCardProps) {
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
        @keyframes longrunDraw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        /* Paired with pathLength="1", so the draw lasts the full duration whatever the route's length. */
        .longrun-path {
          stroke-dasharray: 1;
          animation: longrunDraw 2.2s ease-out forwards;
        }
      `}</style>

      <a
        href={activity.stravaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      >
        <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm transition-all hover:border-emerald-500/70 hover:shadow-md dark:from-emerald-950/40 dark:to-teal-950/30">
          <div className="mb-1 flex items-center justify-between">
            <p className="flex items-center gap-1 text-xs tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
              <Icon icon={Calendar01Icon} size={14} strokeWidth={2} />
              {formattedDate}
            </p>
            <span className="inline-flex items-center rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-semibold tracking-widest text-white uppercase dark:bg-emerald-500 dark:text-emerald-950">
              {t.strava.tagLongRun}
            </span>
          </div>

          <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-emerald-950 dark:text-emerald-100">
            {activity.name}
          </h3>

          <div className="my-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 text-emerald-700 dark:text-emerald-300">
              <span
                className="text-3xl font-black tracking-tight"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {activity.distanceKm.toFixed(1)}
              </span>
              <span className="text-sm font-semibold">km</span>
            </div>
            {routePath && (
              <div className="h-10 w-14 shrink-0">
                <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
                  <path
                    d={routePath}
                    pathLength={1}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-emerald-600 dark:text-emerald-400 ${reducedMotion ? '' : 'longrun-path'}`}
                  />
                </svg>
              </div>
            )}
          </div>

          <div
            className={`mt-auto grid gap-2 border-t border-emerald-600/20 pt-2 dark:border-emerald-400/20 ${activity.averageHeartRate ? 'grid-cols-4' : 'grid-cols-3'}`}
          >
            <div className="text-center">
              <div className="mb-1 flex justify-center text-emerald-600 dark:text-emerald-500">
                <Icon icon={DashboardSpeed01Icon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {activity.paceMinPerKm}
              </p>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-500">{t.strava.pace}</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex justify-center text-emerald-600 dark:text-emerald-500">
                <Icon icon={MountainIcon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {activity.elevationGain}
              </p>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-500">m</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex justify-center text-emerald-600 dark:text-emerald-500">
                <Icon icon={Clock05Icon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {activity.durationMinutes}
              </p>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-500">min</p>
            </div>
            {activity.averageHeartRate && (
              <div className="text-center">
                <div className="mb-1 flex justify-center text-emerald-600 dark:text-emerald-500">
                  <Icon icon={HeartCheckIcon} size={13} strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  {activity.averageHeartRate}
                </p>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-500">
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
