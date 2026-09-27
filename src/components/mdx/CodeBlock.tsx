import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../shared/Icon';
import { Check, Copy01Icon } from '@hugeicons/core-free-icons';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('group code-surface relative my-8 overflow-hidden rounded-2xl', className)}>
      {filename && (
        <div className="border-border text-muted-foreground flex h-10 items-center gap-2 border-b px-4 font-mono text-xs tracking-wide">
          <span>{filename}</span>
          {language && (
            <span className="bg-pastel-lilac/50 dark:bg-pastel-lilac/12 dark:text-pastel-lilac ml-auto rounded-full px-2 py-0.5">
              {language}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={cn(
            'glass text-muted-foreground absolute top-2.5 right-2.5 rounded-lg p-2',
            'opacity-0 group-hover:opacity-100 motion-safe:transition-opacity pointer-coarse:opacity-100',
            'hover:text-foreground',
            'focus-visible:ring-ring/50 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:outline-none'
          )}
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <Icon icon={Check} strokeWidth={2} className="size-4" />
          ) : (
            <Icon icon={Copy01Icon} strokeWidth={2} className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
