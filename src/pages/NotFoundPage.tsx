import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/Button/Button';

/**
 * 404 Not Found Page
 * Displayed when user navigates to an invalid route
 */
export function NotFoundPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="page page-center">
      <div className="error-message">
        <h1>404</h1>
        <h2>{t('common.error')}</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link href="/">
          <Button variant="primary">{t('common.back')}</Button>
        </Link>
      </div>
    </div>
  );
}
