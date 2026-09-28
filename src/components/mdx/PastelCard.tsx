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

const colorConfig: Record<PastelColor, { card: string; chip: string }> = {
  slate: {
    card: 'border-slate-200 shadow-[6px_6px_0_var(--color-slate-200)] dark:border-slate-700 dark:shadow-[6px_6px_0_var(--color-slate-700)]',
    chip: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-700',
  },
  stone: {
    card: 'border-stone-200 shadow-[6px_6px_0_var(--color-stone-200)] dark:border-stone-700 dark:shadow-[6px_6px_0_var(--color-stone-700)]',
    chip: 'bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-900/60 dark:text-stone-300 dark:border-stone-700',
  },
  red: {
    card: 'border-pastel-rose bg-pastel-rose/12 shadow-[6px_6px_0_var(--color-pastel-rose)] dark:border-pastel-rose/30 dark:bg-pastel-rose/6 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-rose)_22%,transparent)]',
    chip: 'bg-pastel-rose/40 text-foreground/80 border-pastel-rose dark:bg-pastel-rose/12 dark:text-pastel-rose dark:border-pastel-rose/30',
  },
  orange: {
    card: 'border-pastel-peach bg-pastel-peach/12 shadow-[6px_6px_0_var(--color-pastel-peach)] dark:border-pastel-peach/30 dark:bg-pastel-peach/6 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-peach)_22%,transparent)]',
    chip: 'bg-pastel-peach/40 text-foreground/80 border-pastel-peach dark:bg-pastel-peach/12 dark:text-pastel-peach dark:border-pastel-peach/30',
  },
  green: {
    card: 'border-pastel-mint bg-pastel-mint/12 shadow-[6px_6px_0_var(--color-pastel-mint)] dark:border-pastel-mint/30 dark:bg-pastel-mint/6 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-mint)_22%,transparent)]',
    chip: 'bg-pastel-mint/40 text-foreground/80 border-pastel-mint dark:bg-pastel-mint/12 dark:text-pastel-mint dark:border-pastel-mint/30',
  },
  blue: {
    card: 'border-pastel-sky bg-pastel-sky/12 shadow-[6px_6px_0_var(--color-pastel-sky)] dark:border-pastel-sky/30 dark:bg-pastel-sky/6 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-sky)_22%,transparent)]',
    chip: 'bg-pastel-sky/40 text-foreground/80 border-pastel-sky dark:bg-pastel-sky/12 dark:text-pastel-sky dark:border-pastel-sky/30',
  },
  purple: {
    card: 'border-pastel-lilac bg-pastel-lilac/12 shadow-[6px_6px_0_var(--color-pastel-lilac)] dark:border-pastel-lilac/30 dark:bg-pastel-lilac/6 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-lilac)_22%,transparent)]',
    chip: 'bg-pastel-lilac/40 text-foreground/80 border-pastel-lilac dark:bg-pastel-lilac/12 dark:text-pastel-lilac dark:border-pastel-lilac/30',
  },
  pink: {
    card: 'border-pastel-rose bg-pastel-rose/12 shadow-[6px_6px_0_var(--color-pastel-rose)] dark:border-pastel-rose/30 dark:bg-pastel-rose/6 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-rose)_22%,transparent)]',
    chip: 'bg-pastel-rose/40 text-foreground/80 border-pastel-rose dark:bg-pastel-rose/12 dark:text-pastel-rose dark:border-pastel-rose/30',
  },
};

export function PastelCard({ label, emoji, title, color = 'slate', children }: PastelCardProps) {
  const { card, chip } = colorConfig[color];

  return (
    <div
      className={cn(
        'not-prose bg-card relative flex h-full flex-col rounded-2xl border p-4',
        label ? 'pt-10' : 'pt-4',
        card
      )}
    >
      {label && (
        <span
          className={cn(
            'absolute top-3 left-3 rounded-lg border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
            chip
          )}
        >
          {label}
        </span>
      )}

      {emoji && <div className="mb-2 text-3xl">{emoji}</div>}

      {title && <div className="font-display-soft text-foreground font-semibold">{title}</div>}

      {children && (
        <div className="text-muted-foreground mt-1 flex-1 text-sm [&>p]:m-0">{children}</div>
      )}
    </div>
  );
}

export function PastelCards({ children }: PastelCardsProps) {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
