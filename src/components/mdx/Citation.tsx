import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link02Icon } from '@hugeicons/core-free-icons';

interface CitationProps {
  children: ReactNode;
  author?: string;
  source?: string;
  url?: string;
  className?: string;
}

export function Citation({ children, author, source, url, className }: CitationProps) {
  const hasAttribution = author || source;

  return (
    <figure
      className={cn(
        'not-prose glass from-pastel-rose/25 dark:from-pastel-lilac/10 relative my-10 overflow-hidden rounded-3xl bg-linear-to-br to-transparent to-60% px-6 pt-12 pb-7 sm:px-10 sm:pt-14 sm:pb-8',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="font-display-wonk text-marker/70 absolute top-2 left-5 text-7xl leading-none select-none sm:left-8"
      >
        &ldquo;
      </span>
      <blockquote className="font-display-soft text-foreground text-xl leading-snug text-pretty italic sm:text-2xl">
        <p className="m-0">{children}</p>
      </blockquote>

      {hasAttribution && (
        <figcaption className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-1.5 font-mono text-xs tracking-wide">
          <span aria-hidden="true" className="bg-foreground/25 mr-1.5 h-px w-6" />
          {author && <span className="text-foreground/85">{author}</span>}
          {author && source && <span>,</span>}
          {source &&
            (url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground decoration-marker/60 inline-flex items-center gap-1 underline underline-offset-4 transition-colors"
              >
                <cite className="not-italic">{source}</cite>
                <HugeiconsIcon icon={Link02Icon} className="size-3" />
              </a>
            ) : (
              <cite className="not-italic">{source}</cite>
            ))}
        </figcaption>
      )}
    </figure>
  );
}
