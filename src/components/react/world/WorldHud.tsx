import type { WorldTranslations } from '@/i18n/translations/world';

interface WorldHudProps {
  t: WorldTranslations;
  listUrl: string;
  discoveredCount: number;
  totalCount: number;
  /** Translated tutorial hint to display, or null. */
  hint: string | null;
  muted: boolean;
  onToggleMute(): void;
}

/**
 * DOM HUD over the canvas. Anchored top-left: the top-right corner belongs to the site's
 * BookmarkLanguageToggle, the route's only language switch (plan decision 7).
 */
export function WorldHud({
  t,
  listUrl,
  discoveredCount,
  totalCount,
  hint,
  muted,
  onToggleMute,
}: WorldHudProps) {
  const discoveredLabel = t.hud.discovered
    .replace('{count}', String(discoveredCount))
    .replace('{total}', String(totalCount));

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start gap-3 p-4">
        <a
          href={listUrl}
          className="bg-background/80 text-foreground hover:bg-background border-border focus-visible:ring-ring/50 pointer-events-auto rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
        >
          {t.hud.viewAsList}
        </a>
        <p className="bg-background/80 text-muted-foreground border-border rounded-lg border px-3 py-1.5 text-sm shadow-sm backdrop-blur">
          {discoveredLabel}
        </p>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? t.hud.unmute : t.hud.mute}
          aria-pressed={muted}
          className="bg-background/80 hover:bg-background border-border focus-visible:ring-ring/50 pointer-events-auto rounded-lg border px-3 py-1.5 text-sm shadow-sm backdrop-blur transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
        </button>
      </div>

      {hint && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
          <p className="bg-background/85 text-foreground border-border animate-pulse rounded-full border px-5 py-2 text-sm font-medium shadow-md backdrop-blur">
            {hint}
          </p>
        </div>
      )}
    </>
  );
}
