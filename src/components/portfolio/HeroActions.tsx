import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { Icon } from '@/components/shared/Icon';
import { Link } from '@/components/ui/button';

interface HeroActionsProps {
  projectsLabel: string;
  cvLabel: string;
  cvHref: string;
}

export function HeroActions({ projectsLabel, cvLabel, cvHref }: HeroActionsProps) {
  return (
    <>
      <Link size="lg" href="#projects" className="w-full sm:w-auto">
        {projectsLabel}
        <Icon icon={ArrowRight02Icon} aria-hidden="true" />
      </Link>
      <Link variant="pastel" size="lg" href={cvHref} className="w-full sm:w-auto">
        {cvLabel}
      </Link>
    </>
  );
}
