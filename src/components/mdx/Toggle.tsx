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

export function Toggle({ children, title = 'Show details', defaultOpen = false, className }: ToggleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('not-prose my-6 overflow-hidden rounded-lg border border-border', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-muted/50 hover:bg-muted flex w-full items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{title}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className={cn('size-5 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
        <div className={cn("border-t border-border h-0 overflow-hidden transition-all duration-300 px-4 py-0", isOpen && 'h-auto p-4')}>
          {children}
        </div>
    </div>
  );
}
