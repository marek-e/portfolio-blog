import { useMemo } from 'react';

const COLORS = ['#f0c85a', '#e88aa8', '#5aa864', '#3b82c4', '#c96f4a', '#8a6ab8'];
const PIECE_COUNT = 60;

/**
 * One-shot confetti burst for the 6/6 celebration (PRD §6.8). Purely decorative DOM —
 * ProjectsWorld only mounts it when the celebration fires and prefers-reduced-motion
 * is off (§6.9); pieces fall once and the component is unmounted by a timer.
 */
export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.6,
        size: 7 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        spin: Math.random() > 0.5 ? 1 : -1,
      })),
    []
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <style>{`
        @keyframes world-confetti-fall {
          0% { transform: translateY(-6vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(var(--spin)); opacity: 0.6; }
        }
      `}</style>
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="absolute top-0 block rounded-[2px]"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            animation: `world-confetti-fall ${piece.duration}s ${piece.delay}s ease-in forwards`,
            ['--spin' as string]: `${piece.spin * (540 + Math.random() * 360)}deg`,
          }}
        />
      ))}
    </div>
  );
}
