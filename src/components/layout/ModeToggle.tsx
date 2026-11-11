import { useRef } from 'react';
import { Moon02Icon, SunIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { applyTheme, getTheme } from '@/lib/theme';
import '@/styles/mode-toggle.css';

export function ModeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    const toggleClass = () => applyTheme(next);

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      toggleClass();
      return;
    }

    if (buttonRef.current) {
      const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.style.setProperty('--theme-x', `${x}px`);
      document.documentElement.style.setProperty('--theme-y', `${y}px`);
      document.documentElement.style.setProperty('--theme-radius', `${maxRadius}px`);
    }

    document.startViewTransition({
      update: toggleClass,
      types: ['theme-transition'],
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="mode-toggle"
    >
      <span className="mode-toggle-endcap" aria-hidden="true" />
      <HugeiconsIcon icon={SunIcon} strokeWidth={2} className="mode-toggle-sun" />
      <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} className="mode-toggle-moon" />
    </button>
  );
}
