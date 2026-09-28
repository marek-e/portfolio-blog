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

const linkStyles = 'hand-underline';

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
