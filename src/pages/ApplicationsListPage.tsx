import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { Spinner } from '@/components/Spinner/Spinner';
import { Card } from '@/components/Card/Card';
import { fetcher } from '@/services/api';
import { formatDate } from '@/utils/formatters';
import type { Application, Product } from '@/types/api';
import './ApplicationsListPage.css';

interface ApplicationsResponse {
  applications: Application[];
}

interface ProductsResponse {
  products: Product[];
}

/**
 * Applications List Page - Screen 3
 * Route: /applications
 *
 * Displays all applications created by the user
 * Shows product info, applicant details, and creation date
 */
export function ApplicationsListPage(): JSX.Element {
  const { t } = useTranslation();

  // Fetch applications
  const { data: appsData, isLoading: isLoadingApps } = useSWR<ApplicationsResponse>(
    '/applications',
    fetcher
  );

  // Fetch products to display product names
  const { data: productsData, isLoading: isLoadingProducts } = useSWR<ProductsResponse>(
    '/products/best',
    fetcher
  );

  const applications = appsData?.applications ?? [];
  const products = productsData?.products ?? [];
  const isLoading = isLoadingApps || isLoadingProducts;
  const hasError = !appsData && !isLoadingApps;

  // Helper to find product by ID
  const findProduct = (productId?: number): Product | undefined => {
    return products.find((p) => p.id === productId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="page page-center" role="status" aria-live="polite" aria-busy="true">
        <Spinner size="large" />
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="page page-center" role="alert" aria-live="assertive">
        <div className="error-message">
          <h2>{t('common.error')}</h2>
          <p>{t('applications.loadError')}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (applications.length === 0) {
    return (
      <div className="page page-center">
        <div className="empty-state">
          <h2>{t('applications.noApplications')}</h2>
          <p>{t('applications.noApplicationsDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="applications-container">
        <header className="applications-header">
          <h1>{t('applications.title')}</h1>
          <p className="applications-count" aria-live="polite">
            {t('applications.count', { count: applications.length })}
          </p>
        </header>

        <div className="applications-list" role="list">
          {applications.map((application) => {
            const product = findProduct(application.productId);
            const applicant = application.applicants[0];

            return (
              <Card key={application.id} className="application-card" role="listitem">
                <div className="application-content">
                  {/* Left: Product Info */}
                  <div className="application-product">
                    <h3 className="product-name">
                      {product ? product.name : t('applications.unknownProduct')}
                    </h3>
                    {product && (
                      <div className="product-meta">
                        <span className="product-type">{product.type}</span>
                        <span className="product-lender">{product.lenderName}</span>
                      </div>
                    )}
                  </div>

                  {/* Middle: Applicant Info */}
                  {applicant && (
                    <div className="application-applicant">
                      <div className="applicant-name">
                        {applicant.firstName} {applicant.lastName}
                      </div>
                      <div className="applicant-contact">
                        <span className="contact-item">{applicant.email}</span>
                        <span className="contact-item">{applicant.phone}</span>
                      </div>
                    </div>
                  )}

                  {/* Right: Application Meta */}
                  <div className="application-meta">
                    <div className="meta-row">
                      <span className="meta-label">{t('applications.type')}:</span>
                      <span className="meta-value">{application.type}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">{t('applications.created')}:</span>
                      <span className="meta-value">{formatDate(application.createdAt)}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">{t('applications.id')}:</span>
                      <span className="meta-value application-id">{application.id}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
