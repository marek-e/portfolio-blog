import { Brain, Joystick04Icon, Location03Icon } from '@hugeicons/core-free-icons';

import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';

import { useTiltEffect } from './useTiltEffect';
import { HolographicOverlay } from './HolographicOverlay';
import { CardField } from './CardField';
import { CardTitle } from './CardTitle';
import { StatusBadge } from './StatusBadge';
import { TechStackBadge } from './TechStackBadge';
import { TECH_STACK } from './constants';

interface DevIdCardProps {
  lang: Lang;
}

export function DevIdCard({ lang }: DevIdCardProps) {
  const t = getTranslations(lang);

  const { cardRef, handlers, cardStyle, boxShadow, currentTilt, isReducedMotion } = useTiltEffect();

  const fields = [
    { label: t.devCard.fields.nature, value: t.devCard.values.nature, icon: Brain },
    { label: t.devCard.fields.gameTime, value: t.devCard.values.gameTime, icon: Joystick04Icon },
    {
      label: t.devCard.fields.location,
      value: t.devCard.values.location,
      highlight: true,
      icon: Location03Icon,
    },
  ];

  return (
    <div
      ref={cardRef}
      className="dev-id-card group focus-visible:ring-ring/60 relative mx-auto w-full max-w-md cursor-pointer rounded-[2rem] outline-none select-none focus-visible:ring-2"
      {...handlers}
      tabIndex={0}
      role="img"
      aria-label={t.devCard.ariaLabel}
    >
      <div
        className="glass-strong relative overflow-hidden rounded-[2rem] p-2"
        style={{
          ...cardStyle,
          boxShadow,
          transition: isReducedMotion ? 'none' : 'box-shadow 0.15s ease-out',
        }}
      >
        <HolographicOverlay
          rotateY={currentTilt.rotateY}
          glareX={currentTilt.glareX}
          glareY={currentTilt.glareY}
        />

        <div className="border-foreground/5 bg-card/40 dark:bg-card/20 relative z-10 flex flex-col gap-6 rounded-[1.6rem] border p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <CardTitle title={t.devCard.cardTitle} />
            <StatusBadge />
          </div>

          <div className="flex items-center gap-5">
            <div className="bg-pastel relative flex h-36 w-28 shrink-0 items-end justify-center overflow-hidden rounded-2xl shadow-inner sm:h-40 sm:w-32 dark:opacity-90">
              <img
                src="/images/portrait-160.webp"
                srcSet="/images/portrait-160.webp 1x, /images/portrait.webp 2x"
                alt="Portrait"
                aria-hidden="true"
                width={160}
                height={240}
                className="h-full w-full object-contain object-bottom pt-2"
                loading="lazy"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="eyebrow">{t.devCard.fields.name}</span>
              <p className="font-display-soft text-foreground text-2xl leading-tight font-semibold tracking-tight sm:text-[1.7rem]">
                {t.devCard.values.name}
              </p>
              <p className="text-muted-foreground text-sm leading-snug">{t.devCard.values.job}</p>
            </div>
          </div>

          <dl className="border-foreground/10 divide-foreground/10 divide-y border-y border-dashed [&>*]:border-dashed">
            {fields.map((field) => (
              <CardField
                key={field.label}
                label={field.label}
                value={field.value}
                icon={field.icon}
                highlight={field.highlight}
              />
            ))}
          </dl>

          <div className="flex items-center justify-between gap-2">
            {TECH_STACK.map((tech) => (
              <TechStackBadge key={tech.name} name={tech.name} icon={tech.icon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
