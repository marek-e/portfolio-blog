import { getAlternatePath, languages, type Lang } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  currentLang: Lang;
  currentPath: string;
  className?: string;
}

export function LanguageSwitcher({ currentLang, currentPath, className }: LanguageSwitcherProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 rounded-full border border-black/20 bg-white/10 p-0.5 backdrop-blur-sm dark:border-white/10 dark:bg-black/30',
        className
      )}
    >
      {(Object.keys(languages) as Lang[]).map((lang) => (
        <a
          key={lang}
          href={getAlternatePath(currentPath, currentLang, lang)}
          className={cn(
            'rounded-full px-2 py-1 text-xs font-bold transition-colors',
            lang === currentLang
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground/70 hover:text-foreground hover:bg-primary/20'
          )}
          aria-current={lang === currentLang ? 'page' : undefined}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
