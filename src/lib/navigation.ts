import { Contact01Icon, Folder, News, WebDesign01Icon } from '@hugeicons/core-free-icons';
import type { Lang } from '@/i18n/config';
import { getTranslatedPath } from '@/i18n/config';
import { getTranslations } from '@/i18n';

export function getNavLinks(lang: Lang) {
  const t = getTranslations(lang);
  const translatePath = getTranslatedPath(lang);

  return [
    { href: translatePath('/projects'), label: t.nav.projects, icon: Folder },
    { href: translatePath('/blog'), label: t.nav.blog, icon: News },
    { href: translatePath('/design-system'), label: t.nav.design, icon: WebDesign01Icon },
    { href: translatePath('/contact'), label: t.nav.contact, icon: Contact01Icon },
  ];
}
