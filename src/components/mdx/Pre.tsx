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
    <div data-pre className="group code-surface relative my-8 overflow-hidden rounded-2xl">
      {language && (
        <div
          data-language-header
          className="border-border flex h-10 items-center gap-2 border-b px-4"
        >
          <span aria-hidden="true" className="bg-pastel-lilac size-2 rounded-full" />
          <span className="text-muted-foreground font-mono text-xs tracking-wide">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre
          className={cn('overflow-x-auto px-5 py-4 text-[0.85rem] leading-relaxed', className)}
          {...props}
        >
          {children}
        </pre>
        <button
          type="button"
          data-copy-button
          className={cn(
            'glass text-muted-foreground absolute top-2.5 right-2.5 z-10 cursor-pointer rounded-lg p-2',
            'opacity-0 group-hover:opacity-100 motion-safe:transition-opacity pointer-coarse:opacity-100',
            'hover:text-foreground',
            'focus-visible:ring-ring/50 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:outline-none',
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
