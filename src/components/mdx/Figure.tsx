import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FigureProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export function Figure({ src, alt, caption, className, width, height, objectFit }: FigureProps) {
  return (
    <figure className={cn('not-prose my-8 flex w-full flex-col items-center', className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="border-border bg-muted/30 overflow-hidden rounded-lg border"
        style={{ objectFit }}
      />
      {caption && (
        <figcaption className="text-muted-foreground mt-3 text-center text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
