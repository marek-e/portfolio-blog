import type { ReactNode } from 'react';

interface TechStackBadgeProps {
  name: string;
  icon: ReactNode;
}

export function TechStackBadge({ name, icon }: TechStackBadgeProps) {
  return (
    <li className="dev-id-card-tech">
      <span aria-hidden="true">{icon}</span>
      <span>{name}</span>
    </li>
  );
}
