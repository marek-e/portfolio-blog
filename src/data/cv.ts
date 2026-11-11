import type { Lang } from '@/i18n/config';

interface CVExperience {
  id: string;
  startDate: string;
  endDate: string | null;
  translations: {
    fr: { title: string; company: string; location: string; description: string[] };
    en: { title: string; company: string; location: string; description: string[] };
  };
}

interface CVEducation {
  id: string;
  startDate: string;
  endDate: string;
  translations: {
    fr: { degree: string; institution: string; location: string; note?: string };
    en: { degree: string; institution: string; location: string; note?: string };
  };
}

interface CVSkillCategory {
  translations: {
    fr: { category: string; skills: string[] };
    en: { category: string; skills: string[] };
  };
}

interface CVLanguage {
  translations: {
    fr: { language: string; level: string };
    en: { language: string; level: string };
  };
}

interface CVHobby {
  icon: string;
  translations: {
    fr: string;
    en: string;
  };
}

interface CVData {
  name: string;
  email: string;
  phone: string;
  location: { fr: string; en: string };
  linkedin: string;
  github: string;
  website: string;
  profilePicture: string;
  title: { fr: string; en: string };
  summary: { fr: string; en: string };
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkillCategory[];
  languages: CVLanguage[];
  hobbies: CVHobby[];
}

const cvData: CVData = {
  name: 'Marek Elmayan',
  email: 'elmayan.marek@gmail.com',
  phone: '+33 6 XX XX XX XX',
  location: {
    fr: 'Paris, France',
    en: 'Paris, France',
  },
  linkedin: 'linkedin.com/in/marek-elmayan',
  github: 'github.com/marek-e',
  website: 'melmayan.fr',
  profilePicture: '/images/profile.jpg',
  title: {
    fr: 'Ingénieur logiciel & AI Tech Lead',
    en: 'Software Engineer & AI Tech Lead',
  },
  summary: {
    fr: "Ingénieur logiciel full-stack chez Theodo depuis 2023, aujourd'hui en rôle d'AI Tech Lead. Je développe des produits avec des agents de programmation, principalement Claude Code et ponctuellement Codex. Mon travail porte sur la qualité des bases de code, les règles de lint, la sécurité et l'amélioration continue d'un workflow allant des exigences produit à la pull request.",
    en: 'Full-stack software engineer at Theodo since 2023, now acting as an AI Tech Lead. I build products with coding agents, mainly Claude Code and occasionally Codex. My work focuses on codebase quality, lint rules, security, and improving a workflow that takes product requirements through to a pull request.',
  },
  experience: [
    {
      id: 'theodo',
      startDate: '2023-01',
      endDate: null,
      translations: {
        fr: {
          title: 'Ingénieur logiciel / AI Tech Lead',
          company: 'Theodo',
          location: 'Paris, France',
          description: [
            "Développement de produits avec une fabrique d'agents de programmation, principalement Claude Code et ponctuellement Codex",
            "Planification avec les agents à partir de documents d'exigences produit (PRD), puis implémentation, validation et ouverture de pull requests autonomes dans un environnement de développement cloud",
            'Préparation des bases de code pour les agents avec des règles de lint et des contrôles automatisés de qualité du code',
            'Audits de sécurité des bases de code et amélioration continue du workflow de développement avec les agents',
            "Développement d'applications web full-stack et décisions d'architecture pour des clients variés",
            "Stage à partir de janvier 2023, ingénieur full-stack depuis septembre 2023, puis prise récente de responsabilités d'AI Tech Lead",
          ],
        },
        en: {
          title: 'Software Engineer / AI Tech Lead',
          company: 'Theodo',
          location: 'Paris, France',
          description: [
            'Building products with a coding-agent factory, mainly using Claude Code and occasionally Codex',
            'Planning with agents from product requirements documents (PRDs), followed by autonomous implementation, validation, and pull request creation in a cloud development environment',
            'Preparing codebases for coding agents through lint rules and automated code-quality checks',
            'Auditing codebase security and continuously improving the agent development workflow',
            'Developing full-stack web applications and making architecture decisions for various clients',
            'Joined as an intern in January 2023, became a full-stack software engineer in September 2023, and recently took on AI Tech Lead responsibilities',
          ],
        },
      },
    },
    {
      id: 'schneider-electric',
      startDate: '2021-06',
      endDate: '2021-08',
      translations: {
        fr: {
          title: 'Stage Assistant Ingénieur ',
          company: 'Schneider Electric',
          location: 'Písek, République Tchèque',
          description: [
            "Déploiement d'outils de digitalisation au sein du département qualité et satisfaction client",
            "Développement de programmes pour l'automatisation de mesures 3D sur pièces critiques",
            "Développement d'une application Power Apps pour le suivi de maintenance des équipements",
          ],
        },
        en: {
          title: 'Assistant Engineer Intern',
          company: 'Schneider Electric',
          location: 'Písek, Czech Republic',
          description: [
            'Supported deployment of digitalization tools in quality and customer satisfaction department',
            'Developed programs for automated 3D measurements on critical parts',
            'Built a Power Apps application for equipment maintenance tracking',
          ],
        },
      },
    },
  ],
  education: [
    {
      id: 'ensimag',
      startDate: '2020-09',
      endDate: '2023-06',
      translations: {
        fr: {
          degree: "Diplôme d'Ingénieur en Informatique et Mathématiques Appliquées",
          institution: 'Grenoble INP - Ensimag, UGA',
          location: 'Grenoble, France',
          note: "École d'ingénieurs de référence en informatique et mathématiques appliquées. Filière Ingénierie des systèmes d'information (ISI).",
        },
        en: {
          degree: 'Engineering Degree in Computer Science & Applied Mathematics',
          institution: 'Grenoble INP - Ensimag, UGA',
          location: 'Grenoble, France',
          note: 'Top French engineering school in CS and applied mathematics',
        },
      },
    },
    {
      id: 'aalto',
      startDate: '2022-09',
      endDate: '2022-12',
      translations: {
        fr: {
          degree: "Semestre d'échange",
          institution: 'Aalto University',
          location: 'Helsinki, Finlande',
        },
        en: {
          degree: 'Exchange Semester',
          institution: 'Aalto University',
          location: 'Helsinki, Finland',
          note: 'Exchange semester in Helsinki, Finland. Computer Science Master courses.',
        },
      },
    },
    {
      id: 'cpge',
      startDate: '2018-09',
      endDate: '2020-06',
      translations: {
        fr: {
          degree: 'CPGE PCSI/PSI*',
          institution: 'Lycée Chateaubriand',
          location: 'Rennes, France',
          note: 'Classes préparatoires aux grandes écoles',
        },
        en: {
          degree: 'Preparatory Classes (Math & Physics)',
          institution: 'Lycée Chateaubriand',
          location: 'Rennes, France',
          note: 'Intensive 2-year program for top engineering school entrance exams',
        },
      },
    },
  ],
  skills: [
    {
      translations: {
        fr: {
          category: 'Développement assisté par IA',
          skills: ['Claude Code', 'Codex', 'Agents de programmation autonomes'],
        },
        en: {
          category: 'AI-assisted development',
          skills: ['Claude Code', 'Codex', 'Autonomous coding agents'],
        },
      },
    },
    {
      translations: {
        fr: {
          category: 'Frontend',
          skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Astro', 'HTML', 'CSS'],
        },
        en: {
          category: 'Frontend',
          skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Astro', 'HTML', 'CSS'],
        },
      },
    },
    {
      translations: {
        fr: {
          category: 'Backend',
          skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL', 'AWS Serverless'],
        },
        en: {
          category: 'Backend',
          skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL', 'AWS Serverless'],
        },
      },
    },
    {
      translations: {
        fr: {
          category: 'Outils',
          skills: ['Git', 'Docker', 'AWS', 'CI/CD', 'Agile'],
        },
        en: {
          category: 'Tools',
          skills: ['Git', 'Docker', 'AWS', 'CI/CD', 'Agile'],
        },
      },
    },
  ],
  languages: [
    {
      translations: {
        fr: { language: '🇫🇷 Français', level: 'Natif' },
        en: { language: '🇫🇷 French', level: 'Native' },
      },
    },
    {
      translations: {
        fr: { language: '🇨🇿 Tchèque', level: 'Natif' },
        en: { language: '🇨🇿 Czech', level: 'Native' },
      },
    },
    {
      translations: {
        fr: { language: '🇬🇧 Anglais', level: 'Courant (C1)' },
        en: { language: '🇬🇧 English', level: 'Fluent' },
      },
    },
  ],
  hobbies: [
    {
      icon: '🏃',
      translations: { fr: 'Course à pied', en: 'Running' },
    },
    {
      icon: '🤾',
      translations: { fr: 'Handball', en: 'Handball' },
    },
    {
      icon: '🎮',
      translations: { fr: 'Jeux vidéo', en: 'Video Games' },
    },
    {
      icon: '✈️',
      translations: { fr: 'Voyages', en: 'Traveling' },
    },
  ],
};

export interface LocalizedCV {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  profilePicture: string;
  title: string;
  summary: string;
  experience: {
    id: string;
    startDate: string;
    endDate: string | null;
    title: string;
    company: string;
    location: string;
    description: string[];
  }[];
  education: {
    id: string;
    startDate: string;
    endDate: string;
    highlight?: boolean;
    degree: string;
    institution: string;
    location: string;
    note?: string;
  }[];
  skills: { category: string; skills: string[] }[];
  languages: { language: string; level: string }[];
  hobbies: { icon: string; name: string }[];
}

export function getLocalizedCV(lang: Lang): LocalizedCV {
  return {
    name: cvData.name,
    email: cvData.email,
    phone: cvData.phone,
    location: cvData.location[lang],
    linkedin: cvData.linkedin,
    github: cvData.github,
    website: cvData.website,
    profilePicture: cvData.profilePicture,
    title: cvData.title[lang],
    summary: cvData.summary[lang],
    experience: cvData.experience.map((exp) => ({
      id: exp.id,
      startDate: exp.startDate,
      endDate: exp.endDate,
      ...exp.translations[lang],
    })),
    education: cvData.education.map((edu) => ({
      id: edu.id,
      startDate: edu.startDate,
      endDate: edu.endDate,
      ...edu.translations[lang],
    })),
    skills: cvData.skills.map((cat) => cat.translations[lang]),
    languages: cvData.languages.map((l) => l.translations[lang]),
    hobbies: cvData.hobbies.map((h) => ({ icon: h.icon, name: h.translations[lang] })),
  };
}
