import type { RunningActivity } from '@/types/strava';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { Icon } from '../shared/Icon';
import {
  Award01Icon,
  MedalFirstPlaceIcon,
  DashboardSpeed01Icon,
  WorkoutRunIcon,
  MountainIcon,
  Heart,
} from '@hugeicons/core-free-icons';

interface RaceActivityCardProps {
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

  const formattedDate = activity.date
    .toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();

  const finishTime = formatFinishTime(activity.durationSeconds);

  return (
    <>
      <style>{`
        @keyframes raceConfettiFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--rotate)); opacity: 0.6; }
          50% { transform: translateY(-6px) rotate(calc(var(--rotate) + 15deg)); opacity: 0.9; }
        }
        @keyframes raceShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes raceBorderGlow {
          0%, 100% { box-shadow: 0 0 8px 1px rgba(251,191,36,0.2); }
          50% { box-shadow: 0 0 18px 4px rgba(251,191,36,0.45); }
        }
        .race-card-glow {
          animation: raceBorderGlow 2.5s ease-in-out infinite;
        }
        .race-card-glow:hover {
          animation: none;
          box-shadow: 0 0 28px 6px rgba(251,191,36,0.55), 0 0 0 1px rgba(251,191,36,0.8);
        }
        .race-shimmer-bar {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(251,191,36,0.0) 30%,
            rgba(251,191,36,0.5) 50%,
            rgba(251,191,36,0.0) 70%,
            transparent 100%
          );
          background-size: 200% auto;
          animation: raceShimmer 3s linear infinite;
        }
        .race-card-glow:hover .race-shimmer-bar {
          animation: raceShimmer 1.2s linear infinite;
        }
      `}</style>

      <a
        href={activity.stravaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
      >
        <div
          className="race-card-glow group relative flex h-full flex-col overflow-hidden rounded-xl border border-amber-500/60 p-4 transition-all duration-300 hover:border-amber-400"
          style={{ background: '#100c00' }}
        >
          {CONFETTI_PIECES.map((piece, i) => (
            <span
              key={i}
              className="pointer-events-none absolute rounded-sm"
              style={
                {
                  top: piece.top,
                  left: piece.left,
                  width: piece.width,
                  height: piece.height,
                  background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f59e0b' : '#fde68a',
                  '--rotate': `${piece.rotate}deg`,
                  animationName: 'raceConfettiFloat',
                  animationDuration: `${piece.duration}s`,
                  animationDelay: `${piece.delay}s`,
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  transform: `rotate(${piece.rotate}deg)`,
                } as React.CSSProperties
              }
            />
          ))}
          <div className="relative mb-1 flex items-center justify-between">
            <p className="text-xs tracking-wide text-amber-400 uppercase">{formattedDate}</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-[#EFBF04] px-2.5 py-0.5 text-xs font-semibold tracking-widest text-amber-950 uppercase">
              <Icon icon={Award01Icon} size={12} strokeWidth={2} />
              RACE
            </span>
          </div>

          <h3 className="mt-0.5 line-clamp-1 text-base font-bold text-amber-100">
            {activity.name}
          </h3>

          <div className="my-2 flex items-center gap-3 text-[#EFBF04]">
            <div className="shrink-0 transition-transform duration-500 group-hover:rotate-12">
              <Icon icon={MedalFirstPlaceIcon} size={24} strokeWidth={1.5} />
            </div>
            <span
              className="text-2xl font-black tracking-tight"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {finishTime}
            </span>
          </div>

          {/* Stats row */}
          <div
            className={`mt-auto grid gap-2 border-t border-amber-800/50 pt-2 ${activity.averageHeartRate ? 'grid-cols-4' : 'grid-cols-3'}`}
          >
            <div className="text-center">
              <div className="mb-1 flex justify-center text-amber-600">
                <Icon icon={DashboardSpeed01Icon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-amber-200">{activity.paceMinPerKm}</p>
              <p className="text-xs text-amber-600">{t.strava.pace}</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex justify-center text-amber-600">
                <Icon icon={WorkoutRunIcon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-amber-200">{activity.distanceKm.toFixed(1)}</p>
              <p className="text-xs text-amber-600">km</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex justify-center text-amber-600">
                <Icon icon={MountainIcon} size={13} strokeWidth={2} />
              </div>
              <p className="text-sm font-bold text-amber-200">{activity.elevationGain}</p>
              <p className="text-xs text-amber-600">m</p>
            </div>
            {activity.averageHeartRate && (
              <div className="text-center">
                <div className="mb-1 flex justify-center">
                  <Icon
                    icon={Heart}
                    size={13}
                    strokeWidth={2}
                    className="fill-rose-400 text-rose-400"
                  />
                </div>
                <p className="text-sm font-bold text-amber-200">{activity.averageHeartRate}</p>
                <p className="text-xs text-amber-600">{t.strava.heartRate}</p>
              </div>
            )}
          </div>
          <div className="race-shimmer-bar pointer-events-none absolute bottom-0 left-0 h-[2px] w-full" />
        </div>
      </a>
    </>
  );
}
