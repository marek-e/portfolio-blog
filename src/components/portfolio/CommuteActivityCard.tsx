import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { WorkoutRunIcon, DashboardSpeed01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import {
  ActivityCardLink,
  ActivityHeader,
  ActivityStats,
  HeroMetric,
  formatActivityDate,
  formatFinishTime,
  toneClasses,
  type ActivityStat,
} from './ActivityCardParts';

interface CommuteActivityCardProps {
  activity: RunningActivity;
  lang?: Lang;
}

export function CommuteActivityCard({ activity, lang = 'fr' }: CommuteActivityCardProps) {
  const t = getTranslations(lang);
  const { dot } = toneClasses('sky');

  const stats: ActivityStat[] = [
    { icon: WorkoutRunIcon, value: activity.distanceKm.toFixed(1), unit: 'km' },
    { icon: DashboardSpeed01Icon, value: activity.paceMinPerKm, unit: t.strava.pace },
  ];

  return (
    <ActivityCardLink href={activity.stravaUrl}>
      <ActivityHeader
        date={formatActivityDate(activity.date, lang)}
        name={activity.name}
        tag={t.strava.tagCommute}
        tone="sky"
      />

      <div className="my-5">
        <HeroMetric
          value={formatFinishTime(activity.durationSeconds)}
          unit={t.strava.duration.toLowerCase()}
        />
      </div>

      <div className="mb-5 flex items-center gap-2" aria-hidden="true">
        <span className={cn('ring-background size-2.5 shrink-0 rounded-full ring-2', dot)} />
        <span className="border-foreground/25 h-px flex-1 border-t-2 border-dashed" />
        <span className={cn('ring-background size-2.5 shrink-0 rounded-full ring-2', dot)} />
      </div>

      <ActivityStats stats={stats} />
    </ActivityCardLink>
  );
}
