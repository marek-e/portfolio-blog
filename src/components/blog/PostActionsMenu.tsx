'use client';

import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, Copy01Icon, RssIcon } from '@hugeicons/core-free-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const supportsPromisedClipboardItem = () =>
  typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function';

function writeText(text: string): Promise<void> {
  if (typeof navigator.clipboard?.writeText !== 'function') {
    return Promise.reject(new Error('Clipboard unavailable'));
  }

  return navigator.clipboard.writeText(text);
}

function writeWhilePending(pending: Promise<string>): Promise<void> {
  if (!supportsPromisedClipboardItem()) {
    return pending.then(writeText);
  }

  return navigator.clipboard
    .write([
      new ClipboardItem({
        'text/plain': pending.then((text) => new Blob([text], { type: 'text/plain' })),
      }),
    ])
    .catch(() => pending.then(writeText));
}

function MoreHorizontalDots() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4 shrink-0">
      {[6, 12, 18].map((cx, index) => (
        <circle
          key={cx}
          cx={cx}
          cy="12.5"
          r="2"
          className="motion-safe:group-hover:animate-dot-bounce"
          style={{ animationDelay: `${index * 90}ms` }}
        />
      ))}
    </svg>
  );
}

interface PostActionsMenuProps {
  copyUrl: string;
  rssUrl: string;
  triggerLabel: string;
  copyLabel: string;
  copiedLabel: string;
  rssLabel: string;
}

export function PostActionsMenu({
  copyUrl,
  rssUrl,
  triggerLabel,
  copyLabel,
  copiedLabel,
  rssLabel,
}: PostActionsMenuProps) {
  const [copied, setCopied] = useState(false);
  const pending = useRef<Promise<string> | null>(null);
  const markdown = useRef<string | null>(null);

  const prefetch = () => {
    pending.current ??= fetch(copyUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not fetch ${copyUrl}: ${response.status}`);
        return response.text();
      })
      .then((text) => {
        markdown.current = text;
        return text;
      })
      .catch((error: unknown) => {
        pending.current = null;
        throw error;
      });
    return pending.current;
  };

  const warm = () => void prefetch().catch(() => {});

  const handleCopy = () => {
    const written =
      markdown.current === null ? writeWhilePending(prefetch()) : writeText(markdown.current);

    written.then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => setCopied(false)
    );
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && warm()}>
      <DropdownMenuTrigger
        aria-label={triggerLabel}
        onPointerEnter={warm}
        onFocus={warm}
        className="group border-border text-muted-foreground hover:text-primary data-popup-open:text-primary flex shrink-0 cursor-pointer items-center rounded-md border px-3 py-1.5 text-sm transition-colors hover:border-current data-popup-open:border-current"
      >
        <MoreHorizontalDots />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-52">
        <DropdownMenuItem closeOnClick={false} onClick={handleCopy} className="gap-2 px-2 py-1.5">
          <span className="relative size-4 shrink-0">
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
          {copied ? copiedLabel : copyLabel}
        </DropdownMenuItem>

        <DropdownMenuItem
          render={<a href={rssUrl} />}
          className="group/rss gap-2 px-2 py-1.5"
          aria-label={rssLabel}
        >
          <HugeiconsIcon
            icon={RssIcon}
            strokeWidth={2}
            className="group-hover/rss:animate-wiggle size-4 shrink-0 transition-transform duration-300"
          />
          RSS
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
