import type { TimelineEntry } from '@/types/timeline';
import type { Lang } from '@/i18n/config';

interface TimelineEntryWithTranslations {
  id: string;
  type: 'education' | 'work';
  startDate: string;
  endDate: string | null;
  tags?: string[];
  translations: {
    fr: { title: string; organization: string; description: string };
    en: { title: string; organization: string; description: string };
  };
}

const timelineDataWithTranslations: TimelineEntryWithTranslations[] = [
  {
    id: 'current-role',
    type: 'work',
    startDate: '2023-01',
    endDate: null,
    tags: ['React', 'TypeScript', 'Node.js', 'AWS'],
    translations: {
      fr: {
        title: 'Développeur Full-Stack',
        organization: 'Theodo',
        description:
          "Construction d'applications web à fort impact pour des clients dans la fintech et le e-commerce. Prise de décisions techniques et mentorat de développeurs juniors.",
      },
      en: {
        title: 'Full-Stack Developer',
        organization: 'Theodo',
        description:
          'Building high-impact web applications for clients across fintech and e-commerce. Leading technical decisions and mentoring junior developers.',
      },
    },
  },
  {
    id: 'previous-role',
    type: 'work',
    startDate: '2021-06',
    endDate: '2022-12',
    tags: ['Vue.js', 'Python', 'PostgreSQL'],
    translations: {
      fr: {
        title: 'Ingénieur Logiciel',
        organization: 'Entreprise précédente',
        description:
          'Développement et maintenance de fonctionnalités pour une plateforme SaaS. Amélioration des pipelines CI/CD et réduction du temps de déploiement de 40%.',
      },
      en: {
        title: 'Software Engineer',
        organization: 'Previous Company',
        description:
          'Developed and maintained customer-facing features for a SaaS platform. Improved CI/CD pipelines and reduced deployment time by 40%.',
      },
    },
  },
  {
    id: 'masters',
    type: 'education',
    startDate: '2019-09',
    endDate: '2021-06',
    tags: ['Algorithms', 'Distributed Systems', 'Research'],
    translations: {
      fr: {
        title: 'Master en Informatique',
        organization: "Nom de l'université",
        description:
          "Spécialisation en systèmes distribués et génie logiciel. Thèse sur les algorithmes d'édition collaborative en temps réel.",
      },
      en: {
        title: 'Master of Computer Science',
        organization: 'University Name',
        description:
          'Specialized in distributed systems and software engineering. Thesis on real-time collaborative editing algorithms.',
      },
    },
  },
  {
    id: 'bachelors',
    type: 'education',
    startDate: '2016-09',
    endDate: '2019-06',
    tags: ['Programming', 'Mathematics', 'Databases'],
    translations: {
      fr: {
        title: 'Licence en Informatique',
        organization: "Nom de l'université",
        description:
          "Fondamentaux de l'informatique, structures de données et pratiques de développement logiciel.",
      },
      en: {
        title: 'Bachelor of Computer Science',
        organization: 'University Name',
        description:
          'Foundation in computer science fundamentals, data structures, and software development practices.',
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
    tags: entry.tags,
    title: entry.translations[lang].title,
    organization: entry.translations[lang].organization,
    description: entry.translations[lang].description,
  }));
}
