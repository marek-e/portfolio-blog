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
      <div className="not-prose my-6 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          Mermaid diagram error: No chart definition provided
        </p>
      </div>
    );
  }

  return (
    <figure className={cn('not-prose my-6', className)}>
      <div className="border-border shadow-code shadow-primary overflow-hidden rounded-lg border">
        {title && (
          <div className="border-border bg-muted dark:bg-muted/40 relative flex h-10 items-center">
            <div className="border-primary text-foreground absolute ml-8 h-full rounded-t-lg border-t-2 bg-(--shiki-bg) px-4 py-2 font-mono text-sm">
              mermaid
            </div>
          </div>
        )}
        <div
          data-mermaid-chart
          data-chart={chart.trim()}
          className="flex min-h-32 justify-center overflow-auto bg-(--shiki-bg) p-4"
        >
          <div className="flex items-center justify-center">
            <div className="border-muted-foreground size-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="text-muted-foreground mt-4 text-center text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
