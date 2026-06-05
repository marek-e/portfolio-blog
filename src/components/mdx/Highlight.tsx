import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type HighlightColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

interface HighlightProps {
  children: ReactNode;
  color?: HighlightColor;
  className?: string;
}

const colorClasses: Record<HighlightColor, string> = {
  red: 'before:bg-red-300/70 dark:before:bg-red-400/50',
  blue: 'before:bg-blue-300/70 dark:before:bg-blue-400/50',
  green: 'before:bg-green-300/70 dark:before:bg-green-400/50',
  yellow: 'before:bg-yellow-300/70 dark:before:bg-yellow-400/50',
  purple: 'before:bg-purple-300/70 dark:before:bg-purple-400/50',
  orange: 'before:bg-orange-300/70 dark:before:bg-orange-400/50',
};

export function Highlight({ children, color = 'yellow', className }: HighlightProps) {
  return (
    <mark
      className={cn(
        'inline-block -rotate-1 px-1.5 py-0.5 text-inherit',
        `relative before:absolute before:-ml-[2.5%] before:h-[97%] before:w-[103%] before:-skew-x-5`,
        colorClasses[color],
        className
      )}
    >
      <span className="inline-block rotate-1 skew-x-3 bg-transparent">{children}</span>
    </mark>
  );
}
