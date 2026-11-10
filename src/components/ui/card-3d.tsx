import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import '@/styles/card-3d.css';

function Card3D({
  as: Tag = 'div',
  variant = 'default',
  className,
  children,
  ...props
}: ComponentProps<'div'> & { as?: 'div' | 'article'; variant?: 'default' | 'glass' }) {
  return (
    <Tag
      data-slot="card-3d"
      data-variant={variant}
      className={cn(
        'card-3d text-card-foreground relative isolate flex min-w-0 flex-col gap-6 p-8 sm:p-10',
        variant === 'glass' && 'card-3d-glass',
        className
      )}
      {...props}
    >
      <span className="card-3d-material" aria-hidden="true" />
      {children}
    </Tag>
  );
}

export { Card3D };
