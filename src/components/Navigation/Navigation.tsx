import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import styles from './Navigation.module.css';

/**
 * Navigation component matching wireframe design
 *
 * Layout per wireframe:
 * - Left: "nesto®" text logo (with copyright superscript)
 * - Center: Empty
 * - Right: "Applications" link (modern button style)
 *
 * Note: Language/Theme toggles are handled at App level (top-right corner)
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

        {/* Right: Applications Link */}
        <div className={styles.actions}>
          <Link href="/applications" className={styles.applicationsLink}>
            {t('navigation.applications')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
