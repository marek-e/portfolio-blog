import { type ReactNode, type AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string;
  children: ReactNode;
  newTab?: boolean;
  className?: string;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith('//');
}

const linkStyles = cn(
  'underline decoration-primary decoration-wavy decoration-[1.3px] underline-offset-[5px]',
  'transition-all duration-200 ease-out',
  'hover:text-primary/80 hover:decoration-[1.8px] hover:underline-offset-[5.5px]'
);

export function Link({ href, children, newTab, className, ...rest }: LinkProps) {
  if (!href) {
    return (
      <a className={cn(linkStyles, className)} {...rest}>
        {children}
      </a>
    );
  }

  const openInNewTab = newTab ?? isExternal(href);

  return (
    <a
      href={href}
      className={cn(linkStyles, className)}
      {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
