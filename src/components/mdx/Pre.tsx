import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../shared/Icon';
import { Check, Copy01Icon } from '@hugeicons/core-free-icons';

interface PreProps {
  children: ReactNode;
  className?: string;
  'data-language'?: string;
}

export function Pre({ children, className, 'data-language': language, ...props }: PreProps) {
  return (
    <div
      data-pre
      className="group border-pastel-lilac dark:border-pastel-lilac/40 relative my-6 overflow-hidden rounded-lg border shadow-[6px_6px_0_var(--color-pastel-lilac)] dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-lilac)_40%,transparent)]"
    >
      {language && (
        <div
          data-language-header
          className="bg-pastel-lilac/45 dark:bg-pastel-lilac/15 relative flex h-10 items-center justify-between"
        >
          <div className="border-pastel-lilac-ink dark:border-pastel-lilac text-pastel-lilac-ink absolute ml-8 h-full rounded-t-lg border-t-2 bg-(--shiki-bg) px-4 py-2 font-mono text-sm">
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
            'group/copy border-border bg-background text-muted-foreground absolute top-3 right-3 z-10 grid cursor-pointer rounded-md border p-2',
            'opacity-0 group-hover:opacity-100 motion-safe:transition-opacity',
            'hover:bg-muted hover:text-foreground',
            'focus:ring-ring focus:opacity-100 focus:ring-2 focus:outline-none'
          )}
          aria-label="Copy code"
        >
          <span
            data-copy-icon
            aria-hidden="true"
            className="col-start-1 row-start-1 opacity-100 transition-opacity duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-copied/copy:opacity-0 group-data-copy-instant/copy:transition-none motion-reduce:transition-none"
          >
            <Icon icon={Copy01Icon} strokeWidth={2} className="size-4" />
          </span>
          <span
            data-check-icon
            aria-hidden="true"
            className="col-start-1 row-start-1 text-green-500 opacity-0 transition-opacity duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-copied/copy:opacity-100 group-data-copy-instant/copy:transition-none motion-reduce:transition-none"
          >
            <Icon icon={Check} strokeWidth={2} className="size-4" />
          </span>
        </button>
      </div>
    </div>
  );
}
