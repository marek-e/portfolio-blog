import { useId, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import '@/styles/card-3d.css';

function Card3D({
  as: Tag = 'div',
  variant = 'default',
  className,
  children,
  ...props
}: ComponentProps<'div'> & { as?: 'div' | 'article'; variant?: 'default' | 'glass' }) {
  const refractionId = `card-refraction-${useId().replaceAll(':', '')}`;

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
      <svg className="card-3d-optics" aria-hidden="true" width="0" height="0">
        <defs>
          <filter
            id={refractionId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              className="card-3d-displacement-map"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="bevel"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="bevel"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <span
        className="card-3d-refraction"
        aria-hidden="true"
        style={{ backdropFilter: `url("#${refractionId}")` }}
      />
      <span className="card-3d-backdrop" aria-hidden="true" />
      <span className="card-3d-material" aria-hidden="true">
        <span className="card-3d-reflection">
          <span className="card-3d-reflection-light" />
        </span>
        <span className="card-3d-reflection card-3d-reflection-edge">
          <span className="card-3d-reflection-light" />
        </span>
        <span className="card-3d-reflection card-3d-reflection-band">
          <span className="card-3d-reflection-light" />
        </span>
      </span>
      {children}
    </Tag>
  );
}

export { Card3D };
