import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20',
        outline: 'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
        // Pastel variants (filled)
        'pastel-blue': 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        'pastel-green':
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        'pastel-yellow': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        'pastel-pink': 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
        'pastel-purple': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
        'pastel-orange': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        'pastel-teal': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
        'pastel-rose': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
        // Pastel variants (outlined)
        'pastel-blue-outline':
          'bg-sky-100 dark:bg-sky-900/40 border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-300',
        'pastel-green-outline':
          'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300',
        'pastel-yellow-outline':
          'bg-amber-100 dark:bg-amber-900/40 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300',
        'pastel-pink-outline':
          'bg-pink-100 dark:bg-pink-900/40 border-pink-300 text-pink-700 dark:border-pink-700 dark:text-pink-300',
        'pastel-purple-outline':
          'bg-violet-100 dark:bg-violet-900/40 border-violet-300 text-violet-700 dark:border-violet-700 dark:text-violet-300',
        'pastel-orange-outline':
          'bg-orange-100 dark:bg-orange-900/40 border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300',
        'pastel-teal-outline':
          'bg-teal-100 dark:bg-teal-900/40 border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-300',
        'pastel-rose-outline':
          'bg-rose-100 dark:bg-rose-900/40 border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300',
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
