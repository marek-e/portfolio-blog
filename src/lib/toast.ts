/**
 * Toast event bridge for Astro components
 *
 * React components can use `import { toast } from 'sonner'` directly.
 * Astro components use this bridge which dispatches custom events
 * that ToastProvider listens to.
 */

export interface ToastEventDetail {
  type: 'success' | 'error' | 'warning' | 'info' | 'default';
  title: string;
  description?: string;
  duration?: number;
}

export const TOAST_EVENT = 'app:toast' as const;

function showToast(detail: ToastEventDetail): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
  }
}

type ToastOptions = Omit<ToastEventDetail, 'type' | 'title'>;

export const toast = {
  success: (title: string, options?: ToastOptions) =>
    showToast({ type: 'success', title, ...options }),

  error: (title: string, options?: ToastOptions) => showToast({ type: 'error', title, ...options }),

  warning: (title: string, options?: ToastOptions) =>
    showToast({ type: 'warning', title, ...options }),

  info: (title: string, options?: ToastOptions) => showToast({ type: 'info', title, ...options }),

  default: (title: string, options?: ToastOptions) =>
    showToast({ type: 'default', title, ...options }),
};

declare global {
  interface WindowEventMap {
    [TOAST_EVENT]: CustomEvent<ToastEventDetail>;
  }
}
