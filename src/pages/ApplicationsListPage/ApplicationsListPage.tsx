import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import useSWR from 'swr';
import { Spinner } from '@/components/Spinner/Spinner';
import { Button } from '@/components/Button/Button';
import { fetcher } from '@/services/api';
import type { Application, Product } from '@/types/api';
import './ApplicationsListPage.css';

/**
 * Applications List Page - Screen 3
 * Route: /applications
 *
 * Per requirements:
 * - Display a list of all applications that have been created
 * - Only display applications that have valid data (i.e. have first name, last name, email, and phone number)
 * - When user selects an application, display the application details with the form to update the application
 *
 * Layout per wireframe: Table with columns: Name, Email, Phone, Product, Edit button
 */
export function ApplicationsListPage(): JSX.Element {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  // Fetch applications from /api/applications
  const { data: applications, isLoading: isLoadingApps } = useSWR<Application[]>(
    '/applications',
    fetcher
  );

  // Fetch products from /api/products to display product names
  const { data: products, isLoading: isLoadingProducts } = useSWR<Product[]>('/products', fetcher);

  const applicationsList = applications ?? [];
  const productsList = products ?? [];
  const isLoading = isLoadingApps || isLoadingProducts;
  const hasError = !applications && !isLoadingApps;

  // Helper to find product by ID
  const findProduct = (productId?: number): Product | undefined => {
    return productsList.find((p) => p.id === productId);
  };

  // Filter to only show applications with complete contact info (per requirements)
  const completeApplications = applicationsList.filter((app) => {
    const applicant = app.applicants[0];
    return (
      applicant?.firstName?.trim() &&
      applicant.lastName?.trim() &&
      applicant.email?.trim() &&
      applicant.phone?.trim()
    );
  });

  const handleEdit = (applicationId: string): void => {
    // TODO: Route to edit form per requirements - Screen 3: "when the user selects an application, display the application details with the form to update the application"
    setLocation(`/applications/${applicationId}`);
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

  // Empty state - no applications with complete info
  if (completeApplications.length === 0) {
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
            {t('applications.count', { count: completeApplications.length })}
          </p>
        </header>

        {/* Table layout per wireframe */}
        <div className="applications-table-wrapper">
          <table className="applications-table" role="table">
            <thead>
              <tr>
                <th>{t('applications.name')}</th>
                <th>{t('applications.email')}</th>
                <th>{t('applications.phone')}</th>
                <th>{t('applications.product')}</th>
                <th className="actions-column">{t('applications.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {completeApplications.map((application) => {
                const product = findProduct(application.productId);
                const applicant = application.applicants[0];

                return (
                  <tr key={application.id}>
                    <td className="name-cell">
                      {applicant.firstName} {applicant.lastName}
                    </td>
                    <td className="email-cell">{applicant.email}</td>
                    <td className="phone-cell">{applicant.phone}</td>
                    <td className="product-cell">
                      {product ? product.name : t('applications.unknownProduct')}
                    </td>
                    <td className="actions-cell">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(application.id)}
                        aria-label={t('applications.edit', {
                          name: `${applicant.firstName} ${applicant.lastName}`,
                        })}
                      >
                        {t('applications.editButton')}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
