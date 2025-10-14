import { atom } from 'jotai';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Global toast notifications atom
 * Ephemeral state - not persisted
 *
 * @example
 * import { useAtom } from 'jotai';
 * import { toastsAtom, generateToastId } from '@/atoms/toastsAtom';
 *
 * function MyComponent() {
 *   const [toasts, setToasts] = useAtom(toastsAtom);
 *
 *   const addToast = (message: string, type: ToastType = 'info') => {
 *     setToasts([...toasts, {
 *       id: generateToastId(),
 *       type,
 *       message,
 *       duration: 5000,
 *     }]);
 *   };
 * }
 */
export const toastsAtom = atom<Toast[]>([]);

/**
 * Helper to generate unique toast IDs
 */
export function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

