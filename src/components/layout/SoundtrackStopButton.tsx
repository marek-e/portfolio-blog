import { useEffect, useRef, useState } from 'react';
import { StopIcon } from '@hugeicons/core-free-icons';
import { Icon } from '@/components/shared/Icon';
import { Button3D } from '@/components/ui/button-3d';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SoundtrackStopButton({ label }: { label: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dock = buttonRef.current?.closest('[data-soundtrack-dock]');
    if (!dock) return;
    const observer = new MutationObserver(() => {
      if (dock.hasAttribute('hidden')) setOpen(false);
    });
    observer.observe(dock, { attributes: true, attributeFilter: ['hidden'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        render={
          <Button3D
            ref={buttonRef}
            type="button"
            size="icon"
            className="size-11 [&_svg]:size-4"
            aria-label={label}
            data-soundtrack-stop
          >
            <Icon icon={StopIcon} fill="currentColor" className="size-4" aria-hidden="true" />
          </Button3D>
        }
      />
      <TooltipContent side="right" sideOffset={8} className="font-mono motion-reduce:animate-none">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
