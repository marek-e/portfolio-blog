import type { IconSvgElement } from '@hugeicons/react';
import { Icon } from '../Icon';

interface CardFieldProps {
  label: string;
  value: string;
  icon?: IconSvgElement;
  highlight?: boolean;
  showDivider?: boolean;
}

export function CardField({ label, value, icon, highlight, showDivider }: CardFieldProps) {
  const baseClasses = 'flex items-center rounded-md px-3 py-1.5';
  const highlightClasses = highlight
    ? 'border-primary bg-primary/15 border-l-4'
    : 'border-border border-b-primary/35 border border-b-2';

  return (
    <div className={`${baseClasses} ${highlightClasses}`}>
      <span className="text-foreground flex min-w-[90px] items-center gap-2 text-xs font-bold tracking-wide uppercase">
        {showDivider && '| '}
        {icon && <Icon icon={icon} strokeWidth={2} className="size-4" />}
        {label}
      </span>
      <span className="text-foreground ml-auto text-right text-sm font-normal">{value}</span>
    </div>
  );
}
