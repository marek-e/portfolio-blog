'use client';

import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, Copy01Icon, MoreHorizontalIcon, RssIcon } from '@hugeicons/core-free-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Whether the clipboard accepts a ClipboardItem, which is what allows the write
 * to be issued synchronously with data that is still in flight.
 */
const supportsPromisedClipboardItem = () =>
  typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function';

interface PostActionsMenuProps {
  /** URL of the post's generated markdown file, e.g. /blog/my-post.md */
  copyUrl: string;
  rssUrl: string;
  triggerLabel: string;
  copyLabel: string;
  copiedLabel: string;
  rssLabel: string;
}

/**
 * The post header's action menu. Trigger, content and items all live in this one
 * file: Astro would otherwise hydrate each part as its own island, and separate
 * islands cannot share the menu's React context (see .claude/CLAUDE.md).
 */
export function PostActionsMenu({
  copyUrl,
  rssUrl,
  triggerLabel,
  copyLabel,
  copiedLabel,
  rssLabel,
}: PostActionsMenuProps) {
  const [copied, setCopied] = useState(false);
  const markdown = useRef<Promise<string> | null>(null);

  /**
   * Warms the cache on hover, focus or menu open so the copy is instant. Only an
   * optimization — the click path below stays correct on a cold cache, which is
   * what a tap gets, having none of a pointer's lead time.
   */
  const prefetch = () => {
    markdown.current ??= fetch(copyUrl).then((response) => {
      if (!response.ok) throw new Error(`Could not fetch ${copyUrl}: ${response.status}`);
      return response.text();
    });
    return markdown.current;
  };

  const handleCopy = () => {
    const pending = prefetch();

    // The clipboard is handed the pending promise rather than an awaited value:
    // Safari treats an await inside the handler as the end of the click's user
    // activation and rejects the write that follows.
    const written = supportsPromisedClipboardItem()
      ? navigator.clipboard
          .write([
            new ClipboardItem({
              'text/plain': pending.then((text) => new Blob([text], { type: 'text/plain' })),
            }),
          ])
          // Browsers that take a ClipboardItem but not a promised value reject
          // here. They are also the ones lenient about activation, so awaiting
          // the text and writing it plainly still works.
          .catch(() => pending.then((text) => navigator.clipboard.writeText(text)))
      : pending.then((text) => navigator.clipboard.writeText(text));

    written.then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        // A failed fetch or a blocked clipboard leaves the item idle, and drops
        // the rejected promise so the next click starts over
        markdown.current = null;
      }
    );
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && prefetch()}>
      <DropdownMenuTrigger
        aria-label={triggerLabel}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        className="group text-muted-foreground hover:text-primary data-popup-open:text-primary flex shrink-0 cursor-pointer items-center rounded-md border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-current data-popup-open:border-current"
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-52">
        {/* Kept open on click so the copied state is visible where it was triggered */}
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
