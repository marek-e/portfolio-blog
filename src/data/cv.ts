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
    fr: 'Nantes, France',
    en: 'Nantes, France',
  },
  linkedin: 'linkedin.com/in/marek-elmayan',
  github: 'github.com/marek-e',
  website: 'melmayan.fr',
  profilePicture: '/images/profile.jpg',
  title: {
    fr: 'Ingénieur Logiciel Full-Stack',
    en: 'Full-Stack Software Engineer',
  },
  experience: [
    {
      id: 'theodo',
      startDate: '2023-01',
      endDate: null,
      translations: {
        fr: {
          title: 'Ingénieur Logiciel Full-Stack',
          company: 'Theodo',
          location: 'Nantes, France',
          description: [
            "Développement d'applications web à fort impact pour des clients variés",
            'Prise de décisions techniques et accompagnement de développeurs juniors',
            'Gestion de projet suivant les principes Agile & Lean Tech',
            'Workflows de développement assistés par IA',
            'Audit de sécurité web et implémentation',
          ],
        },
        en: {
          title: 'Full-Stack Software Engineer',
          company: 'Theodo',
          location: 'Nantes, France',
          description: [
            'Building high-impact web applications for various clients',
            'Leading technical decisions and mentoring junior developers',
            'Project management following Agile & Lean Tech principles',
            'AI assisted development workflows',
            'Web security audit and implementation',
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
          note: "École d'ingénieurs de référence en informatique et mathématiques appliquées",
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
