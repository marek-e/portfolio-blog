import { Contact01Icon, Folder, News, Presentation01Icon } from '@hugeicons/core-free-icons';
import type { Lang } from '@/i18n/config';
import { getTranslatedPath } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { PRESENTATIONS_URL } from '@/lib/sites';

export function getNavLinks(lang: Lang) {
  const t = getTranslations(lang);
  const translatePath = getTranslatedPath(lang);

  return [
    { href: translatePath('/projects'), label: t.nav.projects, icon: Folder },
    { href: translatePath('/blog'), label: t.nav.blog, icon: News },
    {
      href: PRESENTATIONS_URL,
      label: t.nav.presentations,
      icon: Presentation01Icon,
      external: true,
    },
    // { href: translatePath('/design-system'), label: t.nav.design, icon: WebDesign01Icon },
    { href: translatePath('/contact'), label: t.nav.contact, icon: Contact01Icon },
  ];
}
