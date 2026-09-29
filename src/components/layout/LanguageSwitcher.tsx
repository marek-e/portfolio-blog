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
        'flex items-center gap-0.5 rounded-full border border-black/10 bg-white/55 p-0.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5',
        className
      )}
    >
      {(Object.keys(languages) as Lang[]).map((lang) => (
        <a
          key={lang}
          href={getAlternatePath(currentPath, currentLang, lang)}
          className={cn(
            'relative rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold transition-colors',
            lang === currentLang
              ? 'btn-radiant [--radiant-core:transparent]'
              : 'text-foreground/65 hover:text-primary hover:bg-primary/10'
          )}
          aria-current={lang === currentLang ? 'page' : undefined}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
