import type { ReactNode } from 'react';

interface TechStackBadgeProps {
  name: string;
  icon: ReactNode;
}

export function TechStackBadge({ name, icon }: TechStackBadgeProps) {
  return (
    <div
      className="bg-card/60 ring-foreground/5 dark:bg-foreground/5 flex size-11 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 hover:-translate-y-0.5"
      title={name}
    >
      {icon}
    </div>
  );
}
