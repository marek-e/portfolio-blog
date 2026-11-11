import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function PastelBorder() {
  return (
    <span className="button-pastel-border" aria-hidden="true">
      <span className="button-pastel-colours" />
    </span>
  );
}

const buttonVariants = cva(
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 relative rounded-full border border-transparent text-sm font-medium aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 ease-out focus-visible:transition-none active:scale-[0.97] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 group/button select-none",
  {
    variants: {
      variant: {
        default: 'btn-radiant',
        pastel: 'btn-pastel text-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground dark:hover:bg-muted/60 aria-expanded:bg-muted aria-expanded:text-foreground',
        destructive:
          'bg-destructive/10 hover:bg-destructive/20 hover:shadow-md hover:shadow-destructive/15 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
        link: 'text-primary underline-offset-4 hover:underline active:scale-100',
      },
      size: {
        default:
          'h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-8 gap-1 px-3 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 px-3.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-12 gap-2 px-6 text-[0.95rem] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        icon: 'size-8',
        'icon-xs':
          "size-6 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
      animation: {
        none: '',
        scale: 'motion-safe:hover:scale-101 motion-safe:active:scale-99',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none',
    },
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', animation = 'none', children, ...props },
    ref
  ) => {
    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, animation, className }))}
        {...props}
      >
        {variant === 'pastel' && <PastelBorder />}
        {children}
      </ButtonPrimitive>
    );
  }
);
Button.displayName = 'Button';

type LinkProps = React.ComponentPropsWithRef<'a'> & VariantProps<typeof buttonVariants>;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, variant = 'default', size = 'default', animation = 'none', children, ...props },
    ref
  ) => {
    return (
      <a
        ref={ref}
        data-slot="link"
        className={cn(buttonVariants({ variant, size, animation, className }))}
        {...props}
      >
        {variant === 'pastel' && <PastelBorder />}
        {children}
      </a>
    );
  }
);
Link.displayName = 'Link';

export { Button, Link, buttonVariants };
