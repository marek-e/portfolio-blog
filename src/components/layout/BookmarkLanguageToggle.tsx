import { getAlternatePath, type Lang } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BookmarkLanguageToggleProps {
  currentLang: Lang;
  currentPath: string;
}

export function BookmarkLanguageToggle({ currentLang, currentPath }: BookmarkLanguageToggleProps) {
  const targetLang: Lang = currentLang === 'fr' ? 'en' : 'fr';
  const targetPath = getAlternatePath(currentPath, currentLang, targetLang);

  const tooltipLabel = currentLang === 'fr' ? 'Switch to English' : 'Passer en Français';

  return (
    <a
      href={targetPath}
      aria-label={tooltipLabel}
      className={cn(
        'fixed top-0 right-6 z-40 hidden md:flex',
        'w-11 flex-col items-center justify-end rounded-b-2xl pb-2',
        'language-bookmark liquid-glass group cursor-pointer',
        'h-12 -translate-y-6 transition-transform duration-200',
        'ease-[cubic-bezier(0.23,1,0.32,1)]',
        '[@media(hover:hover)_and_(pointer:fine)]:hover:translate-y-0',
        'focus-visible:translate-y-0 focus-visible:transition-none',
        'motion-reduce:translate-y-0 motion-reduce:transition-none'
      )}
    >
      {/* Flag circle with tooltip */}
      <Tooltip>
        <TooltipTrigger
          render={
            <div
              className={cn(
                'relative size-6 overflow-hidden rounded-full',
                // 3D effect - shadow for depth
                'shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.15)]',
                'transition-[scale,opacity] duration-200',
                'ease-[cubic-bezier(0.23,1,0.32,1)]',
                'motion-safe:scale-75 motion-safe:opacity-0',
                '[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100',
                'group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:transition-none',
                // Reduced motion: always visible
                'motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none'
              )}
            >
              <img
                src={`/flags/${currentLang}.svg`}
                alt="Flag of the current language"
                className="size-full object-cover"
                width={28}
                height={28}
                loading="lazy"
              />
              {/* 3D glass highlight overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 30%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                }}
              />
            </div>
          }
        />
        <TooltipContent side="left" sideOffset={20}>
          {tooltipLabel}
        </TooltipContent>
      </Tooltip>
    </a>
  );
}
