import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import nestoLogoPrimary from '@/assets/nesto-EN_Primary.png';
import nestoLogoSecondary from '@/assets/nesto-EN_Secondary.png';
import './Navigation.css';

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
    <nav className={'navigation'}>
      <div className={'container'}>
        {/* Left: nesto® Logo */}
        <div className={'brand'}>
          <Link href="/" className={'logoLink'}>
            <img src={nestoLogoPrimary} alt="nesto" className={`${'logo'} ${'logoLight'}`} />
            <img src={nestoLogoSecondary} alt="nesto" className={`${'logo'} ${'logoDark'}`} />
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
