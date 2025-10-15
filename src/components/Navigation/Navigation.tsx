/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
// Third-party library types (wouter, i18next) have known type issues that are safe to ignore
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { themeAtom, applyTheme, type Theme } from '@/atoms/themeAtom';
import styles from './Navigation.module.css';

/**
 * Navigation component with theme toggle and language switcher
 *
 * Features:
 * - Links to Home and Applications pages
 * - Theme toggle (Light/Dark/System)
 * - Language switcher (EN/FR)
 * - Active link highlighting
 * - Responsive design
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */
export function Navigation(): JSX.Element {
  const [theme, setTheme] = useAtom(themeAtom);
  const { t, i18n } = useTranslation();
  const locationResult = useLocation();

  const location: string = locationResult[0];

  const handleThemeChange = (newTheme: Theme): void => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLanguageChange = (lng: string): void => {
    void i18n.changeLanguage(lng);
  };

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location === '/';
    }
    return location.startsWith(path);
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        {/* Logo / Brand */}
        <div className={styles.brand}>
          <a href="/" className={styles.logoLink}>
            Nesto
          </a>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
          <a href="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
            {t('navigation.home')}
          </a>
          <a
            href="/applications"
            className={`${styles.link} ${isActive('/applications') ? styles.active : ''}`}
          >
            {t('navigation.applications')}
          </a>
        </div>

        {/* Controls: Language + Theme */}
        <div className={styles.controls}>
          {/* Language Switcher */}
          <div className={styles.languageSwitcher}>
            <button
              type="button"
              className={`${styles.languageButton} ${i18n.language === 'en' ? styles.activeLanguage : ''}`}
              onClick={() => handleLanguageChange('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
            <span className={styles.separator}>|</span>
            <button
              type="button"
              className={`${styles.languageButton} ${i18n.language === 'fr' ? styles.activeLanguage : ''}`}
              onClick={() => handleLanguageChange('fr')}
              aria-label="Passer au français"
            >
              FR
            </button>
          </div>

          {/* Theme Toggle */}
          <div className={styles.themeToggle}>
            <button
              type="button"
              className={`${styles.themeButton} ${theme === 'light' ? styles.activeTheme : ''}`}
              onClick={() => handleThemeChange('light')}
              aria-label="Light theme"
              title="Light"
            >
              ☀️
            </button>
            <button
              type="button"
              className={`${styles.themeButton} ${theme === 'dark' ? styles.activeTheme : ''}`}
              onClick={() => handleThemeChange('dark')}
              aria-label="Dark theme"
              title="Dark"
            >
              🌙
            </button>
            <button
              type="button"
              className={`${styles.themeButton} ${theme === 'system' ? styles.activeTheme : ''}`}
              onClick={() => handleThemeChange('system')}
              aria-label="System theme"
              title="System"
            >
              💻
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
