import { Cancel01Icon, Menu01Icon, Star } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/navigation';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ModeToggle } from './ModeToggle';
import { Icon } from './Icon';
import { Separator } from '../ui/separator';

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden" />}
      >
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-5" />
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="w-[300px] rounded-l-xl border-l-white/20 bg-white/70 backdrop-blur-lg dark:border-l-white/10 dark:bg-black/70"
      >
        <SheetHeader className="flex-row items-center justify-between pb-2">
          <a href="/" className="text-foreground flex items-center gap-2 font-semibold">
            <HugeiconsIcon
              icon={Star}
              strokeWidth={2}
              fill="currentColor"
              className="text-primary size-5"
            />
            <span className="text-lg">melmayan</span>
          </a>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                className="size-11 rounded-full"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2.5} className="size-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <Separator />

        <nav className="flex flex-col gap-1 px-2 py-4">
          {NAV_LINKS.map((link) => (
            <a
              href={link.href}
              className="text-foreground/80 hover:text-foreground hover:bg-primary/20 active:bg-primary/30 flex items-center gap-2 rounded-lg px-4 py-3 text-lg font-medium transition-colors"
            >
              <Icon icon={link.icon} strokeWidth={2} className="size-4" />
              {link.label}
            </a>
          ))}
        </nav>

        <SheetFooter className="border-border border-t pt-4">
          <div className="flex items-center justify-end">
            <ModeToggle />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
