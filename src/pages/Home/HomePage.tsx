import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import useSWR from 'swr';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Spinner } from '@/components/Spinner/Spinner';
import { fetcher } from '@/services/api';
import { findBestProductByType } from '@/utils/products';
import { DEFAULT_PRODUCT_TYPES_TO_DISPLAY } from '@/utils/constants';
import type { Product, ProductType } from '@/types/api';

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
export function HomePage({
  productTypes = DEFAULT_PRODUCT_TYPES_TO_DISPLAY,
}: HomePageProps = {}): JSX.Element {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { data, error, isLoading } = useSWR<Product[], Error>('/products', (url: string) =>
    fetcher<Product[]>(url)
  );

  const handleApply = (productId: number): void => {
    // TODO: Per requirements, should CREATE application first, then route to /apply/:applicationId
    // Currently just routing to product selection form
    setLocation(`/apply/${productId}`);
  };

  if (isLoading) {
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
