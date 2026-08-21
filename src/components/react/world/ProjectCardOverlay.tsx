import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/components/ui/button';
import { getStatusVariant, getTechColor } from '@/lib/projects';
import type { WorldTranslations } from '@/i18n/translations/world';
import type { WorldBridge } from './bridge';
import type { WorldProjectDTO } from './ProjectsWorld';

interface ProjectCardOverlayProps {
  bridge: WorldBridge;
  projects: WorldProjectDTO[];
  t: WorldTranslations;
}

/**
 * The in-world project info card (PRD §6.7): a DOM overlay above the canvas, reusing the site
 * design system. Opens on the game's `card:open` bridge event; the Dialog owns Esc /
 * outside-click / close-button natively and reports closing back over the bridge, where
 * ProjectsWorld unpauses world input and refocuses the canvas.
 */
export function ProjectCardOverlay({ bridge, projects, t }: ProjectCardOverlayProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => bridge.on('card:open', ({ slug }) => setOpenSlug(slug)), [bridge]);

  const project = openSlug ? projects.find((p) => p.slug === openSlug) : undefined;

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setOpenSlug(null);
    bridge.emit('card:close');
  };

  return (
    <Dialog open={project !== undefined} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        {project && (
          <>
            {project.imageUrl && (
              <div className="bg-muted/70 aspect-video w-full overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-4 p-6">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg">{project.title}</DialogTitle>
                  <Badge variant={getStatusVariant(project.status)} className="text-[10px]">
                    {t.card.status[project.status] ?? project.status}
                  </Badge>
                </div>
                <DialogDescription>{project.description}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant={getTechColor(tech)} className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              <Link variant="default" href={project.detailUrl} className="w-full">
                {t.card.viewProject}
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
