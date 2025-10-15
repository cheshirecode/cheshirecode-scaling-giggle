import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import nestoLogo from '/assets/nestoIcon-Primary.png';
import styles from './Navigation.module.css';

/**
 * Navigation component matching wireframe design
 *
 * Features:
 * - Nesto logo (left)
 * - Applications link only (per wireframe - no Home link)
 * - Theme toggle + Language switcher (right)
 * - Responsive design
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */
export function Navigation(): JSX.Element {
  const { t } = useTranslation();
  const [location] = useLocation();

  const applicationsLinkClass = useMemo(
    () => `${styles.link} ${location.startsWith('/applications') ? styles.active : ''}`,
    [location]
  );

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        {/* Logo / Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink}>
            <img src={nestoLogo} alt="Nesto" className={styles.logo} />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
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
