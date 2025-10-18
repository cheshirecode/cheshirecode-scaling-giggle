import { useAtom } from 'jotai';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { themeAtom, applyTheme, type Theme } from '@/atoms/themeAtom';
import './ThemeToggle.css';

/**
 * Theme toggle component for switching between light, dark, and system themes
 *
 * Features:
 * - Persists theme preference to localStorage
 * - Applies theme to document on change
 * - Dropdown interface with icons and descriptions
 * - Keyboard accessible
 * - Defaults to system theme
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle(): JSX.Element {
  const { t } = useTranslation();
  const [theme, setTheme] = useAtom(themeAtom);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      applyTheme(newTheme);
      setIsOpen(false);
    },
    [setTheme]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const getThemeIcon = (themeValue: Theme): string => {
    switch (themeValue) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '💻';
    }
  };

  const getThemeLabel = (themeValue: Theme): string => {
    return t(`theme.${themeValue}`);
  };

  const getThemeDescription = (themeValue: Theme): string => {
    return t(`theme.${themeValue}Desc`);
  };

  return (
    <div className="themeToggle" ref={dropdownRef}>
      <button
        type="button"
        className="themeToggleButton"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('theme.label')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="themeToggleIcon">{getThemeIcon(theme)}</span>
        <span className="themeToggleLabel">{getThemeLabel(theme)}</span>
        <span className="themeToggleArrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="themeDropdown" role="menu">
          {(['system', 'light', 'dark'] as const).map((themeOption) => (
            <button
              key={themeOption}
              type="button"
              className={`themeOption ${theme === themeOption ? 'active' : ''}`}
              onClick={() => handleThemeChange(themeOption)}
              role="menuitem"
              aria-label={`${getThemeLabel(themeOption)} - ${getThemeDescription(themeOption)}`}
            >
              <span className="themeOptionIcon">{getThemeIcon(themeOption)}</span>
              <div className="themeOptionContent">
                <span className="themeOptionLabel">{getThemeLabel(themeOption)}</span>
                <span className="themeOptionDesc">{getThemeDescription(themeOption)}</span>
              </div>
              {theme === themeOption && (
                <span className="themeOptionCheck" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
