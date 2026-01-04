import { useEffect, useRef, useState, useCallback } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

interface UseTiltEffectOptions {
  maxTilt?: number;
  springFactor?: number;
}

const INITIAL_TILT: TiltState = {
  rotateX: 0,
  rotateY: 0,
  glareX: 50,
  glareY: 50,
};

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useTiltEffect(options: UseTiltEffectOptions = {}) {
  const { maxTilt = 12, springFactor = 0.1 } = options;

  const cardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentTilt, setCurrentTilt] = useState<TiltState>(INITIAL_TILT);
  const [targetTilt, setTargetTilt] = useState<TiltState>(INITIAL_TILT);

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
        rotateX: clamp(-y * maxTilt, -maxTilt, maxTilt),
        rotateY: clamp(x * maxTilt, -maxTilt, maxTilt),
        glareX: clamp((x + 1) * 50, 0, 100),
        glareY: clamp((y + 1) * 50, 0, 100),
      };
    },
    [isReducedMotion, maxTilt]
  );

  useEffect(() => {
    if (isReducedMotion) return;

    const animate = () => {
      setCurrentTilt((prev) => {
        const newTilt = {
          rotateX: lerp(prev.rotateX, targetTilt.rotateX, springFactor),
          rotateY: lerp(prev.rotateY, targetTilt.rotateY, springFactor),
          glareX: lerp(prev.glareX, targetTilt.glareX, springFactor),
          glareY: lerp(prev.glareY, targetTilt.glareY, springFactor),
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
  }, [targetTilt, isHovering, isReducedMotion, springFactor]);

  const handlers = {
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      if (isReducedMotion) return;
      setTargetTilt(calculateTilt(e.clientX, e.clientY));
    },
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => {
      setIsHovering(false);
      setTargetTilt(INITIAL_TILT);
    },
    onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => {
      if (isReducedMotion) return;
      const touch = e.touches[0];
      if (touch) {
        setTargetTilt(calculateTilt(touch.clientX, touch.clientY));
      }
    },
    onTouchStart: () => setIsHovering(true),
    onTouchEnd: () => {
      setIsHovering(false);
      setTargetTilt(INITIAL_TILT);
    },
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
  const boxShadow = isReducedMotion
    ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
    : `${shadowX}px ${shadowY + 20}px 40px rgba(0, 0, 0, 0.2)`;

  return {
    cardRef,
    handlers,
    cardStyle,
    boxShadow,
    currentTilt,
    isReducedMotion,
  };
}

