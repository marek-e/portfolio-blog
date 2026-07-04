import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DevIdCard } from '@/components/portfolio/DevIdCard';
import type { Lang } from '@/i18n/config';
import type { WorldTranslations } from '@/i18n/translations/world';
import type { WorldBridge } from './bridge';

interface PropCardOverlayProps {
  bridge: WorldBridge;
  t: WorldTranslations;
  lang: Lang;
  /** The bench card congratulates once everything is discovered (PRD §6.8). */
  allDiscovered: boolean;
}

type PropId = keyof WorldTranslations['props'];

function isPropId(id: string, t: WorldTranslations): id is PropId {
  return id in t.props;
}

/**
 * Cards for the non-project interactables: the three house intro props (PRD §6.4), the
 * locked library teaser and the viewpoint bench (§6.3). The desk embeds the site's DevIdCard
 * — the developer ID, exactly as the PRD suggests.
 */
export function PropCardOverlay({ bridge, t, lang, allDiscovered }: PropCardOverlayProps) {
  const [openId, setOpenId] = useState<PropId | null>(null);

  useEffect(
    () =>
      bridge.on('prop:open', ({ id }) => {
        if (isPropId(id, t)) setOpenId(id);
      }),
    [bridge, t]
  );

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setOpenId(null);
    bridge.emit('card:close');
  };

  const body =
    openId && openId !== 'desk'
      ? openId === 'bench' && allDiscovered
        ? t.props.bench.congrats
        : t.props[openId].body
      : null;

  return (
    <Dialog open={openId !== null} onOpenChange={handleOpenChange}>
      <DialogContent className={openId === 'desk' ? 'sm:max-w-lg' : 'sm:max-w-md'}>
        {openId && (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">{t.props[openId].title}</DialogTitle>
              {body && <DialogDescription className="text-base">{body}</DialogDescription>}
            </DialogHeader>
            {openId === 'desk' && <DevIdCard lang={lang} />}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
