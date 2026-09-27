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
    <div className={cn('not-prose glass my-8 overflow-hidden rounded-2xl', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-foreground/4 focus-visible:ring-ring/50 flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-5 py-3 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="font-display-soft text-foreground text-lg font-semibold tracking-tight">
          {title}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className={cn(
            'text-muted-foreground size-5 shrink-0 motion-safe:transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'border-border h-0 overflow-hidden border-t px-5 py-0 motion-safe:transition-all motion-safe:duration-300',
          isOpen && 'h-auto py-5'
        )}
      >
        {children}
      </div>
    </div>
  );
}
