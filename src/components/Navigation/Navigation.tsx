import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import nestoLogoPrimary from '@/assets/nesto-EN_Primary.png';
import nestoLogoSecondary from '@/assets/nesto-EN_Secondary.png';
import styles from './Navigation.module.css';

/**
 * Navigation component matching wireframe design
 *
 * Layout per wireframe:
 * - Left: nesto® logo image (theme-aware: Primary for light, Secondary for dark)
 * - Center: Empty
 * - Right: "Applications" link + Language/Theme controls
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */
export function Navigation(): JSX.Element {
  const { t } = useTranslation();

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        {/* Left: nesto® Logo */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink}>
            <img
              src={nestoLogoPrimary}
              alt="nesto"
              className={`${styles.logo} ${styles.logoLight}`}
            />
            <img
              src={nestoLogoSecondary}
              alt="nesto"
              className={`${styles.logo} ${styles.logoDark}`}
            />
          </Link>
        </div>

        {/* Center: Empty (spacer for flex layout) */}
        <div className={styles.spacer} />

        {/* Right: Applications Link + Controls */}
        <div className={styles.actions}>
          <Link href="/applications" className={styles.applicationsLink}>
            {t('navigation.applications')}
          </Link>
          <div className={styles.controls}>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
