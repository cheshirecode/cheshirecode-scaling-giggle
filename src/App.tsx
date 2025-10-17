import { Route, Switch, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Navigation } from '@/components/Navigation/Navigation';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Spinner } from '@/components/Spinner/Spinner';
import { useThemeInitializer } from '@/hooks/useThemeInitializer';
import { fetcher } from '@/services/api';
import { findBestProductByType } from '@/utils/products';
import { DEFAULT_PRODUCT_TYPES_TO_DISPLAY } from '@/utils/constants';
import { ApplicationFormPage } from '@/pages/ApplicationFormPage';
import { ApplicationsListPage } from '@/pages/ApplicationsListPage';
import type { Product, ProductType } from '@/types/api';
import './App.css';

interface ProductsPageProps {
  /** Product types to display (defaults to FIXED + VARIABLE per wireframe) */
  productTypes?: ProductType[];
}

/**
 * Products page showing best products by type
 * Per wireframe: displays best FIXED and VARIABLE products side-by-side
 *
 * Fetches from /api/products and filters client-side to find best FIXED and VARIABLE
 */
function ProductsPage({
  productTypes = DEFAULT_PRODUCT_TYPES_TO_DISPLAY,
}: ProductsPageProps = {}): JSX.Element {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { data, error, isLoading } = useSWR<Product[], Error>('/products', (url: string) =>
    fetcher<Product[]>(url)
  );

  const handleApply = (productId: number): void => {
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

function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

function App(): JSX.Element {
  // Initialize theme from localStorage
  useThemeInitializer();

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation />

        <main className="main">
          <Switch>
            <Route path="/">{() => <ProductsPage />}</Route>
            <Route path="/apply/:productId" component={ApplicationFormPage} />
            <Route path="/applications" component={ApplicationsListPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
