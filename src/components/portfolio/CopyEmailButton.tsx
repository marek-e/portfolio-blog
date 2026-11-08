'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';
import { Check, Copy01Icon } from '@hugeicons/core-free-icons';
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
      variant="ghost"
      size="lg"
      className="gap-3"
      onClick={handleCopy}
      aria-label={`${copyLabel} ${EMAIL}`}
    >
      <span>{EMAIL}</span>
      <Icon icon={copied ? Check : Copy01Icon} className="size-4" />
      <span role="status" className="sr-only">
        {copied ? copiedText : ''}
      </span>
    </Button>
  );
}
