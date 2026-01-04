import { useEffect, useRef, useState, useCallback } from 'react';
import type { Lang } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { Icon } from './Icon';
import {
  Brain,
  Briefcase01Icon,
  Joystick04Icon,
  Location03Icon,
  UserAccountIcon,
} from '@hugeicons/core-free-icons';

interface DevIdCardProps {
  lang: Lang;
}

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

const INITIAL_TILT: TiltState = {
  rotateX: 0,
  rotateY: 0,
  glareX: 50,
  glareY: 50,
};

const MAX_TILT = 12;
const SPRING_FACTOR = 0.1;

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const TECH_STACK = [
  {
    name: 'React',
    icon: <img src="/src/assets/react-logo.svg" alt="React" />,
  },
  {
    name: 'TypeScript',
    icon: <img src="/src/assets/typescript-logo.svg" alt="TypeScript" />,
  },
  {
    name: 'Python',
    icon: <img src="/src/assets/python-logo.svg" alt="Python" />,
  },
  {
    name: 'AWS Serverless',
    icon: <img src="/src/assets/aws-lambda-logo.svg" alt="AWS Lambda" />,
  },
  {
    name: 'Next.js',
    icon: <img src="/src/assets/next-js-logo.svg" alt="Next.js" className="dark:invert" />,
  },
  {
    name: 'More to come',
    icon: <img src="/src/assets/empty_badge.svg" alt="More to come" />,
  },
];

export function DevIdCard({ lang }: DevIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentTilt, setCurrentTilt] = useState<TiltState>(INITIAL_TILT);
  const [targetTilt, setTargetTilt] = useState<TiltState>(INITIAL_TILT);

  const t = getTranslations(lang);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const calculateTilt = useCallback(
    (clientX: number, clientY: number): TiltState => {
      if (!cardRef.current || isReducedMotion) return INITIAL_TILT;

      const rect = cardRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((clientY - rect.top) / rect.height - 0.5) * 2;

      return {
        rotateX: clamp(-y * MAX_TILT, -MAX_TILT, MAX_TILT),
        rotateY: clamp(x * MAX_TILT, -MAX_TILT, MAX_TILT),
        glareX: clamp((x + 1) * 50, 0, 100),
        glareY: clamp((y + 1) * 50, 0, 100),
      };
    },
    [isReducedMotion]
  );

  useEffect(() => {
    if (isReducedMotion) return;

    const animate = () => {
      setCurrentTilt((prev) => {
        const newTilt = {
          rotateX: lerp(prev.rotateX, targetTilt.rotateX, SPRING_FACTOR),
          rotateY: lerp(prev.rotateY, targetTilt.rotateY, SPRING_FACTOR),
          glareX: lerp(prev.glareX, targetTilt.glareX, SPRING_FACTOR),
          glareY: lerp(prev.glareY, targetTilt.glareY, SPRING_FACTOR),
        };

        const isSettled =
          Math.abs(newTilt.rotateX - targetTilt.rotateX) < 0.01 &&
          Math.abs(newTilt.rotateY - targetTilt.rotateY) < 0.01;

        if (isSettled && !isHovering) {
          return targetTilt;
        }

        return newTilt;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetTilt, isHovering, isReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    setTargetTilt(calculateTilt(e.clientX, e.clientY));
  };

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTargetTilt(INITIAL_TILT);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    const touch = e.touches[0];
    if (touch) {
      setTargetTilt(calculateTilt(touch.clientX, touch.clientY));
    }
  };

  const handleTouchStart = () => setIsHovering(true);

  const handleTouchEnd = () => {
    setIsHovering(false);
    setTargetTilt(INITIAL_TILT);
  };

  const cardStyle: React.CSSProperties = isReducedMotion
    ? {}
    : {
        transform: `perspective(1000px) rotateX(${currentTilt.rotateX}deg) rotateY(${currentTilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      };

  const shadowX = currentTilt.rotateY * 1.5;
  const shadowY = -currentTilt.rotateX * 1.5;
  const shadowStyle = isReducedMotion
    ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
    : `${shadowX}px ${shadowY + 20}px 40px rgba(0, 0, 0, 0.2)`;

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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="img"
      aria-label={t.devCard.ariaLabel}
    >
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          ...cardStyle,
          boxShadow: shadowStyle,
          transition: isReducedMotion ? 'none' : 'box-shadow 0.15s ease-out',
        }}
      >
        {/* Main card background */}
        <div className="ring-primary/30 relative flex h-full flex-col rounded-2xl bg-transparent p-3 ring-4">
          {/* Holographic overlay - on the outer card frame */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 transition-opacity duration-300 group-hover:opacity-50"
            style={{
              background: `linear-gradient(
                ${125 + currentTilt.rotateY * 2}deg,
                oklch(0.8 0.15 0) 0%,
                oklch(0.85 0.15 60) 14%,
                oklch(0.9 0.12 100) 28%,
                oklch(0.85 0.15 140) 42%,
                oklch(0.8 0.12 200) 57%,
                oklch(0.75 0.15 260) 71%,
                oklch(0.8 0.18 300) 85%,
                oklch(0.8 0.15 0) 100%
              )`,
              backgroundSize: '200% 200%',
              backgroundPosition: `${currentTilt.glareX}% ${currentTilt.glareY}%`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Glare overlay - on the outer card frame */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(
                circle at ${currentTilt.glareX}% ${currentTilt.glareY}%,
                oklch(1 0 0 / 0.5) 0%,
                transparent 50%
              )`,
            }}
          />

          {/* Inner card */}
          <div className="border-border bg-card relative z-10 flex flex-1 flex-col rounded-xl border-2 p-4">
            {/* Title */}
            <h3 className="text-primary relative z-10 mb-3 flex items-center justify-center gap-2 text-center text-xl font-bold md:text-2xl">
              <svg className="fill-primary size-6" viewBox="0 0 500 500" aria-hidden="true">
                <path d="M 230.5,49.5 C 236.833,49.5 243.167,49.5 249.5,49.5C 249.667,66.17 249.5,82.8367 249,99.5C 183.964,103.248 137.964,134.581 111,193.5C 89.3116,254.436 100.478,308.603 144.5,356C 173.77,383.957 208.77,398.124 249.5,398.5C 249.5,415.5 249.5,432.5 249.5,449.5C 173.569,447.633 115.736,414.633 76,350.5C 47.7324,299.356 41.7324,245.69 58,189.5C 80.9942,123.172 125.828,79.0058 192.5,57C 205.158,53.7279 217.825,51.2279 230.5,49.5 Z" />
                <path d="M 236.5,149.5 C 240.833,149.5 245.167,149.5 249.5,149.5C 249.5,216.167 249.5,282.833 249.5,349.5C 210.273,348.478 180.773,331.145 161,297.5C 140.025,251.298 147.192,210.132 182.5,174C 198.223,160.708 216.223,152.541 236.5,149.5 Z" />
              </svg>
              {t.devCard.cardTitle}
              <svg
                className="fill-primary size-6 rotate-180"
                viewBox="0 0 500 500"
                aria-hidden="true"
              >
                <path d="M 230.5,49.5 C 236.833,49.5 243.167,49.5 249.5,49.5C 249.667,66.17 249.5,82.8367 249,99.5C 183.964,103.248 137.964,134.581 111,193.5C 89.3116,254.436 100.478,308.603 144.5,356C 173.77,383.957 208.77,398.124 249.5,398.5C 249.5,415.5 249.5,432.5 249.5,449.5C 173.569,447.633 115.736,414.633 76,350.5C 47.7324,299.356 41.7324,245.69 58,189.5C 80.9942,123.172 125.828,79.0058 192.5,57C 205.158,53.7279 217.825,51.2279 230.5,49.5 Z" />
                <path d="M 236.5,149.5 C 240.833,149.5 245.167,149.5 249.5,149.5C 249.5,216.167 249.5,282.833 249.5,349.5C 210.273,348.478 180.773,331.145 161,297.5C 140.025,251.298 147.192,210.132 182.5,174C 198.223,160.708 216.223,152.541 236.5,149.5 Z" />
              </svg>
            </h3>

            {/* Content layout: fields on left, trainer on right */}
            <div className="relative z-10 flex flex-1 gap-4">
              {/* Fields section */}
              <div className="flex flex-1 flex-col justify-between space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.label}
                    className={`flex items-center rounded-md px-3 py-1.5 ${
                      field.highlight
                        ? 'border-primary bg-primary/15 border-l-4'
                        : 'border-border border-b-primary/35 border border-b-2'
                    }`}
                  >
                    <span className="text-foreground flex min-w-[90px] items-center gap-2 text-xs font-bold tracking-wide uppercase">
                      {index > 0 && !field.highlight && '| '}
                      {field.icon && <Icon icon={field.icon} strokeWidth={2} className="size-4" />}
                      {field.label}
                    </span>
                    <span className="text-foreground ml-auto text-right text-sm font-normal">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trainer sprite */}
              <div className="border-primary/30 bg-muted hidden w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 md:flex md:w-40">
                <img
                  src="/src/assets/portrait.png"
                  alt="Portrait"
                  aria-hidden="true"
                  className="h-full w-full object-contain p-2"
                />
              </div>
            </div>
          </div>

          {/* Tech stack footer */}
          <div className="border-border bg-card z-10 mt-2 flex items-center justify-around rounded-xl border-2 px-3 py-2">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="size-8 transition-transform duration-300 hover:scale-110"
                title={tech.name}
              >
                {tech.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
