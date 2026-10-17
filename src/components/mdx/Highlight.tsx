import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type HighlightColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

interface HighlightProps {
  children: ReactNode;
  color?: HighlightColor;
  className?: string;
}

const colorClasses: Record<HighlightColor, string> = {
  red: 'before:bg-pastel-rose dark:before:bg-pastel-rose/45',
  blue: 'before:bg-pastel-sky dark:before:bg-pastel-sky/45',
  green: 'before:bg-pastel-mint dark:before:bg-pastel-mint/45',
  yellow: 'before:bg-pastel-butter dark:before:bg-pastel-butter/45',
  purple: 'before:bg-pastel-lilac dark:before:bg-pastel-lilac/45',
  orange: 'before:bg-pastel-peach dark:before:bg-pastel-peach/45',
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
