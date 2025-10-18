import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import logoLight from '@/assets/logo-light.svg';
import logoDark from '@/assets/logo-dark.svg';
import './Navigation.css';

/**
 * Navigation component with custom branding
 *
 * Layout:
 * - Left: Mortgage logo (theme-aware: light/dark variants)
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
    <nav className={'navigation'}>
      <div className={'container'}>
        {/* Left: Logo */}
        <div className={'brand'}>
          <Link href="/" className={'logoLink'}>
            <img src={logoLight} alt="Mortgage App" className={`${'logo'} ${'logoLight'}`} />
            <img src={logoDark} alt="Mortgage App" className={`${'logo'} ${'logoDark'}`} />
          </Link>
        </div>

        {/* Center: Empty (spacer for flex layout) */}
        <div className={'spacer'} />

        {/* Right: Applications Link + Controls */}
        <div className={'actions'}>
          <Link href="/applications" className={'applicationsLink'}>
            {t('navigation.applications')}
          </Link>
          <div className={'controls'}>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
