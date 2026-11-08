import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import '@/styles/card-3d.css';

function Card3D({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-3d"
      className={cn(
        'card-3d text-card-foreground relative isolate flex min-w-0 flex-col gap-6 p-8 sm:p-10',
        className
      )}
      {...props}
    >
      <span className="card-3d-material" aria-hidden="true" />
      {children}
    </div>
  );
}

export { Card3D };
