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
    fr: { degree: string; institution: string; location: string };
    en: { degree: string; institution: string; location: string };
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
  profilePicture: '/images/profile.jpg', // TODO: Add your profile picture
  title: {
    fr: 'Développeur Full-Stack',
    en: 'Full-Stack Developer',
  },
  experience: [
    {
      id: 'current-role',
      startDate: '2023-01',
      endDate: null,
      translations: {
        fr: {
          title: 'Développeur Full-Stack',
          company: 'Theodo',
          location: 'Paris, France',
          description: [
            "Construction d'applications web à fort impact pour des clients dans la fintech et le e-commerce",
            'Prise de décisions techniques et mentorat de développeurs juniors',
            'Technologies utilisées : React, TypeScript, Node.js, AWS',
          ],
        },
        en: {
          title: 'Full-Stack Developer',
          company: 'Theodo',
          location: 'Paris, France',
          description: [
            'Building high-impact web applications for clients across fintech and e-commerce',
            'Leading technical decisions and mentoring junior developers',
            'Tech stack: React, TypeScript, Node.js, AWS',
          ],
        },
      },
    },
    {
      id: 'previous-role',
      startDate: '2021-06',
      endDate: '2022-12',
      translations: {
        fr: {
          title: 'Ingénieur Logiciel',
          company: 'Entreprise précédente',
          location: 'Paris, France',
          description: [
            'Développement et maintenance de fonctionnalités pour une plateforme SaaS',
            'Amélioration des pipelines CI/CD et réduction du temps de déploiement de 40%',
            'Technologies utilisées : Vue.js, Python, PostgreSQL',
          ],
        },
        en: {
          title: 'Software Engineer',
          company: 'Previous Company',
          location: 'Paris, France',
          description: [
            'Developed and maintained customer-facing features for a SaaS platform',
            'Improved CI/CD pipelines and reduced deployment time by 40%',
            'Tech stack: Vue.js, Python, PostgreSQL',
          ],
        },
      },
    },
  ],
  education: [
    {
      id: 'masters',
      startDate: '2019',
      endDate: '2021',
      translations: {
        fr: {
          degree: 'Master en Informatique',
          institution: "Nom de l'université",
          location: 'Paris, France',
        },
        en: {
          degree: 'Master of Computer Science',
          institution: 'University Name',
          location: 'Paris, France',
        },
      },
    },
    {
      id: 'bachelors',
      startDate: '2016',
      endDate: '2019',
      translations: {
        fr: {
          degree: 'Licence en Informatique',
          institution: "Nom de l'université",
          location: 'Paris, France',
        },
        en: {
          degree: 'Bachelor of Computer Science',
          institution: 'University Name',
          location: 'Paris, France',
        },
      },
    },
  ],
  skills: [
    {
      translations: {
        fr: {
          category: 'Frontend',
          skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js'],
        },
        en: {
          category: 'Frontend',
          skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js'],
        },
      },
    },
    {
      translations: {
        fr: {
          category: 'Backend',
          skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL'],
        },
        en: {
          category: 'Backend',
          skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL'],
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
        en: { language: '🇬🇧 English', level: 'Fluent (C1)' },
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
    degree: string;
    institution: string;
    location: string;
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
