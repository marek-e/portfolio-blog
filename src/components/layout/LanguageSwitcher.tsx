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
        'flex items-center gap-0.5 rounded-full border border-black/10 bg-white/55 p-0.5 shadow-[inset_0_1px_0_oklch(1_0_0/70%),0_1px_2px_oklch(0_0_0/6%)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-[inset_0_1px_0_oklch(1_0_0/8%)]',
        className
      )}
    >
      {(Object.keys(languages) as Lang[]).map((lang) => (
        <a
          key={lang}
          href={getAlternatePath(currentPath, currentLang, lang)}
          className={cn(
            'rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold transition-colors',
            lang === currentLang
              ? 'btn-radiant'
              : 'text-foreground/65 hover:text-foreground hover:bg-white/70 dark:hover:bg-white/10'
          )}
          aria-current={lang === currentLang ? 'page' : undefined}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
