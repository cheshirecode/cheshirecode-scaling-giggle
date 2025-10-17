import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import type { Product } from '@/types/api';
import { ProductCard } from './ProductCard';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'products.bestRate': 'Best Rate',
        'products.rate': 'Rate',
        'products.term': 'Term',
        'products.type': 'Type',
        'products.apply': 'Apply',
        'products.lender': 'Lender',
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

describe('ProductCard', () => {
  it('renders product name', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} onApply={onApply} />);

    expect(screen.getByText('Standard Fixed Rate Mortgage')).toBeInTheDocument();
  });

  it('renders formatted rate', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} onApply={onApply} />);

    const rateElement = screen.getByTestId('product-rate');
    expect(rateElement).toHaveTextContent('5.25%');
  });

  it('renders formatted term', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} onApply={onApply} />);

    const termElement = screen.getByTestId('product-term');
    expect(termElement).toHaveTextContent('5 Year');
  });

  it('renders product type', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} onApply={onApply} />);

    const typeElement = screen.getByTestId('product-type');
    expect(typeElement).toHaveTextContent('FIXED');
  });

  it('shows best rate badge when isBest is true', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} isBest={true} onApply={onApply} />);

    const badge = screen.getByLabelText('Best Rate');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Best Rate');
  });

  it('hides best rate badge when isBest is false', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} isBest={false} onApply={onApply} />);

    expect(screen.queryByLabelText('Best Rate')).not.toBeInTheDocument();
  });

  it('hides best rate badge by default', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} onApply={onApply} />);

    expect(screen.queryByLabelText('Best Rate')).not.toBeInTheDocument();
  });

  it('calls onApply with product ID when apply button is clicked', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} onApply={onApply} />);

    const applyButton = screen.getByRole('button', { name: /apply for/i });
    await user.click(applyButton);

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith(1);
  });

  it('renders apply button with accessible label', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} onApply={onApply} />);

    const applyButton = screen.getByRole('button', {
      name: 'Apply for Standard Fixed Rate Mortgage',
    });
    expect(applyButton).toBeInTheDocument();
  });

  it('handles VARIABLE product type', () => {
    const variableProduct: Product = {
      ...mockProduct,
      type: 'VARIABLE',
      term: '3_YEAR',
      bestRate: 4.5,
    };
    const onApply = vi.fn();
    render(<ProductCard product={variableProduct} onApply={onApply} />);

    expect(screen.getByTestId('product-type')).toHaveTextContent('VARIABLE');
    expect(screen.getByTestId('product-rate')).toHaveTextContent('4.50%');
    expect(screen.getByTestId('product-term')).toHaveTextContent('3 Year');
  });

  it('handles long product names without layout issues', () => {
    const longNameProduct: Product = {
      ...mockProduct,
      name: 'Very Long Product Name That Should Not Break The Card Layout And Should Be Displayed Properly',
    };
    const onApply = vi.fn();
    const { container } = render(<ProductCard product={longNameProduct} onApply={onApply} />);

    expect(screen.getByText(/Very Long Product Name/)).toBeInTheDocument();
    // Card should still render without issues
    expect(container.firstChild).toBeTruthy();
  });

  it('handles different term lengths correctly', () => {
    const shortTermProduct: Product = {
      ...mockProduct,
      term: '1_YEAR',
    };
    const onApply = vi.fn();
    render(<ProductCard product={shortTermProduct} onApply={onApply} />);

    expect(screen.getByTestId('product-term')).toHaveTextContent('1 Year');
  });

  it('handles high rate values with proper formatting', () => {
    const highRateProduct: Product = {
      ...mockProduct,
      bestRate: 12.5,
    };
    const onApply = vi.fn();
    render(<ProductCard product={highRateProduct} onApply={onApply} />);

    expect(screen.getByTestId('product-rate')).toHaveTextContent('12.50%');
  });

  it('renders with semantic HTML structure', () => {
    const onApply = vi.fn();
    render(<ProductCard product={mockProduct} onApply={onApply} />);

    // Should have heading for product name
    const heading = screen.getByRole('heading', { name: 'Standard Fixed Rate Mortgage' });
    expect(heading.tagName).toBe('H3');

    // Should have apply button
    const button = screen.getByRole('button', { name: /apply for/i });
    expect(button).toBeInTheDocument();
  });
});
