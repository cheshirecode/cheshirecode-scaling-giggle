import { atom } from 'jotai';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};

/**
 * Global toast notifications atom
 * Ephemeral state - not persisted
 */
export const toastsAtom = atom<Toast[]>([]);

/**
 * Helper to generate unique toast IDs
 */
export function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

