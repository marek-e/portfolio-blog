import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { getTechColor } from '@/lib/projects';

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

export function ProjectCardReact({ project, projectUrl, translations }: ProjectCardReactProps) {
  const { title, description, techStack, links, image, imageAlt, objectFit } = project;

  return (
    <article className="h-full">
      <Card className="group hover:ring-primary/20 relative flex h-full flex-col overflow-hidden pt-0 transition-all hover:ring-2">
        {image && (
          <div className="bg-muted/70 aspect-video overflow-hidden">
            <img
              src={image}
              alt={imageAlt || `Screenshot of ${title}`}
              className="h-full w-full transition-transform duration-300 group-hover:scale-105"
              style={{ objectFit }}
              loading="lazy"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-1.5">
            {techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant={getTechColor(tech)} className="text-xs">
                {tech}
              </Badge>
            ))}
            {techStack.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{techStack.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-card flex flex-col gap-4 border-t-0">
          <span className="bg-border/50 h-0.5 w-full rounded-full" />
          <div className="flex w-full justify-between gap-2">
            <div className="flex gap-2">
              {links?.demo && (
                <Link
                  variant="default"
                  size="sm"
                  href={links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {translations.liveDemo}
                </Link>
              )}
              {links?.repo && (
                <Link
                  variant="outline"
                  size="sm"
                  href={links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {translations.code}
                </Link>
              )}
            </div>
            <a
              href={projectUrl}
              className="group/link text-primary flex items-center gap-1 text-sm font-medium transition-all hover:underline"
            >
              <span>{translations.viewDetails}</span>
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                strokeWidth={2}
                className="size-4 transition-transform duration-300 motion-safe:group-hover/link:translate-x-1"
              />
            </a>
          </div>
        </CardFooter>
      </Card>
    </article>
  );
}
