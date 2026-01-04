import type { ReactNode } from 'react';

interface TechStackBadgeProps {
  name: string;
  icon: ReactNode;
}

export function TechStackBadge({ name, icon }: TechStackBadgeProps) {
  return (
    <div
      className="size-8 transition-transform duration-300 hover:scale-110"
      title={name}
    >
      {icon}
    </div>
  );
}

