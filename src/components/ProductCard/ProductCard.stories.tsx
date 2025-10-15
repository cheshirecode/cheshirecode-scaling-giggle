import type { Meta, StoryObj } from '@storybook/react';
import type { Product } from '@/types/api';
import { ProductCard } from './ProductCard';

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

const meta = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isBest: {
      control: 'boolean',
      description: 'Show best rate badge',
    },
  },
  args: {
    onApply: () => console.log('Apply clicked'),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: mockProduct,
    isBest: false,
  },
};

export const BestRate: Story = {
  args: {
    product: mockProduct,
    isBest: true,
  },
};

export const VariableRate: Story = {
  args: {
    product: {
      ...mockProduct,
      id: 2,
      name: 'Value Flex Variable Rate',
      type: 'VARIABLE',
      term: '3_YEAR',
      bestRate: 4.5,
    },
    isBest: false,
  },
};

export const HighRate: Story = {
  args: {
    product: {
      ...mockProduct,
      id: 3,
      name: 'Premium Fixed Rate',
      bestRate: 12.5,
      term: '10_YEAR',
    },
    isBest: false,
  },
};

export const LongProductName: Story = {
  args: {
    product: {
      ...mockProduct,
      id: 4,
      name: 'Very Long Product Name That Should Display Properly Without Breaking The Card Layout',
    },
    isBest: true,
  },
};

export const Interactive: Story = {
  args: {
    product: mockProduct,
    isBest: true,
  },
  play: async ({ args }) => {
    // Story for interactive testing in Storybook
    // Users can click the Apply button and see the action logged
    console.log('ProductCard story loaded with product:', args.product.name);
  },
};
