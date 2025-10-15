import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import styles from './LanguageSwitcher.module.css';

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
    <div className={styles.languageSwitcher} role="group" aria-label="Language selection">
      <button
        type="button"
        className={`${styles.languageButton} ${i18n.language === 'en' ? styles.active : ''}`}
        onClick={() => handleLanguageChange('en')}
        aria-label="Switch to English"
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
      <span className={styles.separator} aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={`${styles.languageButton} ${i18n.language === 'fr' ? styles.active : ''}`}
        onClick={() => handleLanguageChange('fr')}
        aria-label="Passer au français"
        aria-pressed={i18n.language === 'fr'}
      >
        FR
      </button>
    </div>
  );
}
