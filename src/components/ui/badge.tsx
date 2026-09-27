import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'h-6 gap-1 rounded-full border border-transparent px-2.5 py-0.5 font-mono text-xs font-medium tracking-tight transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20',
        outline:
          'border-foreground/15 text-foreground/80 [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
        glass: 'glass text-foreground/85 [a]:hover:bg-card',
        'pastel-blue':
          'bg-pastel-sky/45 text-foreground/80 dark:bg-pastel-sky/12 dark:text-pastel-sky',
        'pastel-green':
          'bg-pastel-mint/50 text-foreground/80 dark:bg-pastel-mint/12 dark:text-pastel-mint',
        'pastel-yellow':
          'bg-pastel-butter/70 text-foreground/80 dark:bg-pastel-butter/12 dark:text-pastel-butter',
        'pastel-pink': 'bg-marker/15 text-foreground/80 dark:bg-marker/15 dark:text-marker',
        'pastel-purple':
          'bg-pastel-lilac/45 text-foreground/80 dark:bg-pastel-lilac/12 dark:text-pastel-lilac',
        'pastel-orange':
          'bg-pastel-peach/50 text-foreground/80 dark:bg-pastel-peach/12 dark:text-pastel-peach',
        'pastel-teal':
          'bg-pastel-mint/35 text-foreground/80 dark:bg-pastel-mint/10 dark:text-pastel-mint',
        'pastel-rose':
          'bg-pastel-rose/45 text-foreground/80 dark:bg-pastel-rose/12 dark:text-pastel-rose',
        'pastel-blue-outline':
          'bg-pastel-sky/35 border-pastel-sky text-foreground/80 dark:bg-pastel-sky/10 dark:border-pastel-sky/30 dark:text-pastel-sky',
        'pastel-green-outline':
          'bg-pastel-mint/40 border-pastel-mint text-foreground/80 dark:bg-pastel-mint/10 dark:border-pastel-mint/30 dark:text-pastel-mint',
        'pastel-yellow-outline':
          'bg-pastel-butter/55 border-pastel-butter text-foreground/80 dark:bg-pastel-butter/10 dark:border-pastel-butter/30 dark:text-pastel-butter',
        'pastel-pink-outline':
          'bg-marker/10 border-marker/35 text-foreground/80 dark:bg-marker/10 dark:border-marker/30 dark:text-marker',
        'pastel-purple-outline':
          'bg-pastel-lilac/35 border-pastel-lilac text-foreground/80 dark:bg-pastel-lilac/10 dark:border-pastel-lilac/30 dark:text-pastel-lilac',
        'pastel-orange-outline':
          'bg-pastel-peach/40 border-pastel-peach text-foreground/80 dark:bg-pastel-peach/10 dark:border-pastel-peach/30 dark:text-pastel-peach',
        'pastel-teal-outline':
          'bg-pastel-sky/20 border-pastel-mint text-foreground/80 dark:bg-pastel-mint/8 dark:border-pastel-mint/30 dark:text-pastel-mint',
        'pastel-rose-outline':
          'bg-pastel-rose/35 border-pastel-rose text-foreground/80 dark:bg-pastel-rose/10 dark:border-pastel-rose/30 dark:text-pastel-rose',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge, badgeVariants };
