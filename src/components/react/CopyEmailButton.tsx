'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, Copy01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { EMAIL } from '@/lib/socials';

interface CopyEmailButtonProps {
  copiedText?: string;
}

export function CopyEmailButton({ copiedText = 'Copied!' }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="lg"
      className="w-1/2 cursor-pointer md:w-auto"
      onClick={handleCopy}
      aria-label={copied ? 'Email copied' : 'Copy email'}
    >
      <span
        className={cn(
          'motion-safe:transition-all motion-safe:duration-300',
          copied ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        )}
      >
        {EMAIL}
      </span>
      <span
        className={cn(
          'absolute motion-safe:transition-all motion-safe:duration-300',
          copied ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {copiedText}
      </span>
      <span className="relative ml-2 size-5">
        <HugeiconsIcon
          icon={Copy01Icon}
          className={cn(
            'absolute inset-0 size-5 motion-safe:transition-all motion-safe:duration-300',
            copied ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100 rotate-0'
          )}
        />
        <HugeiconsIcon
          icon={Check}
          className={cn(
            'absolute inset-0 size-5 text-green-500 motion-safe:transition-all motion-safe:duration-300',
            copied ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-12'
          )}
        />
      </span>
    </Button>
  );
}
