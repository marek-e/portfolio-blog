import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { decodePolyline, polylineToSvgPath } from '@/lib/polyline';
import { Icon } from '../shared/Icon';
import {
  WorkoutRunIcon,
  DashboardSpeed01Icon,
  MountainIcon,
  HeartCheckIcon,
  Clock05Icon,
  Calendar01Icon,
} from '@hugeicons/core-free-icons';

interface ActivityCardProps {
  activity: RunningActivity;
  lang?: Lang;
}

export function ActivityCard({ activity, lang = 'fr' }: ActivityCardProps) {
  const t = getTranslations(lang);

  // Decode route polyline
  const routePath = activity.routePolyline
    ? polylineToSvgPath(decodePolyline(activity.routePolyline), 120, 80)
    : null;

  // Format date
  const formattedDate = activity.date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <a
      href={activity.stravaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-visible:ring-ring block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <div className="bg-card border-border hover:border-primary/50 hover:bg-card/50 group flex h-full flex-col rounded-xl border p-4 shadow-sm transition-all hover:shadow-md">
        {/* Header: Date and Route Preview */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Icon icon={Calendar01Icon} size={14} strokeWidth={2} />
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                {formattedDate}
              </p>
            </div>
            <h3 className="text-foreground mt-0.5 line-clamp-1 text-sm font-semibold">
              {activity.name}
            </h3>
          </div>

          {/* Route Preview */}
          {routePath && (
            <div className="ml-2 h-12 w-16 shrink-0">
              <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
                <path
                  d={routePath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div
          className={`my-auto grid gap-2 ${activity.averageHeartRate ? 'grid-cols-4' : 'grid-cols-3'}`}
        >
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex justify-center">
              <Icon icon={WorkoutRunIcon} size={14} strokeWidth={2} />
            </div>
            <p className="text-foreground text-base font-bold">{activity.distanceKm.toFixed(1)}</p>
            <p className="text-muted-foreground text-xs">km</p>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex justify-center">
              <Icon icon={DashboardSpeed01Icon} size={14} strokeWidth={2} />
            </div>
            <p className="text-foreground text-base font-bold">{activity.paceMinPerKm}</p>
            <p className="text-muted-foreground text-xs">{t.strava.pace}</p>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex justify-center">
              <Icon icon={MountainIcon} size={14} strokeWidth={2} />
            </div>
            <p className="text-foreground text-base font-bold">{activity.elevationGain}</p>
            <p className="text-muted-foreground text-xs">m</p>
          </div>
          {activity.averageHeartRate && (
            <div className="text-center">
              <div className="text-muted-foreground mb-1 flex justify-center">
                <Icon icon={HeartCheckIcon} size={14} strokeWidth={2} />
              </div>
              <p className="text-foreground text-base font-bold">{activity.averageHeartRate}</p>
              <p className="text-muted-foreground text-xs">{t.strava.heartRate}</p>
            </div>
          )}
        </div>

        {/* Footer: Duration */}
        <div className="border-border/50 mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Icon icon={Clock05Icon} size={14} strokeWidth={2} />
            {activity.durationMinutes} min
          </span>
          <span className="text-primary text-xs opacity-0 transition-opacity group-hover:opacity-100">
            {t.strava.viewOnStrava} →
          </span>
        </div>
      </div>
    </a>
  );
}
