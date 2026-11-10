import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function useTiltEffect() {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const card = cardRef.current;
    const surface = tiltRef.current;
    if (!card || !surface) return;

    const sheens = card.querySelectorAll<HTMLElement>('.dev-id-card-sheen');
    const glares = card.querySelectorAll<HTMLElement>('.dev-id-card-glare');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const position = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;
    let previousTime = 0;

    const paint = () => {
      surface.style.transform = `rotateX(${-position.y * 5}deg) rotateY(${position.x * 6}deg)`;
      sheens.forEach((sheen) => {
        sheen.style.transform = `translate3d(${position.x * 22}%, ${position.y * 12}%, 0)`;
      });
      glares.forEach((glare) => {
        glare.style.transform = `translate3d(${position.x * 28}%, ${position.y * 22}%, 0)`;
      });
    };

    const animate = (time: number) => {
      const elapsed = Math.min((time - (previousTime || time)) / 1000, 0.032);
      previousTime = time;
      for (const axis of ['x', 'y'] as const) {
        velocity[axis] += ((target[axis] - position[axis]) * 100 - velocity[axis] * 10) * elapsed;
        position[axis] += velocity[axis] * elapsed;
      }

      const settled = (['x', 'y'] as const).every(
        (axis) =>
          Math.abs(target[axis] - position[axis]) < 0.001 && Math.abs(velocity[axis]) < 0.001
      );
      if (settled) {
        Object.assign(position, target);
        Object.assign(velocity, { x: 0, y: 0 });
      }
      paint();
      frame = settled ? 0 : requestAnimationFrame(animate);
      if (settled) previousTime = 0;
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(animate);
    };

    const reset = () => {
      card.removeAttribute('data-hovered');
      Object.assign(target, { x: 0, y: 0 });
      start();
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      card.removeAttribute('data-hovered');
      for (const state of [position, velocity, target]) Object.assign(state, { x: 0, y: 0 });
      paint();
    };

    const move = (event: PointerEvent) => {
      if (isReducedMotion || !pointer.matches || event.pointerType === 'touch') return;
      const bounds = card.getBoundingClientRect();
      target.x = Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
      );
      target.y = Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
      );
      card.setAttribute('data-hovered', '');
      start();
    };

    const visibilityChanged = () => {
      if (document.hidden) stop();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });

    stop();
    if (!isReducedMotion) {
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', reset);
      card.addEventListener('pointercancel', reset);
      pointer.addEventListener('change', stop);
      document.addEventListener('visibilitychange', visibilityChanged);
      observer.observe(card);
    }

    return () => {
      stop();
      observer.disconnect();
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', reset);
      card.removeEventListener('pointercancel', reset);
      pointer.removeEventListener('change', stop);
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, [isReducedMotion]);

  return { cardRef, tiltRef };
}
