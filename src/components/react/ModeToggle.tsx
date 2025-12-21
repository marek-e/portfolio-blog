import { useRef } from 'react';
import { ComputerIcon, Moon02Icon, SunIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme', newTheme);

    const isDark =
      newTheme === 'dark' ||
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleClass = () => {
      document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
    };

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
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            ref={buttonRef}
            variant="outline"
            size="icon"
            aria-label="Toggle theme"
            className="hover:text-primary active:bg-primary/20 rounded-full"
          />
        }
      >
        <HugeiconsIcon
          icon={SunIcon}
          strokeWidth={2}
          className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        />
        <HugeiconsIcon
          icon={Moon02Icon}
          strokeWidth={2}
          className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => applyTheme('light')}>
          <HugeiconsIcon icon={SunIcon} strokeWidth={2} />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme('dark')}>
          <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme('system')}>
          <HugeiconsIcon icon={ComputerIcon} strokeWidth={2} />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
