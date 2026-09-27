import { cn } from '@/lib/utils';

interface MermaidProps {
  chart?: string;
  caption?: string;
  className?: string;
  title?: string;
}

/**
 * Mermaid diagram component for MDX.
 * Renders a placeholder that gets hydrated client-side via script in [slug].astro.
 * The chart definition is stored in a data attribute for the client script to read.
 */
export function Mermaid({ chart, caption, title, className }: MermaidProps) {
  if (!chart) {
    return (
      <div className="not-prose glass from-pastel-rose/40 dark:from-marker/12 my-8 rounded-2xl bg-linear-to-br to-transparent p-5">
        <p className="text-foreground text-sm font-medium">
          Mermaid diagram error: No chart definition provided
        </p>
      </div>
    );
  }

  return (
    <figure className={cn('not-prose my-8', className)}>
      <div className="code-surface overflow-hidden rounded-2xl">
        {title && (
          <div className="border-border flex h-10 items-center gap-2 border-b px-4">
            <span aria-hidden="true" className="bg-pastel-mint size-2 rounded-full" />
            <span className="text-muted-foreground truncate font-mono text-xs tracking-wide">
              {title}
            </span>
          </div>
        )}
        <div
          data-mermaid-chart
          data-chart={chart.trim()}
          className="flex min-h-32 justify-center overflow-auto p-4 sm:p-6"
        >
          <div className="flex items-center justify-center">
            <div className="border-muted-foreground size-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="text-muted-foreground mt-3 text-center font-mono text-xs tracking-wide">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
