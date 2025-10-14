import { atomWithStorage } from 'jotai/utils';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme atom with localStorage persistence
 * Default: 'system' (follows prefers-color-scheme)
 */
export const themeAtom = atomWithStorage<Theme>('theme', 'system');

/**
 * Apply theme to document
 * @param theme - Theme to apply
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

/**
 * Get effective theme (resolves 'system' to 'light' or 'dark')
 * @param theme - Current theme setting
 * @returns Effective theme ('light' or 'dark')
 */
export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') {
    return theme;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

