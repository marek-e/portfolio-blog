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
        'group from-primary/80 to-primary/50 cursor-pointer bg-linear-to-b shadow-lg',
        'border-primary border',
        'h-6 transition-all duration-500',
        'ease-[linear(0,0.1144,0.3475,0.5885,0.7844,0.9194,0.9987,1.0359,1.046,1.0413,1.0308,1.0196,1.0104,1.004,1.0002,0.9984,1)]',
        'motion-safe:hover:h-12',
        'motion-reduce:h-12',
        // Focus state
        'focus-visible:ring-ring focus:outline-none focus-visible:ring-2'
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
                // Animation with spring
                'transition-all duration-500',
                'ease-[linear(0,0.1144,0.3475,0.5885,0.7844,0.9194,0.9987,1.0359,1.046,1.0413,1.0308,1.0196,1.0104,1.004,1.0002,0.9984,1)]',
                'motion-safe:scale-75 motion-safe:opacity-0',
                'motion-safe:group-hover:scale-100 motion-safe:group-hover:opacity-100',
                // Reduced motion: always visible
                'motion-reduce:scale-100 motion-reduce:opacity-100'
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
