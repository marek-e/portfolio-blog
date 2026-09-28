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
    classes: 'bg-pastel-sky/40 border-pastel-sky dark:bg-pastel-sky/15 dark:border-pastel-sky/40',
    iconBadge: 'bg-pastel-sky text-pastel-sky-ink dark:bg-pastel-sky/20',
    titleColor: 'text-pastel-sky-ink',
  },
  warning: {
    icon: Alert02Icon,
    classes:
      'bg-pastel-butter/40 border-pastel-butter dark:bg-pastel-butter/15 dark:border-pastel-butter/40',
    iconBadge: 'bg-pastel-butter text-pastel-butter-ink dark:bg-pastel-butter/20',
    titleColor: 'text-pastel-butter-ink',
  },
  success: {
    icon: CheckmarkCircle03Icon,
    classes:
      'bg-pastel-mint/40 border-pastel-mint dark:bg-pastel-mint/15 dark:border-pastel-mint/40',
    iconBadge: 'bg-pastel-mint text-pastel-mint-ink dark:bg-pastel-mint/20',
    titleColor: 'text-pastel-mint-ink',
  },
  tip: {
    icon: Bulb,
    classes:
      'bg-pastel-lilac/40 border-pastel-lilac dark:bg-pastel-lilac/15 dark:border-pastel-lilac/40',
    iconBadge: 'bg-pastel-lilac text-pastel-lilac-ink dark:bg-pastel-lilac/20',
    titleColor: 'text-pastel-lilac-ink',
  },
  danger: {
    icon: CancelCircleIcon,
    classes:
      'bg-pastel-rose/40 border-pastel-rose dark:bg-pastel-rose/15 dark:border-pastel-rose/40',
    iconBadge: 'bg-pastel-rose text-pastel-rose-ink dark:bg-pastel-rose/20',
    titleColor: 'text-pastel-rose-ink',
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
        <span className={cn('flex rounded-full p-1', config.iconBadge)}>
          <HugeiconsIcon icon={config.icon} strokeWidth={2} className="size-5 shrink-0" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        {title && <p className={cn('mb-1 font-semibold', config.titleColor)}>{title}</p>}
        <div className="text-sm [&>p]:m-0">{children}</div>
      </div>
    </aside>
  );
}
