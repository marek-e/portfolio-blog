import type { WorldTranslations } from '@/i18n/translations/world';

interface WorldHudProps {
  t: WorldTranslations;
  listUrl: string;
}

/**
 * DOM HUD over the canvas. Anchored top-left: the top-right corner belongs to the site's
 * BookmarkLanguageToggle, the route's only language switch (plan decision 7).
 */
export function WorldHud({ t, listUrl }: WorldHudProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start p-4">
      <a
        href={listUrl}
        className="bg-background/80 text-foreground hover:bg-background border-border focus-visible:ring-ring/50 pointer-events-auto rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
      >
        {t.hud.viewAsList}
      </a>
    </div>
  );
}
