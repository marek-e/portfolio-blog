export const languages = {
  fr: 'Français',
  en: 'English',
} as const;

export const defaultLang = 'fr' as const;

export type Lang = keyof typeof languages;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function getTranslatedPath(lang: Lang) {
  return function translatePath(path: string): string {
    return lang === defaultLang ? path : `/${lang}${path}`;
  };
}

export function getAlternatePath(currentPath: string, currentLang: Lang, targetLang: Lang): string {
  if (currentLang === 'fr') {
    // Currently French (no prefix), switch to English
    return targetLang === 'en' ? `/en${currentPath}` : currentPath;
  } else {
    // Currently English (/en prefix), switch to French
    const pathWithoutLang = currentPath.replace(/^\/en/, '') || '/';
    return targetLang === 'fr' ? pathWithoutLang : currentPath;
  }
}

// For React components running on client - detect from window.location
export function getLangFromClient(): Lang {
  if (typeof window === 'undefined') return defaultLang;
  const [, lang] = window.location.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
}
