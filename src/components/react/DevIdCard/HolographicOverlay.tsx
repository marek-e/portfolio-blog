interface HolographicOverlayProps {
  rotateY: number;
  glareX: number;
  glareY: number;
}

export function HolographicOverlay({ rotateY, glareX, glareY }: HolographicOverlayProps) {
  return (
    <>
      {/* Holographic rainbow effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 transition-opacity duration-300 group-hover:opacity-50"
        style={{
          background: `linear-gradient(
            ${125 + rotateY * 2}deg,
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
          backgroundPosition: `${glareX}% ${glareY}%`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Glare spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(
            circle at ${glareX}% ${glareY}%,
            oklch(1 0 0 / 0.5) 0%,
            transparent 50%
          )`,
        }}
      />
    </>
  );
}

