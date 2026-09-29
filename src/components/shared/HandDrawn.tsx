import { cn } from '@/lib/utils';

type SvgProps = { className?: string };

const DOODLES = {
  underline: {
    viewBox: '0 0 300 24',
    paths: ['M4 15C58 8 150 5 296 9', 'M40 20C100 16 170 15 238 17'],
  },
  line: {
    viewBox: '0 0 300 12',
    paths: ['M3 7C70 4 160 8 297 5'],
  },
  squiggle: {
    viewBox: '0 0 120 24',
    paths: ['M3 13C13 3 23 3 31 13S49 23 59 13 77 3 87 13s18 10 30 0'],
  },
  sparkle: {
    viewBox: '0 0 40 40',
    paths: ['M20 3c1 9 4 14 17 17-13 3-16 8-17 17-1-9-4-14-17-17 13-3 16-8 17-17Z'],
  },
  arrow: {
    viewBox: '0 0 120 80',
    paths: ['M6 10C22 52 58 70 104 58', 'M88 44l18 14-20 10'],
  },
  loop: {
    viewBox: '0 0 160 60',
    paths: ['M4 44C30 44 44 8 70 10c22 2 14 38-6 34-18-4 4-34 34-30 26 4 34 22 58 18'],
  },
  circle: {
    viewBox: '0 0 220 90',
    paths: ['M150 8C80 0 12 18 8 46c-4 30 88 42 150 30 50-10 64-40 30-58-24-12-70-14-120-4'],
  },
} as const;

type DoodleName = keyof typeof DOODLES;

export function Doodle({
  name,
  className,
  strokeWidth = 3,
  draw = false,
}: SvgProps & { name: DoodleName; strokeWidth?: number; draw?: boolean }) {
  const doodle = DOODLES[name];
  const isFilled = name === 'sparkle';

  return (
    <svg
      aria-hidden="true"
      viewBox={doodle.viewBox}
      fill="none"
      preserveAspectRatio="none"
      className={cn('pointer-events-none overflow-visible', draw && 'doodle-draw', className)}
    >
      {doodle.paths.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          fill={isFilled ? 'currentColor' : 'none'}
        />
      ))}
    </svg>
  );
}

export function MarkedText({
  children,
  className,
  markerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  markerClassName?: string;
}) {
  return (
    <span className={cn('relative inline-block whitespace-nowrap', className)}>
      <span className="font-display-wonk relative z-10">{children}</span>
      <Doodle
        name="underline"
        draw
        strokeWidth={4}
        className={cn(
          'text-marker absolute -bottom-[0.14em] left-[-2%] z-0 h-[0.28em] w-[104%]',
          markerClassName
        )}
      />
    </span>
  );
}

export function splitLastWord(text: string) {
  const trimmed = text.trim();
  const index = trimmed.lastIndexOf(' ');
  if (index === -1) return { lead: '', last: trimmed };
  return { lead: trimmed.slice(0, index + 1), last: trimmed.slice(index + 1) };
}
