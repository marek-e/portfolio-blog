import { getAlternatePath, languages, type Lang } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  currentLang: Lang;
  currentPath: string;
  className?: string;
  variant?: 'glass' | 'classic';
}

export function LanguageSwitcher({
  currentLang,
  currentPath,
  className,
  variant = 'glass',
}: LanguageSwitcherProps) {
  return (
    <div
      className={cn(
        variant === 'glass'
          ? 'language-switcher liquid-glass relative flex items-center gap-0.5 rounded-full p-0.5'
          : 'flex items-center gap-0.5 rounded-full border border-black/10 bg-white/55 p-0.5 backdrop-blur-md dark:border-white/10 dark:bg-white/5',
        className
      )}
    >
      {(Object.keys(languages) as Lang[]).map((lang) => (
        <a
          key={lang}
          href={getAlternatePath(currentPath, currentLang, lang)}
          className={
            variant === 'glass'
              ? 'language-option'
              : cn(
                  'relative inline-flex h-7 min-w-11 items-center justify-center rounded-full border border-transparent px-2.5 text-xs font-semibold transition-colors max-md:h-11',
                  lang === currentLang
                    ? 'btn-radiant [--radiant-core:transparent]'
                    : 'text-foreground/65 hover:text-primary hover:bg-primary/10'
                )
          }
          aria-current={lang === currentLang ? 'page' : undefined}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
