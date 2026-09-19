import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, Link } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type {
  ProjectsWorldProps,
  WorldProject,
  WorldTranslations,
} from '@/i18n/translations/world';

export interface WorldInteraction {
  type: 'project' | 'prop';
  id: string;
}

export function ProjectCardOverlay({
  interaction,
  projects,
  t,
  developer,
  complete,
  onClose,
  onMute,
}: {
  interaction: WorldInteraction;
  projects: WorldProject[];
  t: WorldTranslations;
  developer: ProjectsWorldProps['developer'];
  complete: boolean;
  onClose: () => void;
  onMute: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const project =
    interaction.type === 'project'
      ? projects.find((project) => project.slug === interaction.id)
      : undefined;
  const prop =
    interaction.type === 'prop' ? t.props[interaction.id as keyof typeof t.props] : undefined;
  const desk = interaction.id === 'desk' && developer;
  const completedBench = interaction.id === 'bench' && complete;
  const title =
    project?.title ?? (desk ? developer.name : completedBench ? t.celebration : prop?.title);
  const description =
    project?.description ??
    (desk ? developer.job : completedBench ? t.celebrationDescription : prop?.description);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      className="world-dialog"
      aria-labelledby="world-card-title"
      aria-describedby="world-card-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key.toLowerCase() === 'm' && !event.repeat) {
          event.preventDefault();
          onMute();
        }
      }}
    >
      <Card className="world-card" onClick={(event) => event.stopPropagation()}>
        {project && (
          <img
            src={project.imageUrl}
            alt=""
            className="world-project-image"
            width={720}
            height={405}
          />
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              {project && <Badge variant="secondary">{t.status[project.status]}</Badge>}
              <CardTitle id="world-card-title" className="text-2xl leading-tight text-balance">
                {title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              className="size-10 shrink-0"
              onClick={onClose}
              aria-label={t.close}
            >
              ×
            </Button>
          </div>
          <CardDescription id="world-card-description" className="pt-2 text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        {(project || desk) && (
          <CardContent className="flex flex-wrap gap-2">
            {(project?.techStack ?? (desk ? developer.techStack : [])).map((tech) => (
              <Badge variant="outline" key={tech}>
                {tech}
              </Badge>
            ))}
          </CardContent>
        )}
        <CardFooter className="justify-between gap-4">
          <span className="text-muted-foreground text-xs">
            <kbd>Esc</kbd> {t.close}
          </span>
          {project ? (
            <Link href={project.detailUrl} className="px-4">
              {t.viewProject} <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <Button onClick={onClose}>{t.close}</Button>
          )}
        </CardFooter>
      </Card>
    </dialog>
  );
}
