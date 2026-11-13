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
  const [immediate, setImmediate] = useState(false);

  return (
    <div
      className={cn(
        'not-prose border-pastel-lilac dark:border-pastel-lilac/40 my-6 overflow-hidden rounded-lg border',
        className
      )}
    >
      <button
        type="button"
        onClick={(event) => {
          setImmediate(event.detail === 0);
          setIsOpen((open) => !open);
        }}
        className="bg-pastel-lilac/40 hover:bg-pastel-lilac/60 dark:bg-pastel-lilac/15 dark:hover:bg-pastel-lilac/22 text-pastel-lilac-ink flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{title}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className={cn(
            'size-5 transition-transform duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
            isOpen && 'rotate-180',
            immediate && 'transition-none'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          immediate && 'transition-none'
        )}
        inert={!isOpen}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-pastel-lilac dark:border-pastel-lilac/40 border-t p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
