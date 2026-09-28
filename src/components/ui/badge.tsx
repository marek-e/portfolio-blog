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
          'bg-pastel-sky/55 text-pastel-sky-ink dark:bg-pastel-sky/15 dark:text-pastel-sky-ink',
        'pastel-green':
          'bg-pastel-mint/55 text-pastel-mint-ink dark:bg-pastel-mint/15 dark:text-pastel-mint-ink',
        'pastel-yellow':
          'bg-pastel-butter/70 text-pastel-butter-ink dark:bg-pastel-butter/15 dark:text-pastel-butter-ink',
        'pastel-pink':
          'bg-pastel-rose/55 text-pastel-rose-ink dark:bg-pastel-rose/15 dark:text-pastel-rose-ink',
        'pastel-purple':
          'bg-pastel-lilac/55 text-pastel-lilac-ink dark:bg-pastel-lilac/15 dark:text-pastel-lilac-ink',
        'pastel-orange':
          'bg-pastel-peach/55 text-pastel-peach-ink dark:bg-pastel-peach/15 dark:text-pastel-peach-ink',
        'pastel-teal':
          'bg-pastel-mint/35 text-pastel-mint-ink dark:bg-pastel-mint/15 dark:text-pastel-mint-ink',
        'pastel-rose':
          'bg-pastel-rose/55 text-pastel-rose-ink dark:bg-pastel-rose/15 dark:text-pastel-rose-ink',
        'pastel-blue-outline':
          'bg-pastel-sky/55 border-pastel-sky text-pastel-sky-ink dark:bg-pastel-sky/15 dark:border-pastel-sky/40 dark:text-pastel-sky-ink',
        'pastel-green-outline':
          'bg-pastel-mint/55 border-pastel-mint text-pastel-mint-ink dark:bg-pastel-mint/15 dark:border-pastel-mint/40 dark:text-pastel-mint-ink',
        'pastel-yellow-outline':
          'bg-pastel-butter/70 border-pastel-butter text-pastel-butter-ink dark:bg-pastel-butter/15 dark:border-pastel-butter/40 dark:text-pastel-butter-ink',
        'pastel-pink-outline':
          'bg-pastel-rose/55 border-pastel-rose text-pastel-rose-ink dark:bg-pastel-rose/15 dark:border-pastel-rose/40 dark:text-pastel-rose-ink',
        'pastel-purple-outline':
          'bg-pastel-lilac/55 border-pastel-lilac text-pastel-lilac-ink dark:bg-pastel-lilac/15 dark:border-pastel-lilac/40 dark:text-pastel-lilac-ink',
        'pastel-orange-outline':
          'bg-pastel-peach/55 border-pastel-peach text-pastel-peach-ink dark:bg-pastel-peach/15 dark:border-pastel-peach/40 dark:text-pastel-peach-ink',
        'pastel-teal-outline':
          'bg-pastel-mint/35 border-pastel-mint text-pastel-mint-ink dark:bg-pastel-mint/15 dark:border-pastel-mint/40 dark:text-pastel-mint-ink',
        'pastel-rose-outline':
          'bg-pastel-rose/55 border-pastel-rose text-pastel-rose-ink dark:bg-pastel-rose/15 dark:border-pastel-rose/40 dark:text-pastel-rose-ink',
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
