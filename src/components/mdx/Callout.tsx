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
  { icon: typeof InformationCircleIcon; classes: string; iconColor: string; titleColor: string }
> = {
  info: {
    icon: InformationCircleIcon,
    classes: 'bg-sky-50 border-sky-300 dark:bg-sky-950/30 dark:border-sky-700',
    iconColor: 'text-sky-600 dark:text-sky-400',
    titleColor: 'text-sky-800 dark:text-sky-200',
  },
  warning: {
    icon: Alert02Icon,
    classes: 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-800 dark:text-amber-200',
  },
  success: {
    icon: CheckmarkCircle03Icon,
    classes: 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    titleColor: 'text-emerald-800 dark:text-emerald-200',
  },
  tip: {
    icon: Bulb,
    classes: 'bg-violet-50 border-violet-300 dark:bg-violet-950/30 dark:border-violet-700',
    iconColor: 'text-violet-600 dark:text-violet-400',
    titleColor: 'text-violet-800 dark:text-violet-200',
  },
  danger: {
    icon: CancelCircleIcon,
    classes: 'bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-800 dark:text-red-200',
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
        'relative my-6 rounded-sm border p-4',
        'motion-safe:transition-colors',
        config.classes,
        className
      )}
    >
      <div className="bg-background absolute -top-4 -left-4 rounded-full p-1.5">
        <HugeiconsIcon
          icon={config.icon}
          strokeWidth={2}
          className={cn('size-6 shrink-0', config.iconColor)}
        />
      </div>
      <div className="min-w-0 flex-1">
        {title && <p className={cn('mb-1 font-semibold', config.titleColor)}>{title}</p>}
        <div className="text-sm [&>p]:m-0">{children}</div>
      </div>
    </aside>
  );
}
