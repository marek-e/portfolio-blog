import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

interface CodeToggleProps {
  children: ReactNode;
  title?: string;
  defaultOpen?: boolean;
}

export function CodeToggle({ children, title = 'Show code', defaultOpen = false }: CodeToggleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-muted/50 hover:bg-muted flex w-full items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{title}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className={cn('size-5 motion-safe:transition-transform motion-safe:duration-300', isOpen && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'grid motion-safe:transition-all motion-safe:duration-300',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden [&_[data-pre]]:!my-0 [&_[data-pre]]:rounded-none [&_[data-pre]]:border-x-0 [&_[data-pre]]:border-b-0 [&_[data-pre]]:shadow-none [&_[data-language-header]]:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
