import { getAlternatePath, languages, type Lang } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  currentLang: Lang;
  currentPath: string;
  className?: string;
}

export function LanguageSwitcher({ currentLang, currentPath, className }: LanguageSwitcherProps) {
  return (
    <div className={cn('glass flex items-center gap-0.5 rounded-full p-1', className)}>
      {(Object.keys(languages) as Lang[]).map((lang) => (
        <a
          key={lang}
          href={getAlternatePath(currentPath, currentLang, lang)}
          className={cn(
            'flex h-9 min-w-11 items-center justify-center rounded-full px-3 font-mono text-xs font-medium tracking-wide transition-colors',
            lang === currentLang
              ? 'bg-foreground text-background'
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
          )}
          aria-current={lang === currentLang ? 'page' : undefined}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
