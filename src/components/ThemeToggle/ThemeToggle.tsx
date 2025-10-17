import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { themeAtom, applyTheme, type Theme } from '@/atoms/themeAtom';
import './ThemeToggle.css';

/**
 * Theme toggle component for switching between light, dark, and system themes
 *
 * Features:
 * - Persists theme preference to localStorage
 * - Applies theme to document on change
 * - Visual feedback for active theme
 * - Keyboard accessible
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle(): JSX.Element {
  const [theme, setTheme] = useAtom(themeAtom);

  const handleThemeChange = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      applyTheme(newTheme);
    },
    [setTheme]
  );

  return (
    <div className={'themeToggle'} role="group" aria-label="Theme selection">
      <button
        type="button"
        className={`${'themeButton'} ${theme === 'light' ? 'active' : ''}`}
        onClick={() => handleThemeChange('light')}
        aria-label="Light theme"
        aria-pressed={theme === 'light'}
        title="Light"
      >
        ☀️
      </button>
      <button
        type="button"
        className={`${'themeButton'} ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => handleThemeChange('dark')}
        aria-label="Dark theme"
        aria-pressed={theme === 'dark'}
        title="Dark"
      >
        🌙
      </button>
      <button
        type="button"
        className={`${'themeButton'} ${theme === 'system' ? 'active' : ''}`}
        onClick={() => handleThemeChange('system')}
        aria-label="System theme"
        aria-pressed={theme === 'system'}
        title="System"
      >
        💻
      </button>
    </div>
  );
}
