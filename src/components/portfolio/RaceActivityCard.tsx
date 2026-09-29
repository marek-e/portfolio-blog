import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/utils';
import { Icon } from '../shared/Icon';
import {
  Award01Icon,
  MedalFirstPlaceIcon,
  DashboardSpeed01Icon,
  WorkoutRunIcon,
  MountainIcon,
  Heart,
} from '@hugeicons/core-free-icons';
import {
  ActivityCardLink,
  ActivityHeader,
  ActivityStats,
  HeroMetric,
  formatActivityDate,
  formatFinishTime,
  type ActivityStat,
} from './ActivityCardParts';

interface RaceActivityCardProps {
  activity: RunningActivity;
  lang?: Lang;
}

const CONFETTI_COLORS = ['bg-pastel-butter', 'bg-pastel-peach', 'bg-pastel-rose'] as const;

const CONFETTI_PIECES = [
  { top: '8%', left: '15%', width: 8, height: 4, rotate: 20, delay: 0, duration: 3.2 },
  { top: '12%', left: '75%', width: 6, height: 3, rotate: -35, delay: 0.4, duration: 2.8 },
  { top: '5%', left: '55%', width: 10, height: 4, rotate: 50, delay: 0.8, duration: 3.5 },
  { top: '20%', left: '88%', width: 7, height: 3, rotate: -15, delay: 0.2, duration: 2.6 },
  { top: '35%', left: '5%', width: 9, height: 4, rotate: 70, delay: 1.0, duration: 3.8 },
  { top: '60%', left: '92%', width: 6, height: 3, rotate: -45, delay: 0.6, duration: 3.1 },
  { top: '70%', left: '10%', width: 8, height: 3, rotate: 30, delay: 1.4, duration: 2.9 },
  { top: '80%', left: '65%', width: 7, height: 4, rotate: -60, delay: 0.3, duration: 3.4 },
  { top: '45%', left: '80%', width: 5, height: 3, rotate: 15, delay: 1.2, duration: 2.7 },
  { top: '90%', left: '35%', width: 9, height: 3, rotate: -25, delay: 0.9, duration: 3.6 },
];

export function RaceActivityCard({ activity, lang = 'fr' }: RaceActivityCardProps) {
  const t = getTranslations(lang);
  const reducedMotion = useReducedMotion();

  const stats: ActivityStat[] = [
    { icon: DashboardSpeed01Icon, value: activity.paceMinPerKm, unit: t.strava.pace },
    { icon: WorkoutRunIcon, value: activity.distanceKm.toFixed(1), unit: 'km' },
    { icon: MountainIcon, value: activity.elevationGain, unit: 'm' },
    ...(activity.averageHeartRate
      ? [{ icon: Heart, value: activity.averageHeartRate, unit: t.strava.heartRate }]
      : []),
  ];

  return (
    <>
      <style>{`
        @keyframes raceConfettiFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--rotate)); opacity: 0.7; }
          50% { transform: translateY(-6px) rotate(calc(var(--rotate) + 15deg)); opacity: 1; }
        }
        .race-confetti {
          animation: raceConfettiFloat ease-in-out infinite;
        }
      `}</style>

      <ActivityCardLink
        href={activity.stravaUrl}
        className="ring-pastel shadow-[0_24px_60px_-24px_oklch(from_var(--pastel-butter)_l_c_h/70%)] hover:shadow-[0_30px_70px_-24px_oklch(from_var(--pastel-peach)_l_c_h/80%)]"
      >
        <span
          aria-hidden="true"
          className="bg-pastel-butter/45 dark:bg-pastel-butter/10 pointer-events-none absolute -top-20 -left-12 size-48 rounded-full blur-3xl"
        />
        {CONFETTI_PIECES.map((piece, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute rounded-sm',
              CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              !reducedMotion && 'race-confetti'
            )}
            style={
              {
                top: piece.top,
                left: piece.left,
                width: piece.width,
                height: piece.height,
                '--rotate': `${piece.rotate}deg`,
                animationDuration: `${piece.duration}s`,
                animationDelay: `${piece.delay}s`,
                transform: `rotate(${piece.rotate}deg)`,
              } as React.CSSProperties
            }
          />
        ))}

        <ActivityHeader
          date={formatActivityDate(activity.date, lang, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          name={activity.name}
          tag={
            <>
              <Icon icon={Award01Icon} size={12} strokeWidth={2} />
              {t.strava.tagRace}
            </>
          }
          tone="butter"
        />

        <div className="relative my-5">
          <HeroMetric
            value={formatFinishTime(activity.durationSeconds)}
            unit={t.strava.duration.toLowerCase()}
            leading={
              <span className="bg-pastel-butter/70 dark:bg-pastel-butter/15 dark:text-pastel-butter flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 motion-safe:group-hover:rotate-12">
                <Icon icon={MedalFirstPlaceIcon} size={22} strokeWidth={1.6} />
              </span>
            }
          />
        </div>

        <ActivityStats stats={stats} />
      </ActivityCardLink>
    </>
  );
}
