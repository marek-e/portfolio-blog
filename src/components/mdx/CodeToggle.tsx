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
    <div className="not-prose glass my-8 overflow-hidden rounded-2xl">
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
            'text-muted-foreground size-5 shrink-0 motion-safe:transition-transform motion-safe:duration-300',
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
