import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { GlassMaterial } from './glass-material';
import { LiquidGlassMaterial } from './liquid-glass-material';
import '@/styles/three-dimensional.css';

const button3DVariants = cva(
  'button-3d relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'button-3d-primary',
        secondary: 'button-3d-secondary',
      },
      size: {
        sm: 'h-11 px-5 text-sm',
        default: 'h-12 px-7 text-base',
        lg: 'h-16 px-12 text-xl',
        icon: 'button-3d-icon size-12',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
);

type Button3DProps = ButtonPrimitive.Props &
  VariantProps<typeof button3DVariants> & { material?: 'default' | 'liquid' };

const Button3D = forwardRef<HTMLButtonElement, Button3DProps>(
  ({ className, variant, size, material = 'default', children, ...props }, ref) => (
    <ButtonPrimitive
      ref={ref}
      data-slot="button-3d"
      className={cn(
        button3DVariants({ variant, size }),
        material === 'liquid' && 'liquid-glass-surface',
        className
      )}
      {...props}
    >
      {material === 'liquid' ? (
        <LiquidGlassMaterial radius={999} circular={size === 'icon'} />
      ) : (
        <>
          <GlassMaterial circular={size === 'icon'} />
          <span className="button-3d-brightness" aria-hidden="true">
            <GlassMaterial circular={size === 'icon'} />
          </span>
        </>
      )}
      {children}
    </ButtonPrimitive>
  )
);
Button3D.displayName = 'Button3D';

export { Button3D, button3DVariants };
