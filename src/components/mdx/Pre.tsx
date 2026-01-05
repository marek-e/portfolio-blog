import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../react/Icon';
import { Check, Copy01Icon } from '@hugeicons/core-free-icons';

interface PreProps {
  children: ReactNode;
  className?: string;
  'data-language'?: string;
}

export function Pre({ children, className, 'data-language': language, ...props }: PreProps) {
  return (
    <div className="group border-border shadow-code shadow-primary relative my-6 overflow-hidden rounded-lg border">
      {language && (
        <div className="border-border bg-muted relative flex h-10 items-center justify-between">
          <div className="border-primary text-foreground absolute ml-8 h-full rounded-t-lg border-t-2 bg-(--shiki-bg) px-4 py-2 font-mono text-sm">
            {language}
          </div>
        </div>
      )}
      <div className="relative bg-(--shiki-bg)">
        <pre className={cn('overflow-x-auto p-4 text-sm leading-relaxed', className)} {...props}>
          {children}
        </pre>
        <button
          type="button"
          data-copy-button
          className={cn(
            'border-border bg-background/80 text-muted-foreground absolute top-3 right-3 z-10 cursor-pointer rounded-md border p-2 backdrop-blur-sm',
            'opacity-0 group-hover:opacity-100 motion-safe:transition-opacity',
            'hover:bg-muted hover:text-foreground',
            'focus:ring-ring focus:opacity-100 focus:ring-2 focus:outline-none',
            'active:scale-95 motion-safe:transition-transform'
          )}
          aria-label="Copy code"
        >
          <span
            data-copy-icon
            className="block motion-safe:transition-all motion-safe:duration-200"
          >
            <Icon icon={Copy01Icon} strokeWidth={2} className="size-4" />
          </span>
          <span
            data-check-icon
            className="hidden scale-0 text-green-500 motion-safe:transition-all motion-safe:duration-200"
          >
            <Icon icon={Check} strokeWidth={2} className="size-4" />
          </span>
        </button>
      </div>
    </div>
  );
}
