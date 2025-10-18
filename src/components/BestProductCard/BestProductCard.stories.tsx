import type { Meta, StoryObj } from '@storybook/react';
import { BestProductCard } from './BestProductCard';
import type { Product } from '@/types/api';

const meta = {
  title: 'Components/BestProductCard',
  component: BestProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    product: {
      description: 'The product to display',
    },
    isApplying: {
      control: 'boolean',
      description: 'Whether this product is being applied to (shows loading state)',
    },
    onSelect: {
      description: 'Callback when the select button is clicked',
    },
  },
  args: {
    onSelect: (productId: number) => console.log('Product selected:', productId),
  },
} satisfies Meta<typeof BestProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFixedProduct: Product = {
  id: 1,
  name: 'Fixed Rate Mortgage 5yr',
  type: 'FIXED',
  bestRate: 5.25,
  monthlyPayment: 1872.45,
  totalAmount: 449388.0,
};

const mockVariableProduct: Product = {
  id: 2,
  name: 'Variable Rate Mortgage',
  type: 'VARIABLE',
  bestRate: 4.89,
  monthlyPayment: 1825.32,
  totalAmount: 438076.8,
};

export const FixedRate: Story = {
  args: {
    product: mockFixedProduct,
    isApplying: false,
  },
};

export const VariableRate: Story = {
  args: {
    product: mockVariableProduct,
    isApplying: false,
  },
};

export const Loading: Story = {
  args: {
    product: mockFixedProduct,
    isApplying: true,
  },
};

export const LongProductName: Story = {
  args: {
    product: {
      ...mockFixedProduct,
      name: 'Fixed Rate Mortgage with Extended Terms and Conditions for 5 Years',
    },
    isApplying: false,
  },
};

export const HighInterestRate: Story = {
  args: {
    product: {
      ...mockFixedProduct,
      bestRate: 12.99,
    },
    isApplying: false,
  },
};
