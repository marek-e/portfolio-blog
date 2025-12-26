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
    <figure className={cn('my-6', className)}>
      <blockquote
        className={cn(
          'not-prose',
          'border-primary/50 relative border-l-4 py-2 pl-6',
          'text-muted-foreground text-lg italic',
          'before:absolute before:-top-2 before:left-1 before:font-serif before:leading-none',
          'before:text-primary/20 before:text-5xl before:content-["""]'
        )}
      >
        <p className="m-0">{children}</p>
      </blockquote>

      {hasAttribution && (
        <figcaption className="text-foreground mt-3 pl-6 text-sm not-italic">
          <span className="text-muted-foreground">— </span>
          {author && <span className="font-medium">{author}</span>}
          {author && source && <span className="text-muted-foreground">, </span>}
          {source &&
            (url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 hover:underline"
              >
                <cite className="not-italic">{source}</cite>
                <HugeiconsIcon icon={Link02Icon} className="size-3" />
              </a>
            ) : (
              <cite className="text-muted-foreground not-italic">{source}</cite>
            ))}
        </figcaption>
      )}
    </figure>
  );
}
