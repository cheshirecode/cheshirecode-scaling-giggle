import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import styles from './Navigation.module.css';

/**
 * Navigation component matching wireframe design
 *
 * Layout per wireframe:
 * - Left: "nesto®" text logo (with copyright superscript)
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
            <span className={styles.logoText}>
              nesto<sup className={styles.copyright}>®</sup>
            </span>
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
