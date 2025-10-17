import { useTranslation } from 'react-i18next';
import type { Product } from '@/types/api';
import { formatRate, formatTerm } from '@/utils/formatters';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import styles from './ProductCard.module.css';

/**
 * ProductCard component props
 */
export interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Whether this product has the best rate in its category */
  isBest?: boolean;
  /** Callback when apply button is clicked */
  onApply: (productId: number) => void;
}

/**
 * Product card component for displaying mortgage product information
 *
 * Internationalization:
 * - Labels (Rate, Term, Type, Apply, Best Rate) are translated
 * - Product data (name, rate, term, type) comes from API and is NOT translated
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={product}
 *   isBest={true}
 *   onApply={(id) => console.log('Apply clicked:', id)}
 * />
 * ```
 */
export function ProductCard({ product, isBest = false, onApply }: ProductCardProps): JSX.Element {
  const { t } = useTranslation();

  const handleApply = (): void => {
    onApply(product.id);
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        {/* Product name from API - NOT translated */}
        <h3 className={styles.name}>{product.name}</h3>
        {isBest && (
          <span className={styles.bestBadge} aria-label={t('products.bestRate')}>
            {t('products.bestRate')}
          </span>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.rate}>
          <span className={styles.rateLabel}>{t('products.rate')}</span>
          <span className={styles.rateValue} data-testid="product-rate">
            {formatRate(product.bestRate)}
          </span>
        </div>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('products.term')}</span>
            {/* Term value from API - NOT translated */}
            <span className={styles.infoValue} data-testid="product-term">
              {formatTerm(product.term)}
            </span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('products.type')}</span>
            {/* Type value from API - NOT translated */}
            <span className={`${styles.infoValue} ${styles.typeBadge}`} data-testid="product-type">
              {product.type}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={handleApply}
        aria-label={`${t('products.apply')} - ${product.name}`}
      >
        {t('products.apply')}
      </Button>
    </Card>
  );
}
