import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { Icon } from './Icon';
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

/**
 * Decode Google Polyline encoding to array of [lat, lng] coordinates
 */
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

/**
 * Convert coordinates to SVG path
 */
function polylineToSvgPath(
  points: [number, number][],
  width: number,
  height: number,
  padding: number = 8
): string {
  if (points.length === 0) return '';

  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  const scale = Math.min((width - padding * 2) / lngRange, (height - padding * 2) / latRange);

  const offsetX = (width - lngRange * scale) / 2;
  const offsetY = (height - latRange * scale) / 2;

  const svgPoints = points.map(([lat, lng]) => {
    const x = (lng - minLng) * scale + offsetX;
    const y = (maxLat - lat) * scale + offsetY;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return `M${svgPoints.join('L')}`;
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
      className="focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <div className="bg-card border-border hover:border-primary/50 hover:bg-card/50 group rounded-xl border p-4 shadow-sm transition-all hover:shadow-md">
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
        <div className={`grid gap-2 ${activity.averageHeartRate ? 'grid-cols-4' : 'grid-cols-3'}`}>
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
