import { fr } from './translations/fr';
import { en } from './translations/en';
import type { Lang } from './config';
import type { UITranslations } from './ui';

const translations: Record<Lang, UITranslations> = { fr, en };

export function getTranslations(lang: Lang): UITranslations {
  return translations[lang];
}

// For React components - get translations based on client-side URL detection
export function useClientTranslations(): UITranslations {
  // This will be called on client side, so we can safely use window
  if (typeof window === 'undefined') return translations.fr;
  const [, lang] = window.location.pathname.split('/');
  if (lang === 'en') return translations.en;
  return translations.fr;
}

export {
  languages,
  defaultLang,
  getLangFromUrl,
  getTranslatedPath,
  getAlternatePath,
  getLangFromClient,
  getCurrentPath,
} from './config';
export type { Lang } from './config';
export type { UITranslations } from './ui';
