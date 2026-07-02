import { useState } from 'react';
import type { Lang } from '@/i18n/config';
import type { WorldTranslations } from '@/i18n/translations/world';

export interface WorldProjectDTO {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
  imageUrl?: string;
  detailUrl: string;
}

interface ProjectsWorldProps {
  projects: WorldProjectDTO[];
  t: WorldTranslations;
  lang: Lang;
}

function detectSmallViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches;
}

export function ProjectsWorld({ projects, t, lang }: ProjectsWorldProps) {
  const [isSmallViewport] = useState(detectSmallViewport);
  const listUrl = lang === 'en' ? '/en/projects' : '/projects';

  if (isSmallViewport) {
    return (
      <section className="bg-card border-border mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">{t.teaser.title}</h2>
        <p className="text-muted-foreground">{t.teaser.body}</p>
        <a
          href={listUrl}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
        >
          {t.teaser.cta}
        </a>
      </section>
    );
  }

  // Desktop stub shell — throwaway placeholder replaced by the loading/entry screen + canvas in
  // slice 2. It renders the DTO delivered to the client, proving the build-time data pipeline end
  // to end (the "full data pipeline" half of the P0 route criterion).
  return (
    <section className="bg-card border-border mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl border p-8 text-center shadow-sm">
      <p className="text-muted-foreground animate-pulse">{t.entry.loading}</p>
      <ul className="text-foreground/80 grid w-full grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug} className="bg-muted rounded-md px-3 py-2">
            {project.title}
          </li>
        ))}
      </ul>
      <a
        href={listUrl}
        className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
      >
        {t.hud.viewAsList}
      </a>
    </section>
  );
}
