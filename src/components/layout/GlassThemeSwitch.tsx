import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Moon02Icon, SunIcon } from '@hugeicons/core-free-icons';
import { Icon } from '@/components/shared/Icon';
import { createGlassRenderer, type GlassRenderer } from './glass-theme-switch/renderer';
import { landing, resist } from './glass-theme-switch/physics';
import { createFooterPreview } from './glass-theme-switch/preview';
import type { Lang } from '@/i18n';
import { applyTheme, getTheme } from '@/lib/theme';
import './glass-theme-switch/styles.css';

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export function GlassThemeSwitch({ lang }: { lang: Lang }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'light');
  const labels =
    lang === 'fr'
      ? {
          light: 'Thème clair',
          switchLight: 'Passer au thème clair',
          switchDark: 'Passer au thème sombre',
        }
      : {
          light: 'Light theme',
          switchLight: 'Switch to light theme',
          switchDark: 'Switch to dark theme',
        };
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GlassRenderer | null>(null);
  const gesture = useRef({
    active: false,
    dragging: false,
    pointerId: -1,
    startX: 0,
    start: 0,
    travel: 1,
    lastTime: 0,
    velocity: 0,
    moved: false,
  });

  useEffect(() => {
    const initial = getTheme() === 'light' ? 1 : 0;
    const preview = createFooterPreview(buttonRef.current!, initial);
    const renderer = createGlassRenderer(canvasRef.current!, initial, preview.update);
    if (!renderer) preview.destroy();
    rendererRef.current = renderer;
    const button = buttonRef.current!;
    const canvas = canvasRef.current!;
    const lost = () => {
      rendererRef.current = null;
      delete button.dataset.rendering;
      renderer?.destroy();
      preview.destroy();
    };
    canvas.addEventListener('webglcontextlost', lost);
    if (renderer) button.dataset.rendering = 'webgl';
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      renderer?.destroy();
      preview.destroy();
      rendererRef.current = null;
      delete button.dataset.rendering;
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setTarget(getTheme() === 'light' ? 1 : 0);
  }, [theme]);

  const commit = (next: number, velocity = 0, immediate = false, dragged = false) => {
    rendererRef.current?.release(next, velocity, immediate, dragged);
    applyTheme(next ? 'light' : 'dark');
  };
  const cancel = () => {
    if (!gesture.current.active) return;
    gesture.current.active = false;
    delete buttonRef.current!.dataset.dragging;
    rendererRef.current?.release(theme === 'light' ? 1 : 0);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className="theme-glass"
      role="switch"
      aria-checked={theme === 'light'}
      aria-label={labels.light}
      title={theme === 'dark' ? labels.switchLight : labels.switchDark}
      onClick={(event) => {
        if (event.detail === 0) commit(theme === 'dark' ? 1 : 0, 0, true);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        event.stopPropagation();
        commit(event.key === 'ArrowRight' ? 1 : 0, 0, true);
      }}
      onPointerEnter={(event) => {
        rendererRef.current?.hover(event.pointerType === 'mouse');
      }}
      onPointerLeave={() => rendererRef.current?.hover(false)}
      onPointerDown={(event) => {
        if (event.button !== 0 || gesture.current.active) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const dragging =
          rendererRef.current?.hitKnob(
            ((event.clientX - rect.left) / rect.width - 0.5) * 432,
            ((event.clientY - rect.top) / rect.height - 0.5) * 224
          ) ?? false;
        const current = rendererRef.current?.getProgress() ?? (theme === 'light' ? 1 : 0);
        gesture.current = {
          active: true,
          dragging,
          pointerId: event.pointerId,
          startX: event.clientX,
          start: current,
          travel: (event.currentTarget.clientWidth * 208) / 432,
          lastTime: event.timeStamp,
          velocity: 0,
          moved: false,
        };
        rendererRef.current?.press();
        if (dragging) {
          rendererRef.current?.startDrag();
          event.currentTarget.dataset.dragging = '';
        }
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const drag = gesture.current;
        if (!drag.active || !drag.dragging || event.pointerId !== drag.pointerId) return;
        const delta = event.clientX - drag.startX;
        drag.moved ||= Math.abs(delta) > 4;
        const next = resist(drag.start + delta / drag.travel);
        const elapsed = Math.max(1, event.timeStamp - drag.lastTime) / 1000;
        const previous = rendererRef.current?.getProgress() ?? drag.start;
        drag.velocity = drag.velocity * 0.6 + ((next - previous) / elapsed) * 0.4;
        drag.lastTime = event.timeStamp;
        rendererRef.current?.dragTo(next, drag.velocity);
      }}
      onPointerUp={(event) => {
        const drag = gesture.current;
        if (!drag.active || event.pointerId !== drag.pointerId) return;
        drag.active = false;
        delete event.currentTarget.dataset.dragging;
        const progress =
          rendererRef.current?.getProgress() ??
          drag.start + (event.clientX - drag.startX) / drag.travel;
        const velocity = event.timeStamp - drag.lastTime < 100 ? drag.velocity : 0;
        const target = rendererRef.current?.getTarget() ?? (theme === 'light' ? 1 : 0);
        const next = drag.dragging && drag.moved ? landing(progress, velocity) : 1 - target;
        commit(
          next,
          drag.dragging && drag.moved ? velocity : 0,
          false,
          drag.dragging && drag.moved
        );
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={cancel}
      onLostPointerCapture={cancel}
    >
      <span className="theme-glass-fallback" aria-hidden="true">
        <span>
          <Icon icon={SunIcon} className="theme-glass-fallback-sun" size={18} strokeWidth={1.7} />
          <Icon
            icon={Moon02Icon}
            className="theme-glass-fallback-moon"
            size={18}
            strokeWidth={1.7}
          />
        </span>
      </span>
      <canvas ref={canvasRef} className="theme-glass-canvas" aria-hidden="true" />
    </button>
  );
}
