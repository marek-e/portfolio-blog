import { HugeiconsIcon } from '@hugeicons/react';
import { Button3D } from '@/components/ui/button-3d';
import { SOCIALS } from '@/lib/socials';

export function ContactSocialLinks({ followLabel }: { followLabel: string }) {
  return (
    <ul className="flex items-center justify-center gap-3">
      {SOCIALS.map((social) => (
        <li key={social.name}>
          <Button3D
            variant="secondary"
            size="icon"
            className="group"
            nativeButton={false}
            role="link"
            aria-label={followLabel.replace('{platform}', social.name)}
            render={<a href={social.href} target="_blank" rel="noopener noreferrer" />}
          >
            <HugeiconsIcon
              icon={social.icon}
              className="motion-safe:group-hover:animate-wiggle size-5"
            />
          </Button3D>
        </li>
      ))}
    </ul>
  );
}
