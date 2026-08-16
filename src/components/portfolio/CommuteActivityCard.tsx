import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { Badge } from '@/components/ui/badge';
import { Icon } from '../shared/Icon';
import { WorkoutRunIcon, DashboardSpeed01Icon, Calendar01Icon } from '@hugeicons/core-free-icons';

interface CommuteActivityCardProps {
  activity: RunningActivity;
  lang?: Lang;
}

function formatFinishTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function CommuteActivityCard({ activity, lang = 'fr' }: CommuteActivityCardProps) {
  const t = getTranslations(lang);

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
      <div className="bg-muted/40 border-border group flex h-full flex-col rounded-xl border border-l-4 border-l-sky-500/40 p-4 transition-colors hover:border-l-sky-500/80">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-muted-foreground flex items-center gap-1 text-xs tracking-wide uppercase">
            <Icon icon={Calendar01Icon} size={14} strokeWidth={2} />
            {formattedDate}
          </p>
          <Badge variant="pastel-blue" className="tracking-widest uppercase">
            {t.strava.tagCommute}
          </Badge>
        </div>

        <h3 className="text-foreground mt-0.5 line-clamp-1 text-sm font-semibold">
          {activity.name}
        </h3>

        <div className="text-foreground/90 my-2 flex items-baseline gap-1.5">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatFinishTime(activity.durationSeconds)}
          </span>
          <span className="text-muted-foreground text-sm">{t.strava.duration.toLowerCase()}</span>
        </div>

        <div className="mb-3 flex items-center gap-2" aria-hidden="true">
          <span className="size-2 shrink-0 rounded-full bg-sky-500" />
          <span className="h-px flex-1 border-t border-dashed border-sky-500/50" />
          <span className="size-2 shrink-0 rounded-full bg-sky-500" />
        </div>

        <div className="border-border/50 mt-auto grid grid-cols-2 gap-2 border-t pt-2">
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex justify-center">
              <Icon icon={WorkoutRunIcon} size={13} strokeWidth={2} />
            </div>
            <p className="text-foreground text-sm font-bold">{activity.distanceKm.toFixed(1)}</p>
            <p className="text-muted-foreground text-xs">km</p>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1 flex justify-center">
              <Icon icon={DashboardSpeed01Icon} size={13} strokeWidth={2} />
            </div>
            <p className="text-foreground text-sm font-bold">{activity.paceMinPerKm}</p>
            <p className="text-muted-foreground text-xs">{t.strava.pace}</p>
          </div>
        </div>
      </div>
    </a>
  );
}
