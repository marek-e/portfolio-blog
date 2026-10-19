interface HolographicOverlayProps {
  rotateY: number;
  glareX: number;
  glareY: number;
}

export function HolographicOverlay({ rotateY, glareX, glareY }: HolographicOverlayProps) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-35 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-80 dark:opacity-25 dark:mix-blend-overlay dark:group-hover:opacity-60"
        style={{
          background: `linear-gradient(
            ${115 + rotateY * 3}deg,
            transparent 8%,
            var(--pastel-peach) 22%,
            var(--pastel-rose) 34%,
            var(--pastel-lilac) 46%,
            var(--pastel-sky) 58%,
            var(--pastel-mint) 70%,
            var(--pastel-butter) 82%,
            transparent 94%
          )`,
          backgroundSize: '220% 220%',
          backgroundPosition: `${glareX}% ${glareY}%`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(
            circle at ${glareX}% ${glareY}%,
            oklch(1 0 0 / 0.45) 0%,
            oklch(1 0 0 / 0.08) 35%,
            transparent 60%
          )`,
        }}
      />
    </>
  );
}
