import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDateRange, type TimelineEntry } from '@/types/timeline';
import { Briefcase01Icon, Mortarboard01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Lang } from '@/i18n/config';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface TimelineCardsProps {
  entries: TimelineEntry[];
  presentLabel: string;
  lang: Lang;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function TimelineCard({
  entry,
  index,
  progress,
  isLeft,
  isReducedMotion,
  isMobile,
  lang,
  presentLabel,
}: {
  entry: TimelineEntry;
  index: number;
  progress: number;
  isLeft: boolean;
  isReducedMotion: boolean;
  isMobile?: boolean;
  lang: Lang;
  presentLabel: string;
}) {
  // Card appears when scroll progress reaches its position
  const cardThreshold = index * 0.2;
  const cardProgress = clamp((progress - cardThreshold) / 0.18, 0, 1);
  const isVisible = cardProgress > 0;

  const icon = entry.type === 'education' ? Mortarboard01Icon : Briefcase01Icon;

  // Apply easing for smoother animations
  const easedProgress = easeOutBack(cardProgress);
  const fadeProgress = easeOutExpo(cardProgress);

  // Mobile: simpler animations (slide from side + slide up + fade)
  if (isMobile) {
    const translateX = isReducedMotion ? 0 : (isLeft ? -40 : 40) * (1 - easedProgress);
    const translateY = isReducedMotion ? 0 : 30 * (1 - easedProgress);
    const opacity = isReducedMotion ? 1 : fadeProgress;
    const scale = isReducedMotion ? 1 : 0.9 + easedProgress * 0.1;

    return (
      <article
        className={`timeline-card pointer-events-auto bg-card/80 text-card-foreground ring-foreground/10 w-full max-w-sm rounded-2xl p-5 ring-1 backdrop-blur-xs md:max-w-md md:p-6 ${
          isLeft ? 'mr-auto' : 'ml-auto'
        }`}
        style={{
          opacity,
          transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
          transition: isReducedMotion ? 'none' : 'transform 0.15s ease-out, opacity 0.15s ease-out',
          visibility: isVisible || isReducedMotion ? 'visible' : 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        <CardContent entry={entry} icon={icon} lang={lang} presentLabel={presentLabel} />
      </article>
    );
  }

  // Desktop: Complex 3D animation values
  // Horizontal slide - cards come from their respective sides
  const translateX = isReducedMotion ? 0 : (isLeft ? -80 : 80) * (1 - easedProgress);

  // Vertical lift - cards float up slightly as they appear
  const translateY = isReducedMotion ? 0 : 40 * (1 - easedProgress);

  // Z-depth - cards come forward from behind
  const translateZ = isReducedMotion ? 0 : -100 * (1 - easedProgress);

  // 3D rotations for dramatic entrance
  // rotateY - cards rotate around vertical axis (like opening a door)
  const rotateY = isReducedMotion ? 0 : (isLeft ? 25 : -25) * (1 - easedProgress);

  // rotateX - subtle tilt forward/back
  const rotateX = isReducedMotion ? 0 : 15 * (1 - easedProgress);

  // rotateZ - slight twist for dynamic feel
  const rotateZ = isReducedMotion ? 0 : (isLeft ? -8 : 8) * (1 - easedProgress);

  // Scale with overshoot for bounce effect
  const scale = isReducedMotion ? 1 : 0.7 + easedProgress * 0.3;

  // Opacity with faster fade-in
  const opacity = isReducedMotion ? 1 : fadeProgress;

  return (
    <article
      className={`timeline-card pointer-events-auto bg-card/80 text-card-foreground ring-foreground/10 w-full max-w-sm rounded-2xl p-5 ring-1 backdrop-blur-xs md:max-w-md md:p-6 ${
        isLeft ? 'md:mr-auto' : 'md:ml-auto'
      }`}
      style={{
        opacity,
        transform: `perspective(1000px) translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        transformOrigin: isLeft ? 'right center' : 'left center',
        transition: isReducedMotion ? 'none' : 'transform 0.15s ease-out, opacity 0.15s ease-out',
        visibility: isVisible || isReducedMotion ? 'visible' : 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      <CardContent entry={entry} icon={icon} lang={lang} presentLabel={presentLabel} />
    </article>
  );
}

function CardContent({
  entry,
  icon,
  lang,
  presentLabel,
}: {
  entry: TimelineEntry;
  icon: typeof Mortarboard01Icon | typeof Briefcase01Icon;
  lang: Lang;
  presentLabel: string;
}) {
  return (
    <>
      {/* Date badge */}
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
          <HugeiconsIcon icon={icon} className="h-4 w-4" />
        </div>
        <time className="text-muted-foreground text-sm font-medium">
          {formatDateRange(entry.startDate, entry.endDate, lang, presentLabel)}
        </time>
      </div>
      {/* Title and organization */}
      <header className="mb-2">
        <h3 className="text-foreground mb-2 text-lg font-bold md:text-xl">{entry.title}</h3>
        <h4 className="text-primary text-md font-medium">{entry.organization}</h4>
      </header>
      {/* Description */}
      <p className="text-muted-foreground mb-3 text-sm leading-relaxed">{entry.description}</p>
      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {entry.logo && (
        <div className="mt-5 flex justify-center">
          {entry.link ? (
            <a
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${entry.organization} website`}
              className="transition-opacity hover:opacity-70"
            >
              <img
                src={entry.logo}
                alt={`${entry.organization} logo`}
                className={`h-8 object-cover ${entry.logoInverted ? 'dark:invert' : ''}`}
                height={32}
                loading="lazy"
              />
            </a>
          ) : (
            <img
              src={entry.logo}
              alt={`${entry.organization} logo`}
              className={`h-8 object-cover ${entry.logoInverted ? 'dark:invert' : ''}`}
              height={32}
              loading="lazy"
            />
          )}
        </div>
      )}
    </>
  );
}

// Generate a smooth curved path for the timeline
function generateCurvePath(
  height: number,
  amplitude: number,
  periods: number,
  centerOffset: number
): string {
  const points: string[] = [];
  const segments = 100;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * height;
    const x = centerOffset + Math.sin(t * Math.PI * periods) * amplitude;

    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      points.push(`L ${x} ${y}`);
    }
  }

  return points.join(' ');
}

function TimelinePath({
  progress,
  height,
  isReducedMotion,
  isMobile,
}: {
  progress: number;
  height: number;
  isReducedMotion: boolean;
  isMobile?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Only render path on client to avoid hydration mismatch from floating-point differences
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate path length on mount
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [height, isMounted]);

  // Don't render until client-side to avoid SSR/client Math.sin() precision differences
  if (!isMounted) {
    return (
      <svg
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
        width="100"
        height={height}
        viewBox={`0 0 100 ${height}`}
        fill="none"
        preserveAspectRatio="none"
      />
    );
  }

  // Mobile uses larger amplitude and adjusted positioning
  const amplitude = isMobile ? 40 : 25;
  const centerOffset = 50; // Keep center for mobile
  const svgWidth = isMobile ? 120 : 100;
  const curvePath = generateCurvePath(height, amplitude, 2.5, centerOffset);
  const dashOffset = isReducedMotion ? 0 : pathLength * (1 - progress);

  return (
    <svg
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
      width={svgWidth}
      height={height}
      viewBox={`0 0 ${svgWidth} ${height}`}
      fill="none"
      preserveAspectRatio="none"
    >
      {/* Background path (faded) */}
      <path
        d={curvePath}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 8"
        strokeLinecap="round"
        className="text-foreground/10"
      />
      {/* Animated foreground path */}
      <path
        ref={pathRef}
        d={curvePath}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        className="text-primary"
        style={{
          transition: isReducedMotion ? 'none' : 'stroke-dashoffset 0.05s ease-out',
        }}
      />
      {/* Glowing dot at current position */}
      {!isReducedMotion && pathLength > 0 && pathRef.current && (
        <GlowingDot pathRef={pathRef} progress={progress} pathLength={pathLength} />
      )}
    </svg>
  );
}

function GlowingDot({
  pathRef,
  progress,
  pathLength,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  progress: number;
  pathLength: number;
}) {
  const [position, setPosition] = useState({ x: 50, y: 0 });

  useEffect(() => {
    if (pathRef.current && pathLength > 0) {
      const point = pathRef.current.getPointAtLength(progress * pathLength);
      setPosition({ x: point.x, y: point.y });
    }
  }, [pathRef, progress, pathLength]);

  return (
    <g>
      {/* Glow effect */}
      <circle cx={position.x} cy={position.y} r="8" className="fill-primary/20" />
      <circle cx={position.x} cy={position.y} r="5" className="fill-primary/40" />
      {/* Solid dot */}
      <circle cx={position.x} cy={position.y} r="3" className="fill-primary" />
    </g>
  );
}

export function TimelineCards({ entries, presentLabel, lang }: TimelineCardsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isReducedMotion = useReducedMotion();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start when section enters viewport, end when it exits
      const start = viewportHeight;
      const end = -rect.height + 200; // add 200px to the end to avoid the last card to be hidden
      const current = rect.top;

      const progress = clamp((start - current) / (start - end), 0, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate vertical spacing for cards - more space on mobile to prevent overlap
  const cardSpacing = isMobile ? 450 : 280; // pixels between card centers
  const totalHeight = entries.length * cardSpacing + 100;

  return (
    <div
      ref={sectionRef}
      className="relative mx-auto w-full max-w-6xl"
      style={{ minHeight: totalHeight }}
    >
      {/* Curved dotted path - visible on all screen sizes */}
      <div className="absolute inset-x-0 top-0" style={{ height: totalHeight }}>
        <TimelinePath
          progress={scrollProgress}
          height={totalHeight}
          isReducedMotion={isReducedMotion}
          isMobile={isMobile}
        />
      </div>

      {/* Timeline cards */}
      <div className="relative">
        {entries.map((entry, index) => {
          const isLeft = index % 2 === 0;
          const topOffset = index * cardSpacing + 20;

          return (
            <div
              key={entry.id}
              className="pointer-events-none absolute right-0 left-0 px-4 md:px-0"
              style={{ top: topOffset }}
            >
              {/* Desktop: alternating left/right with gap for curve */}
              <div className="hidden md:grid md:grid-cols-[1fr_100px_1fr] md:items-start">
                {isLeft ? (
                  <>
                    <div className="pr-4">
                      <TimelineCard
                        entry={entry}
                        index={index}
                        progress={scrollProgress}
                        isLeft={true}
                        isReducedMotion={isReducedMotion}
                        isMobile={false}
                        lang={lang}
                        presentLabel={presentLabel}
                      />
                    </div>
                    <div /> {/* Center gap for curve */}
                    <div /> {/* Empty right side */}
                  </>
                ) : (
                  <>
                    <div /> {/* Empty left side */}
                    <div /> {/* Center gap for curve */}
                    <div className="pl-4">
                      <TimelineCard
                        entry={entry}
                        index={index}
                        progress={scrollProgress}
                        isLeft={false}
                        isReducedMotion={isReducedMotion}
                        isMobile={false}
                        lang={lang}
                        presentLabel={presentLabel}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Mobile: alternating left/right */}
              <div className="md:hidden">
                <div className={`px-4 ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
                  <TimelineCard
                    entry={entry}
                    index={index}
                    progress={scrollProgress}
                    isLeft={isLeft}
                    isReducedMotion={isReducedMotion}
                    isMobile={true}
                    lang={lang}
                    presentLabel={presentLabel}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
