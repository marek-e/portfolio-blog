import { Link } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

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

const CHIP_TONES = [
  'bg-pastel-sky/45 dark:bg-pastel-sky/12 dark:text-pastel-sky',
  'bg-pastel-mint/50 dark:bg-pastel-mint/12 dark:text-pastel-mint',
  'bg-pastel-lilac/45 dark:bg-pastel-lilac/12 dark:text-pastel-lilac',
  'bg-pastel-peach/50 dark:bg-pastel-peach/12 dark:text-pastel-peach',
  'bg-pastel-rose/45 dark:bg-pastel-rose/12 dark:text-pastel-rose',
  'bg-pastel-butter/60 dark:bg-pastel-butter/12 dark:text-pastel-butter',
] as const;

function pickTone<T>(key: string, tones: readonly T[]): T {
  const hash = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tones[hash % tones.length];
}

export function ProjectCardReact({ project, projectUrl, translations }: ProjectCardReactProps) {
  const { title, description, techStack, links, image, imageAlt, objectFit } = project;
  const isContained = objectFit === 'contain' || objectFit === 'scale-down';
  const hiddenTechCount = techStack.length - 3;

  return (
    <article className="group glass relative flex h-full flex-col rounded-3xl p-2.5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-28px_var(--glass-shadow)]">
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-linear-to-br',
          pickTone(title, PANEL_TONES)
        )}
      >
        {image && (
          <img
            src={image}
            alt={imageAlt || `Screenshot of ${title}`}
            className={cn(
              'h-full w-full transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]',
              isContained && 'p-8 drop-shadow-[0_12px_24px_oklch(0.3_0.05_300/18%)]'
            )}
            style={{ objectFit }}
            loading="lazy"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pt-5 pb-3">
        <h3 className="font-display-soft text-foreground text-2xl font-semibold tracking-tight">
          <a
            href={projectUrl}
            className="focus-visible:after:ring-ring after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:ring-2"
          >
            {title}
            <span className="sr-only"> · {translations.viewDetails}</span>
          </a>
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
          {description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {techStack.slice(0, 3).map((tech) => (
            <li
              key={tech}
              className={cn(
                'text-foreground/80 rounded-full px-2.5 py-0.5 font-mono text-xs whitespace-nowrap',
                pickTone(tech, CHIP_TONES)
              )}
            >
              {tech}
            </li>
          ))}
          {hiddenTechCount > 0 && (
            <li className="text-muted-foreground border-border rounded-full border px-2.5 py-0.5 font-mono text-xs">
              +{hiddenTechCount}
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-2 pt-6">
          <div className="relative z-10 flex gap-1.5">
            {links?.demo && (
              <Link
                variant="default"
                size="sm"
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5"
              >
                {translations.liveDemo}
              </Link>
            )}
            {links?.repo && (
              <Link
                variant="glass"
                size="sm"
                href={links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5"
              >
                {translations.code}
              </Link>
            )}
          </div>
          <span
            aria-hidden="true"
            className="glass-strong text-foreground group-hover:bg-primary group-hover:text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 group-hover:border-transparent"
          >
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={2}
              className="size-4 transition-transform duration-300 motion-safe:group-hover:rotate-45"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
