import { useEffect, useState } from 'react';
import { ArrowUp04Icon } from '@hugeicons/core-free-icons';
import { Icon } from '../shared/Icon';
import { cn } from '@/lib/utils';

export function BackToTop({ label = 'Back to top' }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer) return;

    let footerVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        footerVisible = entry.isIntersecting;
        if (footerVisible) setVisible(false);
      },
      { threshold: 0 }
    );

    observer.observe(footer);

    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setVisible(scrolled && !footerVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={label}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed right-6 bottom-6 z-40 hidden size-11 items-center justify-center rounded-full md:flex',
        'btn-radiant border',
        'transition-all duration-300 ease-out',
        'hover:scale-105',
        'focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:transition-none',
        'motion-reduce:transition-none motion-reduce:hover:scale-100',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <Icon icon={ArrowUp04Icon} strokeWidth={2} className="size-5" />
    </button>
  );
}
