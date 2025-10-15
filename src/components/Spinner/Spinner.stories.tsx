import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Spinner size',
    },
    center: {
      control: 'boolean',
      description: 'Center spinner in container',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Centered: Story = {
  args: {
    size: 'medium',
    center: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '200px', border: '1px dashed #ccc' }}>
        <Story />
      </div>
    ),
  ],
};

export const InButton: Story = {
  render: () => (
    <button
      style={{
        padding: '0.5rem 1.5rem',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'wait',
      }}
    >
      <Spinner size="small" />
      Loading...
    </button>
  ),
};

export const InCard: Story = {
  render: () => (
    <div
      style={{
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        width: '300px',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Loading Content</h3>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
        <Spinner size="large" />
      </div>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 0 }}>
        Please wait while we fetch your data...
      </p>
    </div>
  ),
};

export const MultipleSpinners: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Spinner size="small" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Small</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="medium" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Medium</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="large" />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>Large</p>
      </div>
    </div>
  ),
};

export const FullPageLoader: Story = {
  render: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
      }}
    >
      <Spinner size="large" />
      <p>Loading application...</p>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const WithText: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Spinner size="medium" />
      <span>Processing your request...</span>
    </div>
  ),
};

export const InlineSmall: Story = {
  render: () => (
    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
      Your data is loading <Spinner size="small" /> please wait...
    </p>
  ),
};
