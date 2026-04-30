import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

interface CodeToggleProps {
  children: ReactNode;
  title?: string;
  defaultOpen?: boolean;
}

export function CodeToggle({
  children,
  title = 'Show code',
  defaultOpen = false,
}: CodeToggleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="not-prose border-border my-6 overflow-hidden rounded-lg border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-muted/50 hover:bg-muted flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{title}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className={cn(
            'size-5 motion-safe:transition-transform motion-safe:duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid motion-safe:transition-all motion-safe:duration-300',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden **:data-language-header:hidden **:data-pre:my-0! **:data-pre:rounded-none **:data-pre:border-x-0 **:data-pre:border-b-0 **:data-pre:shadow-none">
          {children}
        </div>
      </div>
    </div>
  );
}
