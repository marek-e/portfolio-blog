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
    card: 'border-red-200 shadow-[6px_6px_0_var(--color-red-200)] dark:border-rose-700 dark:shadow-[6px_6px_0_var(--color-rose-700)]',
    chip: 'bg-red-50 text-red-700 border-red-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700',
  },
  orange: {
    card: 'border-orange-200 shadow-[6px_6px_0_var(--color-orange-200)] dark:border-yellow-700 dark:shadow-[6px_6px_0_var(--color-yellow-700)]',
    chip: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-700',
  },
  green: {
    card: 'border-green-200 shadow-[6px_6px_0_var(--color-green-200)] dark:border-green-700 dark:shadow-[6px_6px_0_var(--color-green-700)]',
    chip: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-700',
  },
  blue: {
    card: 'border-blue-200 shadow-[6px_6px_0_var(--color-blue-200)] dark:border-sky-700 dark:shadow-[6px_6px_0_var(--color-sky-700)]',
    chip: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-700',
  },
  purple: {
    card: 'border-purple-200 shadow-[6px_6px_0_var(--color-purple-200)] dark:border-fuchsia-700 dark:shadow-[6px_6px_0_var(--color-fuchsia-700)]',
    chip: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-300 dark:border-fuchsia-700',
  },
  pink: {
    card: 'border-pink-200 shadow-[6px_6px_0_var(--color-pink-200)] dark:border-pink-700 dark:shadow-[6px_6px_0_var(--color-pink-700)]',
    chip: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-700',
  },
};

export function PastelCard({ label, emoji, title, color = 'slate', children }: PastelCardProps) {
  const { card, chip } = colorConfig[color];

  return (
    <div
      className={cn(
        'not-prose dark:bg-card relative flex h-full flex-col rounded-2xl border bg-white p-4',
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

      {title && <div className="font-bold text-gray-900 dark:text-gray-100">{title}</div>}

      {children && (
        <div className="mt-1 flex-1 text-sm text-gray-600 dark:text-gray-400 [&>p]:m-0">
          {children}
        </div>
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
