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
  { icon: typeof InformationCircleIcon; classes: string; iconBadge: string; titleColor: string }
> = {
  info: {
    icon: InformationCircleIcon,
    classes: 'bg-pastel-sky/25 border-pastel-sky dark:bg-pastel-sky/10 dark:border-pastel-sky/35',
    iconBadge: 'bg-pastel-sky dark:bg-pastel-sky/15 dark:text-pastel-sky',
    titleColor: 'dark:text-pastel-sky',
  },
  warning: {
    icon: Alert02Icon,
    classes:
      'bg-pastel-butter/35 border-pastel-butter dark:bg-pastel-butter/10 dark:border-pastel-butter/35',
    iconBadge: 'bg-pastel-butter dark:bg-pastel-butter/15 dark:text-pastel-butter',
    titleColor: 'dark:text-pastel-butter',
  },
  success: {
    icon: CheckmarkCircle03Icon,
    classes:
      'bg-pastel-mint/30 border-pastel-mint dark:bg-pastel-mint/10 dark:border-pastel-mint/35',
    iconBadge: 'bg-pastel-mint dark:bg-pastel-mint/15 dark:text-pastel-mint',
    titleColor: 'dark:text-pastel-mint',
  },
  tip: {
    icon: Bulb,
    classes:
      'bg-pastel-lilac/25 border-pastel-lilac dark:bg-pastel-lilac/10 dark:border-pastel-lilac/35',
    iconBadge: 'bg-pastel-lilac dark:bg-pastel-lilac/15 dark:text-pastel-lilac',
    titleColor: 'dark:text-pastel-lilac',
  },
  danger: {
    icon: CancelCircleIcon,
    classes:
      'bg-pastel-rose/25 border-pastel-rose dark:bg-pastel-rose/10 dark:border-pastel-rose/35',
    iconBadge: 'bg-pastel-rose dark:bg-pastel-rose/15 dark:text-pastel-rose',
    titleColor: 'dark:text-pastel-rose',
  },
};

export function Callout({ children, variant = 'info', title, className }: CalloutProps) {
  const config = variantConfig[variant];

  return (
    <aside
      role="note"
      aria-label={title ? `${variant}: ${title}` : variant}
      className={cn(
        'not-prose',
        'relative my-6 rounded-lg border p-4',
        'motion-safe:transition-colors',
        config.classes,
        className
      )}
    >
      <div className="bg-background absolute -top-4 -left-4 rounded-full p-1">
        <span className={cn('text-foreground/75 flex rounded-full p-1', config.iconBadge)}>
          <HugeiconsIcon icon={config.icon} strokeWidth={2} className="size-5 shrink-0" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        {title && (
          <p className={cn('text-foreground mb-1 font-semibold', config.titleColor)}>{title}</p>
        )}
        <div className="text-sm [&>p]:m-0">{children}</div>
      </div>
    </aside>
  );
}
