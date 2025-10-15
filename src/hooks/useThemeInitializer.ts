import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { themeAtom, applyTheme } from '@/atoms/themeAtom';

/**
 * Hook to initialize and sync theme on mount and changes
 *
 * Reads theme from localStorage (via Jotai) and applies it to DOM.
 * Automatically updates when theme changes.
 *
 * @example
 * ```tsx
 * function App() {
 *   useThemeInitializer(); // Call once at app root
 *   return <YourApp />;
 * }
 * ```
 */
export function useThemeInitializer(): void {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
}
