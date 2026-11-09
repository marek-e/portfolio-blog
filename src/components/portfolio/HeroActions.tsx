import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { Icon } from '@/components/shared/Icon';
import { Button3D } from '@/components/ui/button-3d';

interface HeroActionsProps {
  projectsLabel: string;
  cvLabel: string;
  cvHref: string;
}

export function HeroActions({ projectsLabel, cvLabel, cvHref }: HeroActionsProps) {
  return (
    <>
      <Button3D
        size="lg"
        nativeButton={false}
        render={<a href="#projects" />}
        className="w-full sm:w-auto"
      >
        {projectsLabel}
        <Icon icon={ArrowRight02Icon} aria-hidden="true" />
      </Button3D>
      <Button3D
        variant="secondary"
        size="lg"
        nativeButton={false}
        render={<a href={cvHref} />}
        className="w-full sm:w-auto"
      >
        {cvLabel}
      </Button3D>
    </>
  );
}
