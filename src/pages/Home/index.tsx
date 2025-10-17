import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Spinner } from '@/components/Spinner/Spinner';
import { useToast } from '@/hooks/useToast';
import { fetcher } from '@/services/api';
import { findBestProductByType } from '@/utils/products';
import { DEFAULT_PRODUCT_TYPES_TO_DISPLAY } from '@/utils/constants';
import type { Product, ProductType, Application, CreateApplication } from '@/types/api';

interface HomePageProps {
  /** Product types to display (defaults to FIXED + VARIABLE per wireframe) */
  productTypes?: ProductType[];
}

/**
 * Home Page (Screen 1) - Products Selection
 * Route: /
 *
 * Per requirements:
 * - Display two lists of one or more of the **best** mortgage products, one list for each type
 * - The "best" mortgage product is the product with the lowest `bestRate` value
 * - When user selects a product, create a new application, then route to the next screen
 *
 * Layout per wireframe: displays best FIXED and VARIABLE products side-by-side
 */
export default function HomePage({
  productTypes = DEFAULT_PRODUCT_TYPES_TO_DISPLAY,
}: HomePageProps = {}): JSX.Element {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { showToast } = useToast();

  const { data, error, isLoading } = useSWR<Product[], Error>('/products', (url: string) =>
    fetcher<Product[]>(url)
  );

  // Create application mutation (Screen 1 requirement)
  const { trigger: createApplication, isMutating } = useSWRMutation(
    '/applications',
    async (url: string, { arg }: { arg: CreateApplication }) => {
      return fetcher<Application>(url, {
        method: 'POST',
        body: JSON.stringify(arg),
      });
    }
  );

  const handleApply = (productId: number): void => {
    // Per Screen 1 requirements: "when the user selects a product, create a new application, and then route the user to the next screen"
    console.log('[HomePage] Creating application for productId:', productId);

    void createApplication({ productId })
      .then((newApplication) => {
        console.log('[HomePage] Application created:', newApplication);
        showToast({
          type: 'success',
          message: t('application.applicationCreated'),
        });
        // Route to Screen 2 with the application ID
        setLocation(`/apply/${newApplication.id}`);
      })
      .catch((err: unknown) => {
        console.error('[HomePage] Application creation failed:', err);
        showToast({
          type: 'error',
          message: t('application.applicationFailed'),
        });
      });
  };

  if (isLoading || isMutating) {
    return (
      <div className="page page-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page-center">
        <div className="error-message">
          <h2>{t('products.loadingError')}</h2>
          <p>{t('products.loadingErrorDesc')}</p>
        </div>
      </div>
    );
  }

  const products = data ?? [];

  // Find best product for each requested type
  const bestProducts = productTypes
    .map((type) => findBestProductByType(products, type))
    .filter((product): product is Product => product !== undefined);

  if (bestProducts.length === 0) {
    return (
      <div className="page page-center">
        <div className="empty-state">
          <h2>{t('products.noProducts')}</h2>
          <p>{t('products.noProductsDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="products-grid">
        {bestProducts.map((product) => (
          <ProductCard key={product.id} product={product} isBest onApply={handleApply} />
        ))}
      </div>
    </div>
  );
}
