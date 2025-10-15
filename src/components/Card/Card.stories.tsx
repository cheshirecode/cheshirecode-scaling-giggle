import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    interactive: {
      control: 'boolean',
      description: 'Enable interactive hover/click states',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onClick: () => console.log('Card clicked'),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: '1rem' }}>
        <h3>Card Title</h3>
        <p>This is a simple card with some content inside.</p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    children: (
      <div style={{ padding: '1rem' }}>
        <h3>Click Me!</h3>
        <p>This card is interactive and responds to hover/click.</p>
      </div>
    ),
  },
};

export const WithImage: Story = {
  args: {
    children: (
      <div>
        <img
          src="https://via.placeholder.com/400x200"
          alt="Placeholder"
          style={{ width: '100%', display: 'block' }}
        />
        <div style={{ padding: '1rem' }}>
          <h3>Card with Image</h3>
          <p>Cards can contain images and other media.</p>
        </div>
      </div>
    ),
  },
};

export const ProductCard: Story = {
  args: {
    interactive: true,
    children: (
      <div style={{ padding: '1.5rem', maxWidth: '300px' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Variable Rate Mortgage</h2>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '1rem 0' }}>
          4.25%
        </div>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
          <li>Flexible payment options</li>
          <li>No prepayment penalties</li>
          <li>Rate adjusts quarterly</li>
        </ul>
        <button
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
        >
          Apply Now
        </button>
      </div>
    ),
  },
};

export const ApplicationCard: Story = {
  args: {
    interactive: true,
    children: (
      <div style={{ padding: '1.5rem', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0' }}>Application #12345</h3>
            <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>
              Submitted on Jan 15, 2025
            </p>
          </div>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500',
            }}
          >
            In Review
          </span>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Applicant:</strong> John Doe
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Product:</strong> Fixed Rate 5-Year
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Amount:</strong> $350,000
          </p>
        </div>
      </div>
    ),
  },
};

export const EmptyState: Story = {
  args: {
    children: (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>No Applications Yet</h3>
        <p style={{ margin: '0', fontSize: '0.875rem' }}>
          Get started by creating your first application
        </p>
      </div>
    ),
  },
};

export const NestedContent: Story = {
  args: {
    children: (
      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Card with Lists</h2>
        <Card>
          <div style={{ padding: '1rem' }}>
            <h4 style={{ marginTop: 0 }}>Features</h4>
            <ul>
              <li>Nested card inside parent</li>
              <li>Multiple levels of content</li>
              <li>Flexible composition</li>
            </ul>
          </div>
        </Card>
        <p style={{ marginBottom: 0 }}>Cards can be nested for complex layouts.</p>
      </div>
    ),
  },
};

export const MinimalContent: Story = {
  args: {
    children: <div style={{ padding: '1rem' }}>Simple text</div>,
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <div style={{ padding: '1.5rem', maxWidth: '500px' }}>
        <h3 style={{ marginTop: 0 }}>Terms and Conditions</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
        <p>
          Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
          omnis iste natus error sit voluptatem accusantium doloremque laudantium.
        </p>
      </div>
    ),
  },
};
