import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PastelColor = 'slate' | 'stone' | 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'pink';

interface PastelCardProps {
  label?: string;
  emoji?: string;
  title?: string;
  color?: PastelColor;
  children?: ReactNode;
}

interface PastelCardsProps {
  children: ReactNode;
}

const colorConfig: Record<PastelColor, { tint: string; chip: string }> = {
  slate: {
    tint: 'from-foreground/4',
    chip: 'bg-foreground/8 text-foreground/75',
  },
  stone: {
    tint: 'from-pastel-butter/25 dark:from-pastel-butter/6',
    chip: 'bg-pastel-butter/80 text-foreground/80 dark:bg-pastel-butter/12 dark:text-pastel-butter',
  },
  red: {
    tint: 'from-pastel-rose/35 dark:from-marker/10',
    chip: 'bg-pastel-rose/70 text-foreground/80 dark:bg-marker/15 dark:text-marker',
  },
  orange: {
    tint: 'from-pastel-peach/40 dark:from-pastel-peach/10',
    chip: 'bg-pastel-peach/70 text-foreground/80 dark:bg-pastel-peach/12 dark:text-pastel-peach',
  },
  green: {
    tint: 'from-pastel-mint/40 dark:from-pastel-mint/10',
    chip: 'bg-pastel-mint/75 text-foreground/80 dark:bg-pastel-mint/12 dark:text-pastel-mint',
  },
  blue: {
    tint: 'from-pastel-sky/40 dark:from-pastel-sky/10',
    chip: 'bg-pastel-sky/70 text-foreground/80 dark:bg-pastel-sky/12 dark:text-pastel-sky',
  },
  purple: {
    tint: 'from-pastel-lilac/40 dark:from-pastel-lilac/12',
    chip: 'bg-pastel-lilac/70 text-foreground/80 dark:bg-pastel-lilac/12 dark:text-pastel-lilac',
  },
  pink: {
    tint: 'from-marker/15 dark:from-marker/10',
    chip: 'bg-marker/20 text-foreground/80 dark:bg-marker/15 dark:text-marker',
  },
};

export function PastelCard({ label, emoji, title, color = 'slate', children }: PastelCardProps) {
  const { tint, chip } = colorConfig[color];

  return (
    <div
      className={cn(
        'not-prose glass relative flex h-full flex-col gap-2 rounded-3xl bg-linear-to-br to-transparent to-70% p-6 transition duration-300 hover:-translate-y-0.5',
        tint
      )}
    >
      {label && (
        <span
          className={cn(
            'mb-2 self-start rounded-full px-2.5 py-0.5 font-mono text-[0.7rem] tracking-wide uppercase',
            chip
          )}
        >
          {label}
        </span>
      )}

      {emoji && <div className="text-3xl">{emoji}</div>}

      {title && (
        <div className="font-display-soft text-foreground text-lg leading-snug font-semibold tracking-tight">
          {title}
        </div>
      )}

      {children && (
        <div className="text-muted-foreground flex-1 text-sm leading-relaxed [&>p]:m-0">
          {children}
        </div>
      )}
    </div>
  );
}

export function PastelCards({ children }: PastelCardsProps) {
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {children}
    </div>
  );
}
