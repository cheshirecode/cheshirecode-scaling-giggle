import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import type { Product } from '@/types/api';
import { BestProductCard } from './BestProductCard';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      const translations: Record<string, string> = {
        'products.bestType': params?.type ? `Best ${params.type}` : 'Best',
        'products.selectProduct': 'Select this product',
      };
      return translations[key] || key;
    },
  }),
}));

const mockProduct: Product = {
  id: 1,
  name: 'Standard Fixed Rate Mortgage',
  family: 'STANDARD',
  type: 'FIXED',
  term: '5_YEAR',
  insurable: true,
  insurance: 'INSURED',
  prepaymentOption: 'STANDARD',
  restrictionsOption: 'NO_RESTRICTIONS',
  restrictions: 'None',
  fixedPenaltySpread: '0.5%',
  helocOption: 'HELOC_WITHOUT',
  helocDelta: 0,
  lenderName: 'Test Bank',
  lenderType: 'Bank',
  rateHold: '90_DAYS',
  rate: 5.25,
  ratePrimeVariance: 0,
  bestRate: 5.25,
  created: '2025-01-01T00:00:00Z',
  updated: '2025-01-01T00:00:00Z',
};

describe('BestProductCard', () => {
  it('renders product type label', () => {
    const onSelect = vi.fn();
    render(<BestProductCard product={mockProduct} onSelect={onSelect} />);

    expect(screen.getByText('Best fixed')).toBeInTheDocument();
  });

  it('renders product name', () => {
    const onSelect = vi.fn();
    render(<BestProductCard product={mockProduct} onSelect={onSelect} />);

    expect(screen.getByText(/Standard Fixed Rate Mortgage/)).toBeInTheDocument();
  });

  it('renders formatted rate', () => {
    const onSelect = vi.fn();
    render(<BestProductCard product={mockProduct} onSelect={onSelect} />);

    expect(screen.getByText('5.25%')).toBeInTheDocument();
  });

  it('renders select button', () => {
    const onSelect = vi.fn();
    render(<BestProductCard product={mockProduct} onSelect={onSelect} />);

    const button = screen.getByRole('button', { name: 'Select this product' });
    expect(button).toBeInTheDocument();
  });

  it('calls onSelect with product ID when button is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BestProductCard product={mockProduct} onSelect={onSelect} />);

    const button = screen.getByRole('button', { name: 'Select this product' });
    await user.click(button);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('shows loading state when isApplying is true', () => {
    const onSelect = vi.fn();
    render(<BestProductCard product={mockProduct} isApplying={true} onSelect={onSelect} />);

    const button = screen.getByRole('button', { name: 'Select this product' });
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('handles VARIABLE product type', () => {
    const variableProduct: Product = {
      ...mockProduct,
      type: 'VARIABLE',
      bestRate: 4.5,
    };
    const onSelect = vi.fn();
    render(<BestProductCard product={variableProduct} onSelect={onSelect} />);

    expect(screen.getByText('Best variable')).toBeInTheDocument();
    expect(screen.getByText('4.50%')).toBeInTheDocument();
  });

  it('renders with proper semantic structure', () => {
    const onSelect = vi.fn();
    render(<BestProductCard product={mockProduct} onSelect={onSelect} />);

    // Should have heading for type
    const heading = screen.getByRole('heading', { name: 'Best fixed' });
    expect(heading.tagName).toBe('H3');

    // Should have button
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
