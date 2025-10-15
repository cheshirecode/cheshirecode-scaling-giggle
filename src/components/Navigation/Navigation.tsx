import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import styles from './Navigation.module.css';

/**
 * Navigation component with theme toggle and language switcher
 *
 * Features:
 * - SPA navigation using wouter Link (no page reloads)
 * - Theme toggle (Light/Dark/System) via extracted component
 * - Language switcher (EN/FR) via extracted component
 * - Active link highlighting
 * - Responsive design
 * - Optimized with useCallback and useMemo
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */
export function Navigation(): JSX.Element {
  const { t } = useTranslation();
  const [location] = useLocation();

  const isActive = useCallback(
    (path: string): boolean => {
      if (path === '/') {
        return location === '/';
      }
      return location.startsWith(path);
    },
    [location]
  );

  const homeLinkClass = useMemo(
    () => `${styles.link} ${isActive('/') ? styles.active : ''}`,
    [isActive]
  );

  const applicationsLinkClass = useMemo(
    () => `${styles.link} ${isActive('/applications') ? styles.active : ''}`,
    [isActive]
  );

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        {/* Logo / Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink}>
            Nesto
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
          <Link href="/" className={homeLinkClass}>
            {t('navigation.home')}
          </Link>
          <Link href="/applications" className={applicationsLinkClass}>
            {t('navigation.applications')}
          </Link>
        </div>

        {/* Controls: Language + Theme */}
        <div className={styles.controls}>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
