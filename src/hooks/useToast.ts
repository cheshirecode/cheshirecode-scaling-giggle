import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { toastsAtom, type Toast } from '../atoms/toastsAtom';

/**
 * Hook to manage toast notifications using Jotai atom
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { showToast, hideToast } = useToast();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       showToast({ message: 'Saved successfully!', type: 'success' });
 *     } catch (error) {
 *       showToast({ message: 'Save failed', type: 'error' });
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useToast(): {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
} {
  const [toasts, setToasts] = useAtom(toastsAtom);

  /**
   * Show a new toast notification
   * @returns The ID of the created toast
   */
  const showToast = useCallback(
    (toast: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newToast: Toast = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after duration (default 5 seconds)
      const duration = toast.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    [setToasts]
  );

  /**
   * Manually hide a toast by ID
   */
  const hideToast = useCallback(
    (id: string): void => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [setToasts]
  );

  /**
   * Clear all toasts
   */
  const clearAllToasts = useCallback((): void => {
    setToasts([]);
  }, [setToasts]);

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
  };
}
