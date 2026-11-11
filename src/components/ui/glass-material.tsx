import { useEffect, useId, useRef, useState } from 'react';

export function GlassMaterial({ circular = false }: { circular?: boolean }) {
  const id = useId();
  const surfaceRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(circular ? 104 : 360);
  const fill = (name: string) => `url(#${id}-${name})`;

  useEffect(() => {
    const surface = surfaceRef.current?.parentElement;
    if (!surface) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const bounds = entry.borderBoxSize[0];
      if (bounds.blockSize > 0) setWidth((bounds.inlineSize / bounds.blockSize) * 104);
    });
    resizeObserver.observe(surface);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <svg
      ref={surfaceRef}
      className="glass-material"
      viewBox={`0 0 ${width} 104`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={`${id}-shell`}>
          <rect width={width} height="104" fill="white" />
          <rect x="3" y="3" width={width - 6} height="98" rx="49" fill="black" />
        </mask>
        <linearGradient id={`${id}-rim`} x2="0" y2="1">
          <stop stopColor="var(--depth-tint)" stopOpacity="0.8" />
          <stop offset="0.08" stopColor="var(--depth-white)" stopOpacity="0.95" />
          <stop offset="0.2" stopColor="var(--depth-rim)" stopOpacity="0.7" />
          <stop offset="0.66" stopColor="var(--depth-tint)" stopOpacity="0.8" />
          <stop offset="0.9" stopColor="var(--depth-refraction)" />
          <stop offset="1" stopColor="var(--depth-tint)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x2="0.1" y2="1">
          <stop stopColor="var(--depth-white)" stopOpacity="0.8" />
          <stop offset="0.24" stopColor="var(--depth-core)" stopOpacity="0.8" />
          <stop offset="0.55" stopColor="var(--depth-core)" stopOpacity="0.65" />
          <stop offset="0.78" stopColor="var(--depth-rim)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--depth-refraction)" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={`${id}-volume`} cx="0.5" cy="0.35" r="0.75">
          <stop offset="0.2" stopColor="var(--depth-white)" stopOpacity="0" />
          <stop offset="0.65" stopColor="var(--depth-white)" stopOpacity="0.04" />
          <stop offset="0.88" stopColor="var(--depth-refraction)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--depth-tint)" stopOpacity="0.25" />
        </radialGradient>
        <linearGradient id={`${id}-top`} x2="0.8" y2="1">
          <stop stopColor="var(--depth-white)" />
          <stop offset="0.3" stopColor="var(--depth-white)" stopOpacity="0.95" />
          <stop offset="0.8" stopColor="var(--depth-white)" stopOpacity="0.25" />
          <stop offset="1" stopColor="var(--depth-white)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-bottom`} x1="1" y1="1" x2="0.1" y2="0">
          <stop stopColor="var(--depth-white)" />
          <stop offset="0.4" stopColor="var(--depth-white)" stopOpacity="0.95" />
          <stop offset="0.85" stopColor="var(--depth-refraction)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--depth-white)" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`${id}-ends`} x2="1" y2="0.8">
          <stop stopColor="var(--depth-white)" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="var(--depth-refraction)" stopOpacity="0.2" />
          <stop offset="0.65" stopColor="var(--depth-tint)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--depth-white)" stopOpacity="0.9" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="0.65" />
        </filter>
        <filter id={`${id}-glow`} x="-15%" y="-50%" width="130%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <rect
        x="0.75"
        y="0.75"
        width={width - 1.5}
        height="102.5"
        rx="51.25"
        fill={fill('rim')}
        mask={fill('shell')}
      />
      <rect x="3" y="3" width={width - 6} height="98" rx="49" fill={fill('face')} />
      <rect x="5" y="5" width={width - 10} height="94" rx="47" fill={fill('volume')} />
      <g className="glass-reflections">
        <path
          d={`M12 52C9 30 24 10 51 10H${width - 51}C${width - 28} 10 ${width - 14} 20 ${width - 12} 37C${width - 23} 23 ${width - 39} 21 ${width - 58} 21H57C34 21 23 32 24 45C25 55 17 59 12 52Z`}
          fill={fill('top')}
          filter={fill('soft')}
        />
        <path
          d={`M9 57C15 78 32 88 55 88H${width - 55}C${width - 30} 88 ${width - 17} 76 ${width - 16} 60C${width - 15} 50 ${width - 8} 53 ${width - 9} 65C${width - 11} 84 ${width - 30} 97 ${width - 55} 97H55C29 97 12 81 9 57Z`}
          fill="var(--depth-refraction)"
          filter={fill('glow')}
        />
        <path
          d={`M10 61C18 80 34 88 56 88H${width - 56}C${width - 32} 88 ${width - 23} 79 ${width - 21} 65C${width - 20} 57 ${width - 14} 56 ${width - 12} 63C${width - 6} 81 ${width - 28} 96 ${width - 56} 96H56C32 96 14 81 10 61Z`}
          fill={fill('bottom')}
          filter={fill('soft')}
        />
        <path
          d={`M12 26C4 36 2 56 11 70C5 54 12 48 14 43C16 37 11 33 12 26ZM${width - 12} 35C${width - 5} 46 ${width - 3} 62 ${width - 12} 77C${width - 5} 62 ${width - 15} 58 ${width - 15} 52C${width - 15} 46 ${width - 10} 42 ${width - 12} 35Z`}
          fill={fill('ends')}
          filter={fill('soft')}
        />
        <path
          d={`M27 73C34 81 49 84 66 83C49 88 34 84 27 73ZM${width - 82} 80C${width - 54} 82 ${width - 37} 75 ${width - 29} 68C${width - 36} 83 ${width - 59} 88 ${width - 82} 80Z`}
          fill={fill('ends')}
          opacity="0.6"
          filter={fill('glow')}
        />
      </g>
      <rect
        x="0.75"
        y="0.75"
        width={width - 1.5}
        height="102.5"
        rx="51.25"
        fill="none"
        stroke="var(--depth-tint)"
        strokeOpacity="0.45"
        strokeWidth="0.65"
      />
    </svg>
  );
}
