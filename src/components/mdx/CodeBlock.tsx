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
    <div className={cn('group border-border bg-card relative my-6 rounded-lg border', className)}>
      {filename && (
        <div className="border-border text-muted-foreground flex items-center gap-2 border-b px-4 py-2 text-sm">
          <span className="font-mono">{filename}</span>
          {language && (
            <span className="bg-muted ml-auto rounded px-2 py-0.5 text-xs">{language}</span>
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
            'border-border bg-background/80 text-muted-foreground absolute top-2 right-2 rounded-md border p-2 backdrop-blur-sm',
            'opacity-0 group-hover:opacity-100 motion-safe:transition-opacity',
            'hover:bg-muted hover:text-foreground',
            'focus:ring-ring focus:opacity-100 focus:ring-2 focus:outline-none'
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
