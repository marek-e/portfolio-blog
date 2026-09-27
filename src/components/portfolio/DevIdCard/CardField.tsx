import type { IconSvgElement } from '@hugeicons/react';
import { Icon } from '../../shared/Icon';

interface CardFieldProps {
  label: string;
  value: string;
  icon?: IconSvgElement;
  highlight?: boolean;
}

export function CardField({ label, value, icon, highlight }: CardFieldProps) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <dt className="text-muted-foreground flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.08em] uppercase">
        {icon && <Icon icon={icon} strokeWidth={1.8} className="size-3.5" />}
        {label}
      </dt>
      <dd
        className={
          highlight
            ? 'bg-pastel-mint/55 text-foreground/85 dark:bg-pastel-mint/12 dark:text-pastel-mint ml-auto rounded-full px-2.5 py-0.5 text-right font-mono text-xs'
            : 'text-foreground ml-auto text-right text-sm'
        }
      >
        {value}
      </dd>
    </div>
  );
}
