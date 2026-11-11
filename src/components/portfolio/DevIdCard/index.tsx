import { useState, useSyncExternalStore } from 'react';
import { BirthdayCakeIcon, Location03Icon, SparklesIcon } from '@hugeicons/core-free-icons';

import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { Icon } from '@/components/shared/Icon';

import { useTiltEffect } from './useTiltEffect';
import { PearlescentOverlay } from './PearlescentOverlay';
import { GlassFrame } from './GlassFrame';
import { TechStackBadge } from './TechStackBadge';
import { BIRTH_DATE, TECH_STACK, getAge } from './constants';

interface DevIdCardProps {
  lang: Lang;
  ageAtBuild: number;
}

const subscribeToNothing = () => () => {};
const getCurrentAge = () => getAge(BIRTH_DATE);

export function DevIdCard({ lang, ageAtBuild }: DevIdCardProps) {
  const t = getTranslations(lang);
  const age = useSyncExternalStore(subscribeToNothing, getCurrentAge, () => ageAtBuild);

  const { cardRef, tiltRef } = useTiltEffect();
  const [rotation, setRotation] = useState(0);
  const isFlipped = Math.abs(rotation / 180) % 2 === 1;
  const [firstName, ...lastName] = t.devCard.values.name.split(' ');

  const fields = [
    {
      label: t.devCard.fields.location,
      value: t.devCard.values.location,
      icon: Location03Icon,
    },
    { label: t.devCard.fields.nature, value: t.devCard.values.nature, icon: SparklesIcon },
    {
      label: t.devCard.fields.age,
      value: t.devCard.values.age.replace('{age}', String(age)),
      icon: BirthdayCakeIcon,
    },
  ];

  return (
    <div
      ref={cardRef}
      className="dev-id-card relative mx-auto w-full max-w-md"
      data-flipped={isFlipped}
      role="group"
      aria-label={t.devCard.ariaLabel}
    >
      <div ref={tiltRef} className="dev-id-card-tilt">
        <div className="dev-id-card-turn" style={{ transform: `rotateY(${rotation}deg)` }}>
          <div className="dev-id-card-face dev-id-card-front" aria-hidden={isFlipped}>
            <GlassFrame />
            <PearlescentOverlay />
            <div className="dev-id-card-content">
              <p className="dev-id-card-header">{t.devCard.cardTitle}</p>
              <div className="dev-id-card-stage">
                <h3 className="dev-id-card-name font-display-soft">
                  <span>{firstName}</span> <span>{lastName.join(' ')}</span>
                </h3>
                <dl className="dev-id-card-fields">
                  {fields.map((field) => (
                    <div key={field.label}>
                      <dt className="sr-only">{field.label}</dt>
                      <dd>
                        <Icon icon={field.icon} aria-hidden="true" strokeWidth={1.5} />
                        <span>{field.value}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <img
                  className="dev-id-card-avatar"
                  src="/images/portrait-pearl-v2-card.webp"
                  alt=""
                  width={510}
                  height={1536}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="dev-id-card-melo"
                  src="/melo/melo-companion.webp"
                  alt=""
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <ul className="dev-id-card-stack">
                {TECH_STACK.map((tech) => (
                  <TechStackBadge key={tech.name} name={tech.name} icon={tech.icon} />
                ))}
              </ul>
            </div>
          </div>
          <div className="dev-id-card-face dev-id-card-back" aria-hidden={!isFlipped}>
            <PearlescentOverlay />
            <div className="dev-id-card-back-content relative z-10">
              <p className="dev-id-card-back-role">{t.devCard.values.job}</p>
              <div className="dev-id-card-back-art" aria-hidden="true">
                <img
                  className="dev-id-card-ribbon"
                  src="/images/dev-id-ribbon.webp"
                  alt=""
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="dev-id-card-back-signature">
                <p className="font-display-soft">{t.devCard.values.name}</p>
                <span>melmayan.fr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="dev-id-card-toggle absolute inset-0 z-30 cursor-pointer rounded-[2rem]"
        aria-label={isFlipped ? t.devCard.showFront : t.devCard.turnOver}
        aria-pressed={isFlipped}
        onClick={(event) => {
          const isKeyboard = event.detail === 0;
          const bounds = event.currentTarget.getBoundingClientRect();
          const direction = !isKeyboard && event.clientX < bounds.left + bounds.width / 2 ? -1 : 1;
          cardRef.current?.toggleAttribute('data-instant', isKeyboard);
          setRotation((angle) => angle + direction * 180);
        }}
      />
    </div>
  );
}
