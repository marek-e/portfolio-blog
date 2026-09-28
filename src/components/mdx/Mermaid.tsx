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
      <div className="not-prose border-pastel-rose bg-pastel-rose/25 dark:border-pastel-rose/35 dark:bg-pastel-rose/10 my-6 rounded-lg border p-4">
        <p className="text-foreground dark:text-pastel-rose text-sm font-medium">
          Mermaid diagram error: No chart definition provided
        </p>
      </div>
    );
  }

  return (
    <figure className={cn('not-prose my-6', className)}>
      <div className="border-pastel-lilac/70 dark:border-pastel-lilac/20 overflow-hidden rounded-lg border shadow-[6px_6px_0_var(--color-pastel-lilac)] dark:shadow-[6px_6px_0_color-mix(in_oklab,var(--color-pastel-lilac)_18%,transparent)]">
        {title && (
          <div className="bg-pastel-lilac/25 dark:bg-pastel-lilac/8 relative flex h-10 items-center">
            <div className="border-pastel-lilac dark:text-pastel-lilac text-foreground absolute ml-8 h-full rounded-t-lg border-t-2 bg-(--shiki-bg) px-4 py-2 font-mono text-sm">
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
