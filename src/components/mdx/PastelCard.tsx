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

const colorConfig: Record<PastelColor, { card: string; chip: string; title: string }> = {
  slate: {
    card: 'border-slate-200 shadow-[6px_6px_0_var(--color-slate-200)] dark:border-slate-700 dark:shadow-[6px_6px_0_var(--color-slate-700)]',
    chip: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-700',
    title: 'text-foreground',
  },
  stone: {
    card: 'border-stone-200 shadow-[6px_6px_0_var(--color-stone-200)] dark:border-stone-700 dark:shadow-[6px_6px_0_var(--color-stone-700)]',
    chip: 'bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-900/60 dark:text-stone-300 dark:border-stone-700',
    title: 'text-foreground',
  },
  red: {
    card: 'border-pastel-rose bg-pastel-rose/35 shadow-[6px_6px_0_var(--color-pastel-rose)] dark:border-pastel-rose/40 dark:bg-pastel-rose/12 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-rose)_40%,transparent)]',
    chip: 'bg-pastel-rose text-pastel-rose-ink border-pastel-rose-ink/25 dark:bg-pastel-rose/18 dark:text-pastel-rose-ink dark:border-pastel-rose/40',
    title: 'text-pastel-rose-ink',
  },
  orange: {
    card: 'border-pastel-peach bg-pastel-peach/35 shadow-[6px_6px_0_var(--color-pastel-peach)] dark:border-pastel-peach/40 dark:bg-pastel-peach/12 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-peach)_40%,transparent)]',
    chip: 'bg-pastel-peach text-pastel-peach-ink border-pastel-peach-ink/25 dark:bg-pastel-peach/18 dark:text-pastel-peach-ink dark:border-pastel-peach/40',
    title: 'text-pastel-peach-ink',
  },
  green: {
    card: 'border-pastel-mint bg-pastel-mint/35 shadow-[6px_6px_0_var(--color-pastel-mint)] dark:border-pastel-mint/40 dark:bg-pastel-mint/12 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-mint)_40%,transparent)]',
    chip: 'bg-pastel-mint text-pastel-mint-ink border-pastel-mint-ink/25 dark:bg-pastel-mint/18 dark:text-pastel-mint-ink dark:border-pastel-mint/40',
    title: 'text-pastel-mint-ink',
  },
  blue: {
    card: 'border-pastel-sky bg-pastel-sky/35 shadow-[6px_6px_0_var(--color-pastel-sky)] dark:border-pastel-sky/40 dark:bg-pastel-sky/12 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-sky)_40%,transparent)]',
    chip: 'bg-pastel-sky text-pastel-sky-ink border-pastel-sky-ink/25 dark:bg-pastel-sky/18 dark:text-pastel-sky-ink dark:border-pastel-sky/40',
    title: 'text-pastel-sky-ink',
  },
  purple: {
    card: 'border-pastel-lilac bg-pastel-lilac/35 shadow-[6px_6px_0_var(--color-pastel-lilac)] dark:border-pastel-lilac/40 dark:bg-pastel-lilac/12 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-lilac)_40%,transparent)]',
    chip: 'bg-pastel-lilac text-pastel-lilac-ink border-pastel-lilac-ink/25 dark:bg-pastel-lilac/18 dark:text-pastel-lilac-ink dark:border-pastel-lilac/40',
    title: 'text-pastel-lilac-ink',
  },
  pink: {
    card: 'border-pastel-rose bg-pastel-rose/35 shadow-[6px_6px_0_var(--color-pastel-rose)] dark:border-pastel-rose/40 dark:bg-pastel-rose/12 dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-rose)_40%,transparent)]',
    chip: 'bg-pastel-rose text-pastel-rose-ink border-pastel-rose-ink/25 dark:bg-pastel-rose/18 dark:text-pastel-rose-ink dark:border-pastel-rose/40',
    title: 'text-pastel-rose-ink',
  },
};

export function PastelCard({ label, emoji, title, color = 'slate', children }: PastelCardProps) {
  const { card, chip, title: titleColor } = colorConfig[color];

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

      {title && <div className={cn('font-display-soft font-semibold', titleColor)}>{title}</div>}

      {children && (
        <div className="text-foreground/75 mt-1 flex-1 text-sm [&>p]:m-0">{children}</div>
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
