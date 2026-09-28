import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

interface ToggleProps {
  children: ReactNode;
  title?: string;
  defaultOpen?: boolean;
  className?: string;
}

export function Toggle({
  children,
  title = 'Show details',
  defaultOpen = false,
  className,
}: ToggleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        'not-prose border-pastel-lilac/60 dark:border-pastel-lilac/20 my-6 overflow-hidden rounded-lg border',
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-pastel-lilac/20 hover:bg-pastel-lilac/35 dark:bg-pastel-lilac/8 dark:hover:bg-pastel-lilac/14 flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{title}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className={cn('size-5 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'border-pastel-lilac/60 dark:border-pastel-lilac/20 h-0 overflow-hidden border-t px-4 py-0 transition-all duration-300',
          isOpen && 'h-auto p-4'
        )}
      >
        {children}
      </div>
    </div>
  );
}
