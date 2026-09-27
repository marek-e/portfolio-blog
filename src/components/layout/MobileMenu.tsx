import { ArrowUpRight01Icon, Cancel01Icon, Menu01Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ModeToggle } from './ModeToggle';
import { Icon } from '../shared/Icon';
import { Doodle } from '../shared/HandDrawn';
import { getNavLinks } from '@/lib/navigation';
import { getTranslatedPath, getTranslations, type Lang } from '@/i18n';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileMenuProps {
  lang: Lang;
  currentPath: string;
}

export function MobileMenu({ lang, currentPath }: MobileMenuProps) {
  const t = getTranslations(lang);
  const translatePath = getTranslatedPath(lang);
  const navLinks = getNavLinks(lang);
  const isActive = (href: string) => href !== '/' && currentPath.startsWith(href);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t.aria.openMenu}
            className="size-11 rounded-full md:hidden"
          />
        }
      >
        <Icon icon={Menu01Icon} strokeWidth={2} className="size-5" />
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="bg-background/90 inset-y-3! right-3! h-auto! w-[min(340px,calc(100vw-1.5rem))]! gap-0 overflow-hidden rounded-3xl"
      >
        <Doodle
          name="loop"
          strokeWidth={2}
          className="text-pastel-lilac/70 absolute right-6 bottom-36 h-10 w-32 -rotate-6"
        />
        <SheetHeader className="flex-row items-center justify-between px-6 pt-5 pb-4">
          <a
            href={translatePath('/')}
            className="font-display-wonk text-foreground text-2xl tracking-tight"
          >
            melmayan
          </a>
          <SheetClose
            render={
              <Button
                variant="glass"
                size="icon"
                aria-label={t.aria.closeMenu}
                className="size-11 rounded-full"
              />
            }
          >
            <Icon icon={Cancel01Icon} strokeWidth={2.5} className="size-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <p className="eyebrow px-6 pt-4 pb-2">Menu</p>
        <nav className="flex flex-col px-3">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'group hover:bg-foreground/5 flex min-h-14 items-baseline gap-4 rounded-2xl px-3 py-3 transition-colors',
                isActive(link.href) && 'bg-pastel-lilac/35 dark:bg-pastel-lilac/12'
              )}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-display-soft text-foreground text-3xl leading-none font-medium tracking-tight">
                {link.label}
              </span>
              {link.external && (
                <Icon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="text-muted-foreground size-4 self-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              )}
            </a>
          ))}
        </nav>

        <SheetFooter className="border-foreground/10 mt-auto border-t px-6 py-5">
          <div className="flex items-center justify-between">
            <LanguageSwitcher currentLang={lang} currentPath={currentPath} />
            <ModeToggle />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
