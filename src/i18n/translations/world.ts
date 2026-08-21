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
    /** Rotating loading-screen hints. */
    hints: string[];
    errorTitle: string;
    errorBody: string;
    retry: string;
  };
  /** aria-label for the game canvas region. */
  canvasLabel: string;
  hud: {
    viewAsList: string;
    /** Template with {count} and {total} placeholders. */
    discovered: string;
    mute: string;
    unmute: string;
  };
  hints: {
    move: string;
  };
  card: {
    viewProject: string;
    status: Record<string, string>;
  };
  props: {
    desk: { title: string };
    bookshelf: { title: string; body: string };
    shoes: { title: string; body: string };
    library: { title: string; body: string };
    bench: { title: string; body: string; congrats: string };
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
    hints: [
      'Déplacez-vous avec ZQSD ou les flèches',
      'Appuyez sur E pour interagir',
      'Six projets se cachent sur l’île',
      'M coupe ou réactive le son',
    ],
    errorTitle: "L'île est injoignable",
    errorBody:
      'Le chargement a échoué ou prend trop de temps. Réessayez, ou consultez les projets dans la liste classique.',
    retry: 'Réessayer',
  },
  canvasLabel:
    "L'île de Marek — un monde 2D interactif. Déplacez-vous au clavier et appuyez sur E pour découvrir les projets.",
  hud: {
    viewAsList: 'Voir la liste',
    discovered: 'Projets découverts : {count}/{total}',
    mute: 'Couper le son (M)',
    unmute: 'Réactiver le son (M)',
  },
  hints: {
    move: 'Déplacez-vous avec ZQSD ou les flèches',
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
  props: {
    desk: {
      title: 'Le bureau',
    },
    bookshelf: {
      title: 'La bibliothèque',
      body: 'Apprendre, écrire, recommencer. Un coin blog se prépare sur ces étagères — les meilleures idées viennent souvent en lisant celles des autres.',
    },
    shoes: {
      title: 'Chaussures de course',
      body: "Toujours prêtes pour un footing le long de la côte. Entre deux commits, c'est ici que les bugs se résolvent tout seuls.",
    },
    library: {
      title: 'Bibliothèque du village',
      body: 'Fermée pour le moment — le coin lecture ouvrira bientôt ses portes. Revenez explorer plus tard !',
    },
    bench: {
      title: 'Le banc du belvédère',
      body: "On voit toute la mer d'ici. Un bon endroit pour souffler entre deux découvertes.",
      congrats:
        "Vous avez tout vu — les six projets de l'île sont découverts. Merci d'avoir pris le temps d'explorer ! 🌊",
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
    hints: [
      'Move with WASD or the arrow keys',
      'Press E to interact',
      'Six projects are hiding on the island',
      'M toggles the sound',
    ],
    errorTitle: 'The island is unreachable',
    errorBody:
      'Loading failed or is taking too long. Try again, or browse the projects in the classic list.',
    retry: 'Try again',
  },
  canvasLabel:
    "Marek's Island — an interactive 2D world. Walk with the keyboard and press E to discover the projects.",
  hud: {
    viewAsList: 'View as list',
    discovered: 'Projects discovered: {count}/{total}',
    mute: 'Mute sound (M)',
    unmute: 'Unmute sound (M)',
  },
  hints: {
    move: 'Move with WASD or the arrow keys',
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
  props: {
    desk: {
      title: 'The desk',
    },
    bookshelf: {
      title: 'The bookshelf',
      body: 'Learn, write, repeat. A blog corner is brewing on these shelves — the best ideas often come from reading everyone else’s.',
    },
    shoes: {
      title: 'Running shoes',
      body: 'Always ready for a run along the coast. Between two commits, this is where bugs fix themselves.',
    },
    library: {
      title: 'Village library',
      body: 'Closed for now — the reading corner opens its doors soon. Come back and explore later!',
    },
    bench: {
      title: 'The viewpoint bench',
      body: 'You can see the whole sea from here. A good spot to catch your breath between discoveries.',
      congrats:
        'You’ve seen it all — every project on the island is discovered. Thanks for taking the time to explore! 🌊',
    },
  },
};

export const worldTranslations = { fr, en } as const;
