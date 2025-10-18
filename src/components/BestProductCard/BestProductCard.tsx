import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button/Button';
import { formatRate } from '@/utils/formatters';
import type { Product } from '@/types/api';
import './BestProductCard.css';

interface BestProductCardProps {
  /** The product to display */
  product: Product;
  /** Whether this product is being applied to (shows loading state) */
  isApplying?: boolean;
  /** Callback when the select button is clicked */
  onSelect: (productId: number) => void;
}

/**
 * Best Product Card - Simplified card for homepage best products display
 *
 * Matches wireframe design:
 * - "Best fixed/variable (type)" label
 * - Product name
 * - Large rate percentage
 * - "Select this product" button
 */
export function BestProductCard({
  product,
  isApplying = false,
  onSelect,
}: BestProductCardProps): JSX.Element {
  const { t } = useTranslation();

  const handleSelect = () => {
    onSelect(product.id);
  };

  // Format type label: "Best fixed" or "Best variable"
  const typeLabel = t('products.bestType', {
    type: product.type.toLowerCase(),
  });

  return (
    <div className="best-product-card">
      <div className="best-product-card__header">
        <h3 className="best-product-card__type">{typeLabel}</h3>
        <p className="best-product-card__subtext">(type)</p>
      </div>

      <p className="best-product-card__name">({product.name})</p>

      <div className="best-product-card__rate">{formatRate(product.bestRate)}</div>

      <Button
        variant="secondary"
        fullWidth
        onClick={handleSelect}
        loading={isApplying}
        aria-label={t('products.selectProduct')}
      >
        {t('products.selectProduct')}
      </Button>
    </div>
  );
}
