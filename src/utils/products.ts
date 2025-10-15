import type { Product, ProductType } from '@/types/api';

/**
 * Result of grouping and finding best products
 */
export interface BestProductsResult {
  VARIABLE: Product[];
  FIXED: Product[];
}

/**
 * Groups products by type (VARIABLE/FIXED) and finds the best product(s) in each group.
 *
 * The "best" product is defined as having the lowest `bestRate` value.
 * If multiple products have the same lowest rate (ties), all are returned.
 *
 * Algorithm:
 * - Single-pass O(n) with reduce
 * - Maintains min bestRate for each type
 * - Returns all products matching the minimum rate
 *
 * @param products - Array of products to group and filter
 * @returns Object with VARIABLE and FIXED arrays containing best products
 *
 * @example
 * ```ts
 * const products = [
 *   { id: 1, type: 'VARIABLE', bestRate: 3.5, ... },
 *   { id: 2, type: 'VARIABLE', bestRate: 3.5, ... },
 *   { id: 3, type: 'FIXED', bestRate: 4.0, ... },
 * ];
 * const result = groupAndFindBest(products);
 * // result.VARIABLE: [product1, product2] (both have lowest rate 3.5)
 * // result.FIXED: [product3]
 * ```
 */
export function groupAndFindBest(products: Product[]): BestProductsResult {
  // Initialize result with empty arrays
  const result: BestProductsResult = {
    VARIABLE: [],
    FIXED: [],
  };

  // Handle empty input
  if (products.length === 0) {
    return result;
  }

  // Track minimum bestRate for each type
  const minRates: Record<ProductType, number | undefined> = {
    VARIABLE: undefined,
    FIXED: undefined,
  };

  // First pass: find minimum bestRate for each type
  for (const product of products) {
    const currentMin = minRates[product.type];
    if (currentMin === undefined || product.bestRate < currentMin) {
      minRates[product.type] = product.bestRate;
    }
  }

  // Second pass: collect all products matching minimum rate
  for (const product of products) {
    if (product.bestRate === minRates[product.type]) {
      result[product.type].push(product);
    }
  }

  // Sort each group by term for stable display
  // Convert term to numeric value for sorting (e.g., "1_YEAR" -> 1)
  const termToNumber = (term: string): number => {
    return parseInt(term.split('_')[0] ?? '0', 10);
  };

  result.VARIABLE.sort((a, b) => termToNumber(a.term) - termToNumber(b.term));
  result.FIXED.sort((a, b) => termToNumber(a.term) - termToNumber(b.term));

  return result;
}
