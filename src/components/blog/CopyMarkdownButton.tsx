'use client';

import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, Copy01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface CopyMarkdownButtonProps {
  /** URL of the post's generated markdown file, e.g. /blog/my-post.md */
  url: string;
  label: string;
  copiedLabel: string;
}

export function CopyMarkdownButton({ url, label, copiedLabel }: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false);
  const markdown = useRef<Promise<string> | null>(null);

  /**
   * Fetching on hover or focus keeps the clipboard write inside the click's
   * user-activation window, which Safari revokes across a slow await. Doing it
   * on mount instead would cost every reader a request they never use.
   */
  const prefetch = () => {
    markdown.current ??= fetch(url).then((response) => {
      if (!response.ok) throw new Error(`Could not fetch ${url}: ${response.status}`);
      return response.text();
    });
  };

  const handleCopy = async () => {
    prefetch();

    try {
      await navigator.clipboard.writeText(await markdown.current!);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // A failed fetch or a blocked clipboard leaves the button idle, and drops
      // the rejected promise so the next click starts over
      markdown.current = null;
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      aria-label={copied ? copiedLabel : label}
      className="group text-muted-foreground hover:text-primary flex shrink-0 cursor-pointer items-center gap-2 rounded-md border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-current"
    >
      <span className="relative size-4">
        <HugeiconsIcon
          icon={Copy01Icon}
          strokeWidth={2}
          className={cn(
            'absolute inset-0 size-4 motion-safe:transition-all motion-safe:duration-300',
            copied ? 'scale-75 rotate-12 opacity-0' : 'scale-100 rotate-0 opacity-100'
          )}
        />
        <HugeiconsIcon
          icon={Check}
          strokeWidth={2}
          className={cn(
            'absolute inset-0 size-4 text-green-500 motion-safe:transition-all motion-safe:duration-300',
            copied ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-12 opacity-0'
          )}
        />
      </span>
      <span className="hidden md:inline">{copied ? copiedLabel : label}</span>
    </button>
  );
}
