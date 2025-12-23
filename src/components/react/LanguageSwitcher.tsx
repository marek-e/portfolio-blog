import { getAlternatePath, languages, type Lang } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  currentLang: Lang;
  currentPath: string;
}

export function LanguageSwitcher({ currentLang, currentPath }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-white/20 bg-white/10 p-0.5 backdrop-blur-sm dark:border-white/10 dark:bg-black/30">
      {(Object.keys(languages) as Lang[]).map((lang) => (
        <a
          key={lang}
          href={getAlternatePath(currentPath, currentLang, lang)}
          className={cn(
            'rounded-full px-2 py-1 text-xs font-medium transition-colors',
            lang === currentLang
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground/70 hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10'
          )}
          aria-current={lang === currentLang ? 'page' : undefined}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
