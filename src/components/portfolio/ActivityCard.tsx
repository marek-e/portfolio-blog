import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import {
  DashboardSpeed01Icon,
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
  type ActivityStat,
} from './ActivityCardParts';

interface ActivityCardProps {
  activity: RunningActivity;
  lang?: Lang;
}

export function ActivityCard({ activity, lang = 'fr' }: ActivityCardProps) {
  const t = getTranslations(lang);

  const stats: ActivityStat[] = [
    { icon: DashboardSpeed01Icon, value: activity.paceMinPerKm, unit: t.strava.pace },
    { icon: MountainIcon, value: activity.elevationGain, unit: 'm' },
    { icon: Clock05Icon, value: activity.durationMinutes, unit: 'min' },
    ...(activity.averageHeartRate
      ? [{ icon: HeartCheckIcon, value: activity.averageHeartRate, unit: t.strava.heartRate }]
      : []),
  ];

  return (
    <ActivityCardLink href={activity.stravaUrl}>
      <ActivityHeader
        date={formatActivityDate(activity.date, lang)}
        name={activity.name}
        tone="peach"
      />

      <div className="my-5 flex items-center justify-between gap-3">
        <HeroMetric value={activity.distanceKm.toFixed(1)} unit="km" />
        <RouteSketch polyline={activity.routePolyline} tone="peach" />
      </div>

      <ActivityStats stats={stats} />
    </ActivityCardLink>
  );
}
