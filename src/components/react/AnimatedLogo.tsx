import { motion } from 'motion/react';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface AnimatedLogoProps {
  className?: string;
}

const springBounce = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 15,
};

const springHover = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 10,
};

export function AnimatedLogo({ className }: AnimatedLogoProps) {
  const isReducedMotion = useReducedMotion();

  const getDelay = (index: number) => (isReducedMotion ? 0 : index * 0.08);

  const pieceVariants = {
    hidden: (custom: { x?: number; y?: number; rotate?: number; scale?: number }) =>
      isReducedMotion
        ? { opacity: 1 }
        : {
            opacity: 0,
            x: custom.x ?? 0,
            y: custom.y ?? 0,
            rotate: custom.rotate ?? 0,
            scale: custom.scale ?? 1,
          },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    },
  };

  return (
    <motion.svg
      width="1146"
      height="820"
      viewBox="-40 -40 1146 820"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial="hidden"
      animate="visible"
      whileHover={isReducedMotion ? undefined : { scale: 1.1, rotate: -3 }}
      transition={springHover}
    >
      {/* Left diagonal pillar (pink) - from bottom-left */}
      <g transform="matrix(0.866025 0.5 -0.530526 0.847668 395.259 1)">
        <motion.rect
          width="220"
          height="743.147"
          rx="110"
          fill="#F67280"
          custom={{ x: -200, y: 150, rotate: -25 }}
          variants={pieceVariants}
          transition={{ ...springBounce, delay: getDelay(0) }}
        />
      </g>

      {/* Right diagonal pillar (mauve) - from bottom-right */}
      <g transform="matrix(0.866025 0.5 -0.530526 0.847668 654.315 0)">
        <motion.rect
          width="220"
          height="667.582"
          rx="110"
          fill="#C06C84"
          custom={{ x: 200, y: 150, rotate: 25 }}
          variants={pieceVariants}
          transition={{ ...springBounce, delay: getDelay(1) }}
        />
      </g>

      {/* Top horizontal pill (blue) - slide from right */}
      <motion.rect
        x="584"
        y="40"
        width="440"
        height="220"
        rx="110"
        fill="#355C7D"
        custom={{ x: 300 }}
        variants={pieceVariants}
        transition={{ ...springBounce, delay: getDelay(2) }}
      />

      {/* Bottom horizontal pill (blue) - slide from right */}
      <motion.rect
        x="584"
        y="480"
        width="440"
        height="220"
        rx="110"
        fill="#355C7D"
        custom={{ x: 300 }}
        variants={pieceVariants}
        transition={{ ...springBounce, delay: getDelay(3) }}
      />

      {/* Middle connector (blue) - slide from right */}
      <motion.rect
        x="803.76"
        y="260"
        width="220"
        height="220"
        rx="110"
        fill="#355C7D"
        custom={{ x: 250 }}
        variants={pieceVariants}
        transition={{ ...springBounce, delay: getDelay(4) }}
      />

      {/* Vertical bar (purple) - drop from top */}
      <motion.rect
        x="583.76"
        y="40"
        width="220"
        height="660"
        rx="110"
        fill="#6C5B7B"
        custom={{ y: -200 }}
        variants={pieceVariants}
        transition={{ ...springBounce, delay: getDelay(5) }}
      />
    </motion.svg>
  );
}
