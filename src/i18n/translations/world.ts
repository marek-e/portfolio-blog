// Projects World i18n — deliberately isolated from the shared `fr.ts`/`en.ts` modules.
// `MobileMenu` is `client:load` on every page and statically imports `getTranslations`, which
// pulls both shared translation files into a client chunk site-wide. Adding world strings there
// would break the "every other page unchanged (bundle diff = 0)" P0 criterion. This module is
// imported ONLY by `world.astro`, which selects the language slice and passes it to the island.
// See docs/feature/projetcts-world/projects-world-p0-plan.md decision 10 (deviates from PRD §9.5).

export interface WorldTranslations {
  pageTitle: string;
  pageDescription: string;
  heading: string;
  intro: string;
  teaser: {
    title: string;
    body: string;
    cta: string;
  };
  entry: {
    loading: string;
    enter: string;
  };
  hud: {
    viewAsList: string;
  };
  card: {
    viewProject: string;
    status: Record<string, string>;
  };
}

const fr: WorldTranslations = {
  pageTitle: "L'île de Marek | Projets",
  pageDescription:
    'Explorez une petite île interactive en 2D pour découvrir tous les projets de Marek Elmayan.',
  heading: "L'île de Marek",
  intro:
    'Une île interactive où chaque projet devient un lieu à explorer. À parcourir au clavier depuis un ordinateur.',
  teaser: {
    title: "L'île de Marek",
    body: 'Cette île interactive est conçue pour les grands écrans. Retrouvez tous les projets dans la liste classique en attendant la version mobile.',
    cta: 'Voir la liste des projets',
  },
  entry: {
    loading: "Chargement de l'île…",
    enter: "Entrer sur l'île",
  },
  hud: {
    viewAsList: 'Voir la liste',
  },
  card: {
    viewProject: 'Voir le projet complet',
    // Mirrors the shared projectsPage status wording (kept in sync manually — this module
    // must stay isolated from the shared translation files, see header comment).
    status: {
      completed: 'Terminé',
      'in-progress': 'En cours',
      archived: 'Archivé',
      concept: 'Concept',
    },
  },
};

const en: WorldTranslations = {
  pageTitle: "Marek's Island | Projects",
  pageDescription:
    "Explore a small interactive 2D island to discover all of Marek Elmayan's projects.",
  heading: "Marek's Island",
  intro:
    'An interactive island where every project becomes a place to explore. Best walked with a keyboard on a desktop.',
  teaser: {
    title: "Marek's Island",
    body: 'This interactive island is built for larger screens. Browse every project in the classic list while the mobile version is on its way.',
    cta: 'View the projects list',
  },
  entry: {
    loading: 'Loading the island…',
    enter: 'Enter the island',
  },
  hud: {
    viewAsList: 'View as list',
  },
  card: {
    viewProject: 'View full project',
    status: {
      completed: 'Completed',
      'in-progress': 'In Progress',
      archived: 'Archived',
      concept: 'Concept',
    },
  },
};

export const worldTranslations = { fr, en } as const;
