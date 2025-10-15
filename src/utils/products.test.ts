import { describe, it, expect } from 'vitest';
import { groupAndFindBest } from './products';
import type { Product } from '@/types/api';

// Helper to create a mock product
function createProduct(overrides: Partial<Product>): Product {
  return {
    id: 1,
    name: 'Test Product',
    family: 'STANDARD',
    type: 'VARIABLE',
    term: '5_YEAR',
    insurable: true,
    insurance: 'CONVENTIONAL',
    prepaymentOption: 'STANDARD',
    restrictionsOption: 'NO_RESTRICTIONS',
    restrictions: '',
    fixedPenaltySpread: '0.00',
    helocOption: 'HELOC_WITHOUT',
    helocDelta: 0,
    lenderName: 'Test Lender',
    lenderType: 'A',
    rateHold: '120_DAYS',
    rate: 5.0,
    ratePrimeVariance: 0,
    bestRate: 5.0,
    created: '2024-01-01T00:00:00Z',
    updated: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('groupAndFindBest', () => {
  it('returns empty arrays for empty input', () => {
    const result = groupAndFindBest([]);
    expect(result).toEqual({
      VARIABLE: [],
      FIXED: [],
    });
  });

  it('returns single best product for VARIABLE type', () => {
    const products = [
      createProduct({ id: 1, type: 'VARIABLE', bestRate: 3.5 }),
      createProduct({ id: 2, type: 'VARIABLE', bestRate: 4.0 }),
      createProduct({ id: 3, type: 'VARIABLE', bestRate: 3.8 }),
    ];

    const result = groupAndFindBest(products);

    expect(result.VARIABLE).toHaveLength(1);
    expect(result.VARIABLE[0]?.id).toBe(1);
    expect(result.VARIABLE[0]?.bestRate).toBe(3.5);
    expect(result.FIXED).toHaveLength(0);
  });

  it('returns single best product for FIXED type', () => {
    const products = [
      createProduct({ id: 1, type: 'FIXED', bestRate: 4.5 }),
      createProduct({ id: 2, type: 'FIXED', bestRate: 4.0 }),
      createProduct({ id: 3, type: 'FIXED', bestRate: 4.8 }),
    ];

    const result = groupAndFindBest(products);

    expect(result.FIXED).toHaveLength(1);
    expect(result.FIXED[0]?.id).toBe(2);
    expect(result.FIXED[0]?.bestRate).toBe(4.0);
    expect(result.VARIABLE).toHaveLength(0);
  });

  it('returns best products for both VARIABLE and FIXED types', () => {
    const products = [
      createProduct({ id: 1, type: 'VARIABLE', bestRate: 3.5 }),
      createProduct({ id: 2, type: 'VARIABLE', bestRate: 4.0 }),
      createProduct({ id: 3, type: 'FIXED', bestRate: 4.5 }),
      createProduct({ id: 4, type: 'FIXED', bestRate: 4.0 }),
    ];

    const result = groupAndFindBest(products);

    expect(result.VARIABLE).toHaveLength(1);
    expect(result.VARIABLE[0]?.id).toBe(1);
    expect(result.FIXED).toHaveLength(1);
    expect(result.FIXED[0]?.id).toBe(4);
  });

  it('handles ties by returning all products with lowest rate', () => {
    const products = [
      createProduct({ id: 1, type: 'VARIABLE', bestRate: 3.5, term: '5_YEAR' }),
      createProduct({ id: 2, type: 'VARIABLE', bestRate: 3.5, term: '3_YEAR' }),
      createProduct({ id: 3, type: 'VARIABLE', bestRate: 4.0, term: '7_YEAR' }),
      createProduct({ id: 4, type: 'FIXED', bestRate: 4.5, term: '10_YEAR' }),
      createProduct({ id: 5, type: 'FIXED', bestRate: 4.5, term: '7_YEAR' }),
    ];

    const result = groupAndFindBest(products);

    expect(result.VARIABLE).toHaveLength(2);
    expect(result.VARIABLE.map((p) => p.id)).toEqual([2, 1]); // Sorted by term
    expect(result.FIXED).toHaveLength(2);
    expect(result.FIXED.map((p) => p.id)).toEqual([5, 4]); // Sorted by term
  });

  it('sorts results by term in ascending order', () => {
    const products = [
      createProduct({ id: 1, type: 'VARIABLE', bestRate: 3.5, term: '10_YEAR' }),
      createProduct({ id: 2, type: 'VARIABLE', bestRate: 3.5, term: '1_YEAR' }),
      createProduct({ id: 3, type: 'VARIABLE', bestRate: 3.5, term: '5_YEAR' }),
    ];

    const result = groupAndFindBest(products);

    expect(result.VARIABLE).toHaveLength(3);
    expect(result.VARIABLE[0]?.term).toBe('1_YEAR');
    expect(result.VARIABLE[1]?.term).toBe('5_YEAR');
    expect(result.VARIABLE[2]?.term).toBe('10_YEAR');
  });

  it('handles products with only VARIABLE type', () => {
    const products = [
      createProduct({ id: 1, type: 'VARIABLE', bestRate: 3.5 }),
      createProduct({ id: 2, type: 'VARIABLE', bestRate: 4.0 }),
    ];

    const result = groupAndFindBest(products);

    expect(result.VARIABLE).toHaveLength(1);
    expect(result.FIXED).toHaveLength(0);
  });

  it('handles products with only FIXED type', () => {
    const products = [
      createProduct({ id: 1, type: 'FIXED', bestRate: 4.5 }),
      createProduct({ id: 2, type: 'FIXED', bestRate: 4.0 }),
    ];

    const result = groupAndFindBest(products);

    expect(result.VARIABLE).toHaveLength(0);
    expect(result.FIXED).toHaveLength(1);
  });

  it('handles decimal bestRate values correctly', () => {
    const products = [
      createProduct({ id: 1, type: 'VARIABLE', bestRate: 3.49 }),
      createProduct({ id: 2, type: 'VARIABLE', bestRate: 3.5 }),
      createProduct({ id: 3, type: 'VARIABLE', bestRate: 3.499 }),
    ];

    const result = groupAndFindBest(products);

    expect(result.VARIABLE).toHaveLength(1);
    expect(result.VARIABLE[0]?.id).toBe(1);
    expect(result.VARIABLE[0]?.bestRate).toBe(3.49);
  });

  it('handles single product input', () => {
    const products = [createProduct({ id: 1, type: 'VARIABLE', bestRate: 3.5 })];

    const result = groupAndFindBest(products);

    expect(result.VARIABLE).toHaveLength(1);
    expect(result.VARIABLE[0]?.id).toBe(1);
    expect(result.FIXED).toHaveLength(0);
  });
});
