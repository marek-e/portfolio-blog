import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import '@/styles/project-liquid-glass.css';

export function LiquidGlassMaterial({
  radius = 36,
  circular = false,
}: {
  radius?: number;
  circular?: boolean;
}) {
  const id = `liquid-${useId().replaceAll(':', '')}`;
  const surfaceRef = useRef<HTMLSpanElement>(null);
  const [{ width, height }, setSize] = useState(
    circular ? { width: 44, height: 44 } : { width: 320, height: 460 }
  );
  const r = Math.min(radius, width / 2, height / 2);
  const bevel = Math.min(8, r * 0.24);
  const fill = (name: string) => `url(#${id}-${name})`;
  const corner = `M4 ${r + 10}C4 14 14 4 ${r + 16} 4C${r + 2} 7 11 13 8 ${r + 3}C7 ${r + 10} 5 ${r + 14} 4 ${r + 10}Z`;

  useEffect(() => {
    const surface = surfaceRef.current?.parentElement;
    if (!surface) return;
    const observer = new ResizeObserver(([entry]) => {
      const size = entry.borderBoxSize[0];
      if (size.inlineSize > 0 && size.blockSize > 0) {
        setSize({ width: size.inlineSize, height: size.blockSize });
      }
    });
    observer.observe(surface);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={surfaceRef}
      className="liquid-glass-material"
      data-shape={circular ? 'circle' : radius === 999 ? 'capsule' : 'rounded'}
      style={{ '--liquid-radius': `${r}px`, '--liquid-bevel': `${bevel}px` } as CSSProperties}
      aria-hidden="true"
    >
      <span className="liquid-glass-bevel" />
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id={`${id}-contour`} x1="0" y1="0" x2="0.85" y2="1">
            <stop stopColor="var(--liquid-shade)" stopOpacity="0.65" />
            <stop offset="0.16" stopColor="var(--liquid-white)" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="var(--liquid-shade)" stopOpacity="0.12" />
            <stop offset="0.72" stopColor="var(--liquid-white)" stopOpacity="0.8" />
            <stop offset="1" stopColor="var(--liquid-shade)" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`${id}-light`} x1="0" y1="0" x2="0.9" y2="1">
            <stop stopColor="var(--liquid-white)" stopOpacity="0.95" />
            <stop offset="0.32" stopColor="var(--liquid-white)" stopOpacity="0.15" />
            <stop offset="0.65" stopColor="var(--liquid-white)" stopOpacity="0.04" />
            <stop offset="1" stopColor="var(--liquid-white)" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id={`${id}-color`} x1="0" y1="0.2" x2="1" y2="0.8">
            <stop stopColor="var(--liquid-left)" stopOpacity="0.65" />
            <stop offset="0.38" stopColor="var(--liquid-left)" stopOpacity="0" />
            <stop offset="0.62" stopColor="var(--liquid-right)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--liquid-right)" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id={`${id}-glint`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--liquid-white)" />
            <stop offset="0.55" stopColor="var(--liquid-white)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--liquid-white)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-fade`}>
            <stop stopColor="white" />
            <stop offset="1" stopColor="black" />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <rect x="0.5" y="0.5" width={width - 1} height={height - 1} rx={r - 0.5} />
          </clipPath>
          <mask id={`${id}-corners`}>
            <rect width={width} height={height} fill="black" />
            <ellipse cx={r * 0.45} cy={r * 0.65} rx={r * 2} ry={r * 1.7} fill={fill('fade')} />
            <ellipse
              cx={width - r * 0.45}
              cy={height - r * 0.65}
              rx={r * 2.2}
              ry={r * 1.7}
              fill={fill('fade')}
            />
            <ellipse cx={width - r} cy={r * 0.4} rx={r * 1.5} ry={r} fill={fill('fade')} />
          </mask>
          <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
        </defs>
        <g clipPath={fill('clip')}>
          <rect
            className="liquid-glass-rim"
            x={bevel / 2}
            y={bevel / 2}
            width={width - bevel}
            height={height - bevel}
            rx={r - bevel / 2}
            fill="none"
            stroke={fill('light')}
            strokeWidth={bevel}
            filter={fill('soft')}
          />
          {circular ? (
            <>
              <circle
                cx={width / 2}
                cy={height / 2}
                r={r - 3}
                fill="none"
                stroke={fill('light')}
                strokeWidth="1.6"
                strokeDasharray={`${r * 0.95} ${r * 8}`}
                strokeLinecap="round"
                transform={`rotate(-160 ${width / 2} ${height / 2})`}
              />
              <circle
                cx={width / 2}
                cy={height / 2}
                r={r - 3}
                fill="none"
                stroke={fill('light')}
                strokeWidth="1.2"
                strokeDasharray={`${r * 0.8} ${r * 8}`}
                strokeLinecap="round"
                transform={`rotate(25 ${width / 2} ${height / 2})`}
                opacity="0.6"
              />
            </>
          ) : (
            <>
              <rect
                x={bevel - 1}
                y={bevel - 1}
                width={width - (bevel - 1) * 2}
                height={height - (bevel - 1) * 2}
                rx={r - bevel + 1}
                fill="none"
                stroke="var(--liquid-shade)"
                strokeWidth="1.4"
                opacity="0.4"
                mask={fill('corners')}
                filter={fill('soft')}
              />
              <rect
                className="liquid-glass-color"
                x={bevel / 2}
                y={bevel / 2}
                width={width - bevel}
                height={height - bevel}
                rx={r - bevel / 2}
                fill="none"
                stroke={fill('color')}
                strokeWidth={bevel * 0.7}
                mask={fill('corners')}
                filter={fill('soft')}
              />
              <rect
                className="liquid-glass-reflection"
                x="3"
                y="3"
                width={width - 6}
                height={height - 6}
                rx={r - 3}
                fill="none"
                stroke={fill('light')}
                strokeWidth="2.4"
                mask={fill('corners')}
                filter={fill('soft')}
              />
              <path className="liquid-glass-glint" d={corner} fill={fill('glint')} />
              <path
                className="liquid-glass-glint"
                d={corner}
                transform={`translate(${width} ${height}) rotate(180)`}
                fill={fill('glint')}
                opacity="0.8"
              />
            </>
          )}
        </g>
        <rect
          x="0.6"
          y="0.6"
          width={width - 1.2}
          height={height - 1.2}
          rx={r - 0.6}
          fill="none"
          stroke={fill('contour')}
          strokeWidth="1.2"
        />
      </svg>
    </span>
  );
}
