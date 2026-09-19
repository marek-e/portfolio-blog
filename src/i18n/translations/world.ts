import type { Lang } from '@/i18n/config';

export interface WorldProject {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  status: 'completed' | 'in-progress' | 'archived' | 'concept';
  imageUrl: string;
  detailUrl: string;
}

export interface WorldTranslations {
  pageTitle: string;
  pageDescription: string;
  title: string;
  subtitle: string;
  enter: string;
  loading: string;
  loadError: string;
  retry: string;
  backToProjects: string;
  viewProject: string;
  close: string;
  explore: string;
  interact: string;
  move: string;
  controls: string;
  keyboardHint: string;
  teaserTitle: string;
  teaserDescription: string;
  canvasLabel: string;
  discovered: string;
  celebration: string;
  celebrationDescription: string;
  hints: string[];
  soundOn: string;
  soundOff: string;
  projectList: string;
  noProjects: string;
  moreProjects: string;
  footerLink: string;
  bannerTitle: string;
  bannerDescription: string;
  bannerCta: string;
  javascriptRequired: string;
  status: Record<WorldProject['status'], string>;
  props: Record<
    'desk' | 'bookshelf' | 'shoes' | 'library' | 'bench',
    {
      title: string;
      description: string;
    }
  >;
}

export interface ProjectsWorldProps {
  projects: WorldProject[];
  t: WorldTranslations;
  lang: Lang;
  developer?: { name: string; job: string; techStack: string[] };
}

export const worldTranslations: Record<Lang, WorldTranslations> = {
  fr: {
    pageTitle: "L'île de Marek | Marek Elmayan",
    pageDescription:
      'Promenez-vous dans un monde illustré pour découvrir mes projets et les idées qui les accompagnent.',
    title: "L'île de Marek",
    subtitle: 'Une promenade parmi mes projets.',
    enter: "Entrer sur l'île",
    loading: 'Le monde se prépare…',
    loadError:
      'Le monde n’a pas pu se charger. Vous pouvez réessayer ou consulter la liste des projets.',
    retry: 'Réessayer',
    backToProjects: 'Retour aux projets',
    viewProject: 'Découvrir le projet',
    close: 'Fermer',
    explore: 'Explorer',
    interact: 'Interagir',
    move: 'Se déplacer',
    controls: 'Commandes',
    keyboardHint:
      'Déplacez-vous avec les flèches ou WASD. Appuyez sur Entrée ou E pour interagir, et Échap pour fermer.',
    teaserTitle: 'Une île à explorer sur ordinateur',
    teaserDescription:
      "L'exploration se joue au clavier sur ordinateur. En attendant, vous pouvez découvrir tous les projets dans la liste.",
    canvasLabel: "L'île de Marek, un monde interactif à explorer au clavier",
    discovered: 'Projets découverts',
    celebration: "Vous avez fait le tour de l'île !",
    celebrationDescription:
      'Vous avez découvert tous les projets. Merci pour la visite, vous pouvez continuer à vous promener.',
    hints: [
      'Déplacez-vous avec les flèches ou WASD.',
      'Approchez-vous d’un projet, puis appuyez sur E ou Entrée pour le découvrir.',
      'Les objets aussi ont quelque chose à raconter.',
      'Appuyez sur M pour activer ou couper le son.',
    ],
    soundOn: 'Activer le son',
    soundOff: 'Couper le son',
    projectList: 'Les projets de ce monde',
    noProjects: 'Aucun projet pour le moment.',
    moreProjects: 'Autres projets',
    footerLink: "L'île de Marek",
    bannerTitle: 'Et si on se promenait ?',
    bannerDescription:
      'Mes projets prennent place dans un petit monde illustré. Entrez et faites un tour.',
    bannerCta: "Explorer l'île",
    javascriptRequired:
      'Activez JavaScript pour explorer le monde, ou consultez les projets ci-dessous.',
    status: {
      completed: 'Terminé',
      'in-progress': 'En cours',
      archived: 'Archivé',
      concept: 'Concept',
    },
    props: {
      desk: {
        title: 'Le bureau',
        description: 'C’est ici que les idées deviennent des projets, une ligne de code à la fois.',
      },
      bookshelf: {
        title: 'L’étagère',
        description: 'Des lectures, des notes et des idées à reprendre dans un prochain projet.',
      },
      shoes: {
        title: 'Les chaussures de course',
        description:
          'Une pause loin du clavier. Courir, prendre l’air, puis revenir avec les idées plus claires.',
      },
      library: {
        title: 'La bibliothèque',
        description:
          'La bibliothèque est encore fermée. Bientôt, vous pourrez y retrouver les articles du blog.',
      },
      bench: {
        title: 'Le banc',
        description:
          'Prenez un instant pour regarder autour de vous. Les projets peuvent attendre.',
      },
    },
  },
  en: {
    pageTitle: "Marek's Island | Marek Elmayan",
    pageDescription:
      'Walk through an illustrated world to discover my projects and the ideas behind them.',
    title: "Marek's Island",
    subtitle: 'A walk through my projects.',
    enter: 'Enter the island',
    loading: 'Getting the world ready…',
    loadError: 'The world could not load. Try again or browse the project list.',
    retry: 'Try again',
    backToProjects: 'Back to projects',
    viewProject: 'View project',
    close: 'Close',
    explore: 'Explore',
    interact: 'Interact',
    move: 'Move',
    controls: 'Controls',
    keyboardHint:
      'Move with the arrow keys or WASD. Press Enter or E to interact, and Escape to close.',
    teaserTitle: 'An island to explore on desktop',
    teaserDescription:
      'Exploration requires a desktop and keyboard. You can still discover every project in the list.',
    canvasLabel: "Marek's Island, an interactive world to explore with your keyboard",
    discovered: 'Projects discovered',
    celebration: 'You explored the whole island!',
    celebrationDescription:
      'You discovered every project. Thanks for visiting, and feel free to keep wandering.',
    hints: [
      'Move with the arrow keys or WASD.',
      'Walk up to a project, then press E or Enter to discover it.',
      'The objects have stories to tell, too.',
      'Press M to turn sound on or off.',
    ],
    soundOn: 'Turn sound on',
    soundOff: 'Mute sound',
    projectList: 'Projects in this world',
    noProjects: 'No projects yet.',
    moreProjects: 'More projects',
    footerLink: "Marek's Island",
    bannerTitle: 'Shall we take a walk?',
    bannerDescription:
      'My projects have a little illustrated world of their own. Come in and look around.',
    bannerCta: 'Explore the island',
    javascriptRequired: 'Enable JavaScript to explore the world, or browse the projects below.',
    status: {
      completed: 'Completed',
      'in-progress': 'In progress',
      archived: 'Archived',
      concept: 'Concept',
    },
    props: {
      desk: {
        title: 'The desk',
        description: 'Where ideas become projects, one line of code at a time.',
      },
      bookshelf: {
        title: 'The bookshelf',
        description: 'Books, notes and ideas to return to in a future project.',
      },
      shoes: {
        title: 'The running shoes',
        description:
          'A break from the keyboard. Go for a run, get some fresh air, then come back with a clearer head.',
      },
      library: {
        title: 'The library',
        description: 'The library is still closed. Blog articles will be available here soon.',
      },
      bench: {
        title: 'The bench',
        description: 'Take a moment to look around. The projects can wait.',
      },
    },
  },
};
