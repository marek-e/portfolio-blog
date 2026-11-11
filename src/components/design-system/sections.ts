import type { Lang } from '@/i18n';

export const designSystemSections = [
  {
    id: 'foundations',
    fr: {
      title: 'Couleurs & caractères',
      description: 'Les couleurs, les polices et les traits qui relient toutes les pages.',
    },
    en: {
      title: 'Colour & character',
      description: 'The colours, typefaces and hand-drawn marks shared by every page.',
    },
  },
  {
    id: 'materials',
    fr: {
      title: 'Matières & relief',
      description:
        "Des surfaces pleines pour la lecture. Du verre pour les moments forts de l'accueil.",
    },
    en: {
      title: 'Surfaces & depth',
      description: 'Solid surfaces for reading. Glass for highlights on the homepage.',
    },
  },
  {
    id: 'actions',
    fr: {
      title: 'Boutons & repères',
      description:
        'Une action principale par contexte, des alternatives plus discrètes et des badges lisibles.',
    },
    en: {
      title: 'Actions & labels',
      description: 'One primary action per context, quieter alternatives and readable badges.',
    },
  },
  {
    id: 'forms',
    fr: {
      title: 'Saisie & sélection',
      description:
        'Des libellés explicites, une aide à proximité et des erreurs faciles à corriger.',
    },
    en: {
      title: 'Input & selection',
      description: 'Clear labels, nearby guidance and errors that are easy to correct.',
    },
  },
  {
    id: 'overlays',
    fr: {
      title: 'Menus & dialogues',
      description: 'Des interactions à essayer à la souris, au clavier ou au toucher.',
    },
    en: {
      title: 'Menus & dialogs',
      description: 'Interactions to try with a pointer, a keyboard or touch.',
    },
  },
  {
    id: 'content',
    fr: {
      title: 'Contenu & navigation',
      description:
        'Les mêmes règles de composition pour les projets, le blog et les pages de lecture.',
    },
    en: {
      title: 'Content & navigation',
      description: 'The same composition rules for projects, the blog and reading pages.',
    },
  },
] as const;

export type DesignSystemGroup = (typeof designSystemSections)[number]['id'];

export function getDesignSystemSections(lang: Lang) {
  return designSystemSections.map((section, index) => ({
    id: section.id,
    number: String(index + 1).padStart(2, '0'),
    ...section[lang],
  }));
}
