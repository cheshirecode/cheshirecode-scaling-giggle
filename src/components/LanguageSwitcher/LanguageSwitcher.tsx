import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import './LanguageSwitcher.css';

/**
 * Language switcher component for toggling between English and French
 *
 * Features:
 * - Switches between EN/FR
 * - Visual feedback for active language
 * - Keyboard accessible
 * - Integrates with react-i18next
 *
 * @example
 * ```tsx
 * <LanguageSwitcher />
 * ```
 */
export function LanguageSwitcher(): JSX.Element {
  const { i18n } = useTranslation();

  const handleLanguageChange = useCallback(
    (lng: string) => {
      void i18n.changeLanguage(lng);
    },
    [i18n]
  );

  return (
    <div className={'languageSwitcher'} role="group" aria-label="Language selection">
      <button
        type="button"
        className={`${'languageButton'} ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
        aria-label="Switch to English"
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
      <span className={'separator'} aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={`${'languageButton'} ${i18n.language === 'fr' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('fr')}
        aria-label="Passer au français"
        aria-pressed={i18n.language === 'fr'}
      >
        FR
      </button>
    </div>
  );
}
