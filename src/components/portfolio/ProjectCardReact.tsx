import type { CSSProperties } from 'react';
import { Link } from '@/components/ui/button';
import { Card3D } from '@/components/ui/card-3d';
import { cn, pickByHash } from '@/lib/utils';
import '@/styles/project-card.css';

export interface ProjectData {
  title: string;
  description: string;
  techStack: string[];
  links?: {
    demo?: string;
    repo?: string;
  };
  image?: string;
  imageAlt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  imagePadding: number;
}

interface ProjectCardReactProps {
  project: ProjectData;
  projectUrl: string;
  translations: {
    liveDemo: string;
    code: string;
    viewDetails: string;
  };
}

const PANEL_TONES = [
  'from-pastel-peach/70 to-pastel-rose/50 dark:from-pastel-peach/14 dark:to-pastel-rose/8',
  'from-pastel-sky/70 to-pastel-lilac/50 dark:from-pastel-sky/14 dark:to-pastel-lilac/8',
  'from-pastel-mint/70 to-pastel-sky/45 dark:from-pastel-mint/14 dark:to-pastel-sky/8',
  'from-pastel-lilac/70 to-pastel-rose/45 dark:from-pastel-lilac/14 dark:to-pastel-rose/8',
  'from-pastel-butter/80 to-pastel-peach/50 dark:from-pastel-butter/14 dark:to-pastel-peach/8',
] as const;

export function ProjectCardReact({ project, projectUrl, translations }: ProjectCardReactProps) {
  const { title, description, techStack, links, image, imageAlt, objectFit, imagePadding } =
    project;
  const isContained = objectFit === 'contain' || objectFit === 'scale-down';
  const hiddenTechCount = techStack.length - 3;

  return (
    <Card3D
      as="article"
      variant="glass"
      className="project-card h-full gap-0 p-3 sm:p-3"
      style={{
        boxShadow: '0 2px 3px -1px var(--card-3d-edge), 0 12px 24px -20px var(--card-3d-shadow)',
      }}
    >
      <div
        className={cn(
          'relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-linear-to-br md:aspect-[4/3]',
          pickByHash(title, PANEL_TONES)
        )}
      >
        {image && (
          <img
            src={image}
            alt={imageAlt || `Screenshot of ${title}`}
            className={cn(
              'project-card-artwork h-full w-full',
              isContained && 'drop-shadow-[0_12px_24px_oklch(0.3_0.05_300/18%)]'
            )}
            style={
              {
                objectFit,
                '--project-image-padding': isContained ? `${imagePadding}%` : '0%',
              } as CSSProperties
            }
            loading="lazy"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pt-5 pb-3">
        <h3 className="font-display-soft text-foreground text-2xl leading-8 font-semibold tracking-tight md:min-h-16">
          <a
            href={projectUrl}
            className="project-card-link focus-visible:after:outline-foreground after:absolute after:inset-0 after:rounded-[2.75rem] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2"
          >
            {title}
            <span className="sr-only"> · {translations.viewDetails}</span>
          </a>
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:line-clamp-2 md:min-h-[2lh]">
          {description}
        </p>

        <ul className="mt-3 flex flex-wrap content-start gap-1.5 md:min-h-14">
          {techStack.slice(0, 3).map((tech, index) => (
            <li key={tech} className="flex min-w-0 items-center gap-1.5">
              <span className="bg-card/65 text-muted-foreground border-border/60 inline-flex h-6 items-center rounded-full border px-2.5 font-sans text-xs whitespace-nowrap">
                {tech}
              </span>
              {index === 2 && hiddenTechCount > 0 && (
                <span className="bg-card/65 text-muted-foreground border-border/60 inline-flex h-6 items-center rounded-full border px-2 font-sans text-xs">
                  +{hiddenTechCount}
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <div className="project-card-actions relative z-10 flex w-fit gap-2">
            {links?.demo && (
              <Link
                variant="default"
                size="sm"
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-4"
              >
                {translations.liveDemo}
              </Link>
            )}
            {links?.repo && (
              <Link
                variant="pastel"
                size="sm"
                href={links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-4"
              >
                {translations.code}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card3D>
  );
}
