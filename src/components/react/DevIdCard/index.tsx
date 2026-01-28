import {
  Brain,
  Briefcase01Icon,
  Joystick04Icon,
  Location03Icon,
  UserAccountIcon,
} from '@hugeicons/core-free-icons';

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
    {
      label: t.devCard.fields.name,
      value: t.devCard.values.name,
      highlight: true,
      icon: UserAccountIcon,
    },
    { label: t.devCard.fields.job, value: t.devCard.values.job, icon: Briefcase01Icon },
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
      className="dev-id-card group relative mx-auto w-full max-w-2xl cursor-pointer select-none"
      {...handlers}
      tabIndex={0}
      role="img"
      aria-label={t.devCard.ariaLabel}
    >
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          ...cardStyle,
          boxShadow,
          transition: isReducedMotion ? 'none' : 'box-shadow 0.15s ease-out',
        }}
      >
        {/* Main card frame */}
        <div className="ring-primary/30 relative flex h-full flex-col rounded-2xl bg-transparent p-3 ring-4">
          <HolographicOverlay
            rotateY={currentTilt.rotateY}
            glareX={currentTilt.glareX}
            glareY={currentTilt.glareY}
          />

          <div className="border-border bg-card relative z-10 flex flex-1 flex-col rounded-xl border-2 p-4">
            <StatusBadge />
            <CardTitle title={t.devCard.cardTitle} />

            <div className="relative z-10 flex flex-1 gap-4">
              <div className="flex flex-1 flex-col justify-between space-y-2">
                {fields.map((field, index) => (
                  <CardField
                    key={field.label}
                    label={field.label}
                    value={field.value}
                    icon={field.icon}
                    highlight={field.highlight}
                    showDivider={index > 0 && !field.highlight}
                  />
                ))}
              </div>

              {/* Portrait */}
              <div className="border-primary/30 bg-muted hidden w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 md:flex md:w-40">
                <img
                  src="/images/portrait.png"
                  alt="Portrait"
                  aria-hidden="true"
                  className="h-full w-full object-contain p-2"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="border-border bg-card z-10 mt-2 flex items-center justify-around rounded-xl border-2 px-3 py-2">
            {TECH_STACK.map((tech) => (
              <TechStackBadge key={tech.name} name={tech.name} icon={tech.icon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
