import { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface TypingAnimationProps {
  translations: {
    greeting: string;
    name: string;
    role: string;
    seoText: string;
  };
  className?: string;
}

type AnimationPhase =
  | 'typing-greeting'
  | 'typing-name'
  | 'pause-after-name'
  | 'deleting-name'
  | 'pause-before-role'
  | 'typing-role'
  | 'complete';

const TIMING = {
  initialDelay: 500,
  typeSpeed: 80,
  pauseAfterName: 1500,
  deleteSpeed: 50,
  pauseBeforeRole: 400,
  cursorHideDelay: 2000,
} as const;

export function TypingAnimation({ translations, className }: TypingAnimationProps) {
  const isReducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<AnimationPhase>('typing-greeting');
  const [showCursor, setShowCursor] = useState(true);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  const finalText = `${translations.greeting} ${translations.role}`;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplayText(finalText);
      setPhase('complete');
      setShowCursor(false);
      return;
    }

    const scheduleNextFrame = (callback: () => void, delay: number) => {
      timeoutRef.current = setTimeout(callback, delay);
    };

    switch (phase) {
      case 'typing-greeting': {
        const target = translations.greeting + ' ';
        if (charIndexRef.current < target.length) {
          scheduleNextFrame(() => {
            setDisplayText(target.slice(0, charIndexRef.current + 1));
            charIndexRef.current++;
          }, charIndexRef.current === 0 ? TIMING.initialDelay : TIMING.typeSpeed);
        } else {
          charIndexRef.current = 0;
          setPhase('typing-name');
        }
        break;
      }

      case 'typing-name': {
        const prefix = translations.greeting + ' ';
        if (charIndexRef.current < translations.name.length) {
          scheduleNextFrame(() => {
            setDisplayText(prefix + translations.name.slice(0, charIndexRef.current + 1));
            charIndexRef.current++;
          }, TIMING.typeSpeed);
        } else {
          charIndexRef.current = translations.name.length;
          setPhase('pause-after-name');
        }
        break;
      }

      case 'pause-after-name':
        scheduleNextFrame(() => setPhase('deleting-name'), TIMING.pauseAfterName);
        break;

      case 'deleting-name': {
        const prefix = translations.greeting + ' ';
        if (charIndexRef.current > 0) {
          scheduleNextFrame(() => {
            charIndexRef.current--;
            setDisplayText(prefix + translations.name.slice(0, charIndexRef.current));
          }, TIMING.deleteSpeed);
        } else {
          setPhase('pause-before-role');
        }
        break;
      }

      case 'pause-before-role':
        charIndexRef.current = 0;
        scheduleNextFrame(() => setPhase('typing-role'), TIMING.pauseBeforeRole);
        break;

      case 'typing-role': {
        const prefix = translations.greeting + ' ';
        if (charIndexRef.current < translations.role.length) {
          scheduleNextFrame(() => {
            setDisplayText(prefix + translations.role.slice(0, charIndexRef.current + 1));
            charIndexRef.current++;
          }, TIMING.typeSpeed);
        } else {
          setPhase('complete');
          scheduleNextFrame(() => setShowCursor(false), TIMING.cursorHideDelay);
        }
        break;
      }

      case 'complete':
        break;
    }
  }, [phase, displayText, translations, isReducedMotion, finalText]);

  return (
    <h1 id="hello" className={className}>
      <span className="sr-only">{translations.seoText}</span>
      <span aria-hidden="true">
        {displayText}
        {showCursor && (
          <span className="animate-cursor-blink ml-0.5 inline-block h-[1em] w-[3px] translate-y-[0.1em] bg-current" />
        )}
      </span>
    </h1>
  );
}
