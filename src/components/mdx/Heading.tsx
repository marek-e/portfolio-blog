import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../react/Icon';
import { Link02Icon } from '@hugeicons/core-free-icons';

interface HeadingProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function getTextContent(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return getTextContent((children as { props: { children: ReactNode } }).props.children);
  }
  return '';
}

export function H1({ children, className, ...props }: HeadingProps) {
  const handleClick = () => {
    window.history.pushState(null, '', window.location.pathname);
  };

  return (
    <h1
      className={cn(
        'not-prose group cursor-pointer scroll-mt-24 text-4xl font-bold tracking-tight lg:text-5xl',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      <span className="text-muted-foreground ml-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Icon icon={Link02Icon} strokeWidth={2} className="size-4" />
      </span>
    </h1>
  );
}

export function H2({ children, id, className, ...props }: HeadingProps) {
  const text = getTextContent(children);
  const headingId = id || slugify(text);

  const handleClick = () => {
    window.history.pushState(null, '', `#${headingId}`);
  };

  return (
    <h2
      id={headingId}
      className={cn(
        'not-prose group cursor-pointer scroll-mt-24 text-2xl font-semibold tracking-tight',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <a
        href={`#${headingId}`}
        className="inline-flex items-center no-underline"
        onClick={(e) => e.preventDefault()}
      >
        {children}
        <span className="text-muted-foreground ml-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Icon icon={Link02Icon} strokeWidth={2} className="size-4" />
        </span>
      </a>
    </h2>
  );
}

export function H3({ children, id, className, ...props }: HeadingProps) {
  const text = getTextContent(children);
  const headingId = id || slugify(text);

  const handleClick = () => {
    window.history.pushState(null, '', `#${headingId}`);
  };

  return (
    <h3
      id={headingId}
      className={cn(
        'not-prose group cursor-pointer scroll-mt-24 text-xl font-semibold tracking-tight',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <a
        href={`#${headingId}`}
        className="inline-flex items-center no-underline"
        onClick={(e) => e.preventDefault()}
      >
        {children}
        <span className="text-muted-foreground ml-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Icon icon={Link02Icon} strokeWidth={2} className="size-4" />
        </span>
      </a>
    </h3>
  );
}

export function H4({ children, id, className, ...props }: HeadingProps) {
  const text = getTextContent(children);
  const headingId = id || slugify(text);

  const handleClick = () => {
    window.history.pushState(null, '', `#${headingId}`);
  };

  return (
    <h4
      id={headingId}
      className={cn('not-prose group cursor-pointer scroll-mt-24 text-lg font-semibold', className)}
      onClick={handleClick}
      {...props}
    >
      <a
        href={`#${headingId}`}
        className="inline-flex items-center no-underline"
        onClick={(e) => e.preventDefault()}
      >
        {children}
        <span className="text-muted-foreground ml-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Icon icon={Link02Icon} strokeWidth={2} className="size-4" />
        </span>
      </a>
    </h4>
  );
}
