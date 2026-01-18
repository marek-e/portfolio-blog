import type { TimelineEntry } from '@/types/timeline';
import type { Lang } from '@/i18n/config';

interface TimelineEntryWithTranslations {
  id: string;
  type: 'education' | 'work';
  startDate: string;
  endDate: string | null;
  logo?: string;
  tags?: string[];
  logoInverted?: boolean;
  link?: string;
  translations: {
    fr: { title: string; organization: string; description: string };
    en: { title: string; organization: string; description: string };
  };
}

const timelineDataWithTranslations: TimelineEntryWithTranslations[] = [
  {
    id: 'theodo',
    type: 'work',
    startDate: '2023-01',
    endDate: null,
    tags: ['React', 'TypeScript', 'Node.js', 'AWS', 'Agile'],
    logo: '/icons/theodo_logo.svg',
    link: 'https://www.theodo.fr',
    translations: {
      fr: {
        title: 'Ingénieur Logiciel Full-Stack',
        organization: 'Theodo',
        description:
          "Développement d'applications web à fort impact pour des clients variés. Prise de décisions techniques et accompagnement de développeurs juniors. Gestion de projet suivant les principes Agile & Lean Tech.",
      },
      en: {
        title: 'Full-Stack Software Engineer',
        organization: 'Theodo',
        description:
          'Building high-impact web applications for various clients. Leading technical decisions and mentoring junior developers. Project management following Agile & Lean Tech principles.',
      },
    },
  },
  {
    id: 'ensimag',
    type: 'education',
    startDate: '2020-09',
    endDate: '2023-06',
    tags: ['Algorithms', 'Computer Science', 'Applied Mathematics'],
    logo: '/icons/ensimag_logo.png',
    link: 'https://ensimag.grenoble-inp.fr',
    translations: {
      fr: {
        title: "Diplôme d'Ingénieur en Informatique et Mathématiques Appliquées",
        organization: 'Grenoble INP - Ensimag, UGA',
        description: "École d'ingénieurs de référence en informatique et mathématiques appliquées.",
      },
      en: {
        title: 'Engineering Degree in Computer Science & Applied Mathematics',
        organization: 'Grenoble INP - Ensimag, UGA',
        description: 'Top French engineering school in CS and applied mathematics.',
      },
    },
  },
  {
    id: 'aalto',
    type: 'education',
    startDate: '2022-09',
    endDate: '2022-12',
    tags: ['Exchange', 'International'],
    logo: '/icons/aalto_logo.png',
    logoInverted: true,
    link: 'https://www.aalto.fi',
    translations: {
      fr: {
        title: "Semestre d'échange",
        organization: 'Aalto University',
        description: "Semestre d'échange académique à Helsinki, Finlande.",
      },
      en: {
        title: 'Exchange Semester',
        organization: 'Aalto University',
        description: 'Academic exchange semester in Helsinki, Finland.',
      },
    },
  },
  {
    id: 'schneider-electric',
    type: 'work',
    startDate: '2021-06',
    endDate: '2021-08',
    tags: ['Python', 'Power Apps', 'Automation'],
    logo: '/icons/se_logo.png',
    link: 'https://www.se.com',
    translations: {
      fr: {
        title: 'Stage Assistant Ingénieur',
        organization: 'Schneider Electric',
        description:
          "Déploiement d'outils de digitalisation au sein du département qualité. Développement de programmes pour l'automatisation de mesures 3D et d'une application Power Apps pour le suivi de maintenance.",
      },
      en: {
        title: 'Assistant Engineer Intern',
        organization: 'Schneider Electric',
        description:
          'Deployment of digitalization tools in quality department. Developed programs for automated 3D measurements and a Power Apps application for equipment maintenance tracking.',
      },
    },
  },
  {
    id: 'cpge',
    type: 'education',
    startDate: '2018-09',
    endDate: '2020-06',
    tags: ['Mathematics', 'Physics', 'Preparatory Classes'],
    translations: {
      fr: {
        title: 'CPGE PCSI/PSI*',
        organization: 'Lycée Chateaubriand',
        description: "Classes préparatoires aux grandes écoles d'ingénieurs.",
      },
      en: {
        title: 'Preparatory Classes (Math & Physics)',
        organization: 'Lycée Chateaubriand',
        description: 'Intensive 2-year program for top engineering school entrance exams.',
      },
    },
  },
];

export function getLocalizedTimeline(lang: Lang): TimelineEntry[] {
  return timelineDataWithTranslations.map((entry) => ({
    id: entry.id,
    type: entry.type,
    startDate: entry.startDate,
    endDate: entry.endDate,
    logo: entry.logo,
    logoInverted: entry.logoInverted,
    tags: entry.tags,
    link: entry.link,
    title: entry.translations[lang].title,
    organization: entry.translations[lang].organization,
    description: entry.translations[lang].description,
  }));
}
