'use client';

import { useState } from 'react';
import { Button3D } from '@/components/ui/button-3d';
import { Doodle } from '@/components/shared/HandDrawn';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, Copy01Icon, Sent02Icon } from '@hugeicons/core-free-icons';
import { EMAIL } from '@/lib/socials';

interface ContactActionsProps {
  cta: string;
  sendLabel: string;
  copiedText: string;
  copyLabel: string;
}

export function ContactActions({ cta, sendLabel, copiedText, copyLabel }: ContactActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:w-fit sm:max-w-none sm:flex-row sm:items-center">
      <Doodle
        name="loop"
        strokeWidth={2.5}
        className="text-foreground/40 absolute top-1/2 right-full mr-5 hidden h-14 w-40 -translate-y-1/3 lg:block"
      />
      <Button3D
        className="text-sm"
        nativeButton={false}
        role="link"
        render={<a href={`mailto:${EMAIL}`} />}
        aria-label={sendLabel}
      >
        {cta}
        <HugeiconsIcon icon={Sent02Icon} className="size-4" aria-hidden="true" />
      </Button3D>
      <Button3D
        variant="secondary"
        className="gap-2 px-3 text-[0.8125rem] font-medium sm:px-4 [&_svg]:size-3.5"
        onClick={handleCopy}
        aria-label={`${copyLabel} ${EMAIL}`}
      >
        <span>{EMAIL}</span>
        <HugeiconsIcon icon={copied ? Check : Copy01Icon} className="size-4" aria-hidden="true" />
      </Button3D>
      <span role="status" className="sr-only">
        {copied ? copiedText : ''}
      </span>
    </div>
  );
}
