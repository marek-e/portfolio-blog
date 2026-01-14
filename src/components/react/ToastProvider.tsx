import { useEffect, useRef } from 'react';
import { toast as sonnerToast, Toaster } from 'sonner';
import { TOAST_EVENT, type ToastEventDetail } from '@/lib/toast';
import { cn } from '@/lib/utils';

export function ToastProvider() {
  const listenerAttached = useRef(false);

  useEffect(() => {
    // Prevent duplicate listeners
    if (listenerAttached.current) return;
    listenerAttached.current = true;

    function handleToastEvent(event: CustomEvent<ToastEventDetail>) {
      const { type, title, description, duration } = event.detail;
      const options = { description, duration };

      switch (type) {
        case 'success':
          sonnerToast.success(title, options);
          break;
        case 'error':
          sonnerToast.error(title, options);
          break;
        case 'warning':
          sonnerToast.warning(title, options);
          break;
        case 'info':
          sonnerToast.info(title, options);
          break;
        default:
          sonnerToast(title, options);
      }
    }

    window.addEventListener(TOAST_EVENT, handleToastEvent);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToastEvent);
      listenerAttached.current = false;
    };
  }, []);

  return (
    <Toaster
      position="bottom-right"
      gap={8}
      style={{ zIndex: 9999 }}
      toastOptions={{
        duration: 5000,
        unstyled: true,
        classNames: {
          toast: cn(
            'bg-popover text-popover-foreground',
            'border border-border rounded-lg shadow-lg',
            'p-4 flex items-start gap-3 w-[356px]',
            'motion-safe:animate-in motion-safe:slide-in-from-bottom-5',
            'motion-safe:data-[removed=true]:animate-out motion-safe:data-[removed=true]:fade-out-80',
            'motion-reduce:opacity-100'
          ),
          title: 'font-medium text-sm',
          description: 'text-muted-foreground text-sm mt-1',
          success: 'border-l-4 border-l-green-500 dark:border-l-green-400',
          error: 'border-l-4 border-l-destructive',
          warning: 'border-l-4 border-l-amber-500 dark:border-l-amber-400',
          info: 'border-l-4 border-l-blue-500 dark:border-l-blue-400',
          closeButton: cn(
            'absolute top-2 right-2 p-1 rounded-md',
            'text-muted-foreground hover:text-foreground hover:bg-muted',
            'focus-visible:ring-ring focus-visible:ring-2'
          ),
          actionButton: cn(
            'bg-primary text-primary-foreground',
            'px-3 py-1.5 rounded-md text-sm font-medium',
            'hover:bg-primary/90'
          ),
        },
      }}
    />
  );
}
