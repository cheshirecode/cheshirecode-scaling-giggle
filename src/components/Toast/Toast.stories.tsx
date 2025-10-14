import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { ToastContainer } from './Toast';
import { toastsAtom, type Toast } from '../../atoms/toastsAtom';
import { useToast } from '../../hooks/useToast';

// Wrapper to provide Jotai context
function StoryProvider({
  children,
  initialToasts = [],
}: {
  children: React.ReactNode;
  initialToasts?: Toast[];
}): JSX.Element {
  useHydrateAtoms([[toastsAtom, initialToasts]]);
  return <>{children}</>;
}

const meta = {
  title: 'Components/Toast',
  component: ToastContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider>
        <div style={{ minHeight: '400px', position: 'relative' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
} satisfies Meta<typeof ToastContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const Success: Story = {
  render: () => (
    <StoryProvider
      initialToasts={[
        {
          id: '1',
          type: 'success',
          message: 'Your changes have been saved successfully!',
        },
      ]}
    >
      <ToastContainer />
    </StoryProvider>
  ),
};

export const Error: Story = {
  render: () => (
    <StoryProvider
      initialToasts={[
        {
          id: '2',
          type: 'error',
          message: 'Failed to save changes. Please try again.',
        },
      ]}
    >
      <ToastContainer />
    </StoryProvider>
  ),
};

export const Warning: Story = {
  render: () => (
    <StoryProvider
      initialToasts={[
        {
          id: '3',
          type: 'warning',
          message: 'Your session will expire in 5 minutes.',
        },
      ]}
    >
      <ToastContainer />
    </StoryProvider>
  ),
};

export const Info: Story = {
  render: () => (
    <StoryProvider
      initialToasts={[
        {
          id: '4',
          type: 'info',
          message: 'New features are available. Check them out!',
        },
      ]}
    >
      <ToastContainer />
    </StoryProvider>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <StoryProvider
      initialToasts={[
        {
          id: '5',
          type: 'success',
          title: 'Application Submitted',
          message: 'Your mortgage application has been submitted successfully.',
        },
      ]}
    >
      <ToastContainer />
    </StoryProvider>
  ),
};

export const Multiple: Story = {
  render: () => (
    <StoryProvider
      initialToasts={[
        {
          id: '1',
          type: 'success',
          title: 'Success',
          message: 'Profile updated successfully',
        },
        {
          id: '2',
          type: 'warning',
          message: 'Your session will expire soon',
        },
        {
          id: '3',
          type: 'info',
          message: 'New message received',
        },
      ]}
    >
      <ToastContainer />
    </StoryProvider>
  ),
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const { showToast } = useToast();

    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Interactive Toast Demo</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() =>
              showToast({
                type: 'success',
                title: 'Success!',
                message: 'Operation completed successfully',
                duration: 3000,
              })
            }
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Show Success
          </button>
          <button
            onClick={() =>
              showToast({
                type: 'error',
                message: 'Something went wrong',
                duration: 5000,
              })
            }
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Show Error
          </button>
          <button
            onClick={() =>
              showToast({
                type: 'warning',
                message: 'Warning: Check your input',
              })
            }
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Show Warning
          </button>
          <button
            onClick={() =>
              showToast({
                type: 'info',
                title: 'Information',
                message: 'This is an informational message',
              })
            }
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Show Info
          </button>
          <button
            onClick={() =>
              showToast({
                type: 'success',
                message: 'This toast does not auto-dismiss',
                duration: 0,
              })
            }
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Persistent Toast
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  },
};
