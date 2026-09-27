'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, Copy01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { EMAIL } from '@/lib/socials';

interface CopyEmailButtonProps {
  copiedText?: string;
  copyLabel?: string;
}

export function CopyEmailButton({
  copiedText = 'Copied!',
  copyLabel = 'Copy email address',
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="glass"
      size="lg"
      className="relative cursor-pointer font-mono text-sm"
      onClick={handleCopy}
      aria-label={`${copied ? copiedText : copyLabel} ${EMAIL}`}
    >
      <span
        className={cn(
          'motion-safe:transition-all motion-safe:duration-300',
          copied ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        )}
      >
        {EMAIL}
      </span>
      <span
        className={cn(
          'absolute motion-safe:transition-all motion-safe:duration-300',
          copied ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        {copiedText}
      </span>
      <span
        className={cn(
          'relative -mr-2 ml-1 size-8 rounded-full transition-colors duration-300',
          copied ? 'bg-pastel-mint/70 dark:bg-pastel-mint/20' : 'bg-foreground/6'
        )}
      >
        <HugeiconsIcon
          icon={Copy01Icon}
          className={cn(
            'absolute inset-2 size-4 motion-safe:transition-all motion-safe:duration-300',
            copied ? 'scale-75 rotate-12 opacity-0' : 'scale-100 rotate-0 opacity-100'
          )}
        />
        <HugeiconsIcon
          icon={Check}
          className={cn(
            'text-foreground absolute inset-2 size-4 motion-safe:transition-all motion-safe:duration-300',
            copied ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-12 opacity-0'
          )}
        />
      </span>
    </Button>
  );
}
