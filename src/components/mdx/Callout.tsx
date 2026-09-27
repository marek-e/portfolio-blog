import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  InformationCircleIcon,
  Alert02Icon,
  CheckmarkCircle03Icon,
  Bulb,
  CancelCircleIcon,
} from '@hugeicons/core-free-icons';

type CalloutVariant = 'info' | 'warning' | 'success' | 'tip' | 'danger';

interface CalloutProps {
  children: ReactNode;
  variant?: CalloutVariant;
  title?: string;
  className?: string;
}

const variantConfig: Record<
  CalloutVariant,
  { icon: typeof InformationCircleIcon; tint: string; tile: string }
> = {
  info: {
    icon: InformationCircleIcon,
    tint: 'from-pastel-sky/35 dark:from-pastel-sky/10',
    tile: 'bg-pastel-sky/70 dark:bg-pastel-sky/15 dark:text-pastel-sky',
  },
  warning: {
    icon: Alert02Icon,
    tint: 'from-pastel-butter/50 dark:from-pastel-butter/10',
    tile: 'bg-pastel-butter dark:bg-pastel-butter/15 dark:text-pastel-butter',
  },
  success: {
    icon: CheckmarkCircle03Icon,
    tint: 'from-pastel-mint/40 dark:from-pastel-mint/10',
    tile: 'bg-pastel-mint/80 dark:bg-pastel-mint/15 dark:text-pastel-mint',
  },
  tip: {
    icon: Bulb,
    tint: 'from-pastel-lilac/35 dark:from-pastel-lilac/12',
    tile: 'bg-pastel-lilac/70 dark:bg-pastel-lilac/15 dark:text-pastel-lilac',
  },
  danger: {
    icon: CancelCircleIcon,
    tint: 'from-pastel-rose/45 dark:from-marker/12',
    tile: 'bg-pastel-rose/80 dark:bg-marker/15 dark:text-marker',
  },
};

export function Callout({ children, variant = 'info', title, className }: CalloutProps) {
  const config = variantConfig[variant];

  return (
    <aside
      role="note"
      aria-label={title ? `${variant}: ${title}` : variant}
      className={cn(
        'not-prose glass my-8 flex gap-4 rounded-2xl bg-linear-to-br to-transparent to-70% p-5 sm:p-6',
        config.tint,
        className
      )}
    >
      <span
        className={cn(
          'text-foreground/80 flex size-9 shrink-0 items-center justify-center rounded-xl',
          config.tile
        )}
      >
        <HugeiconsIcon icon={config.icon} strokeWidth={2} className="size-5" />
      </span>
      <div className="min-w-0 flex-1 self-center">
        {title && (
          <p className="font-display-soft text-foreground mb-1 text-lg leading-snug font-semibold tracking-tight">
            {title}
          </p>
        )}
        <div className="text-foreground/80 text-[0.95rem] leading-relaxed [&>p]:m-0 [&>p+p]:mt-3">
          {children}
        </div>
      </div>
    </aside>
  );
}
