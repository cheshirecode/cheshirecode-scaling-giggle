import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { ToastContainer } from './Toast';
import { toastsAtom, type Toast } from '../../atoms/toastsAtom';

// Helper component to hydrate Jotai atoms for testing
function TestProvider({
  children,
  initialToasts = [],
}: {
  children: React.ReactNode;
  initialToasts?: Toast[];
}): JSX.Element {
  useHydrateAtoms([[toastsAtom, initialToasts]]);
  return <>{children}</>;
}

describe('ToastContainer', () => {
  it('renders nothing when no toasts', () => {
    const { container } = render(
      <Provider>
        <ToastContainer />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders success toast', () => {
    const toast: Toast = {
      id: '1',
      type: 'success',
      message: 'Operation successful',
    };

    render(
      <Provider>
        <TestProvider initialToasts={[toast]}>
          <ToastContainer />
        </TestProvider>
      </Provider>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('renders error toast', () => {
    const toast: Toast = {
      id: '2',
      type: 'error',
      message: 'Operation failed',
    };

    render(
      <Provider>
        <TestProvider initialToasts={[toast]}>
          <ToastContainer />
        </TestProvider>
      </Provider>
    );

    expect(screen.getByText('Operation failed')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('renders toast with title', () => {
    const toast: Toast = {
      id: '3',
      type: 'info',
      title: 'Information',
      message: 'This is an info message',
    };

    render(
      <Provider>
        <TestProvider initialToasts={[toast]}>
          <ToastContainer />
        </TestProvider>
      </Provider>
    );

    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('This is an info message')).toBeInTheDocument();
  });

  it('renders multiple toasts', () => {
    const toasts: Toast[] = [
      { id: '1', type: 'success', message: 'First toast' },
      { id: '2', type: 'error', message: 'Second toast' },
      { id: '3', type: 'warning', message: 'Third toast' },
    ];

    render(
      <Provider>
        <TestProvider initialToasts={toasts}>
          <ToastContainer />
        </TestProvider>
      </Provider>
    );

    expect(screen.getByText('First toast')).toBeInTheDocument();
    expect(screen.getByText('Second toast')).toBeInTheDocument();
    expect(screen.getByText('Third toast')).toBeInTheDocument();
    expect(screen.getAllByRole('alert')).toHaveLength(3);
  });

  it('has close button that is clickable', async () => {
    const user = userEvent.setup();
    const toast: Toast = {
      id: '4',
      type: 'success',
      message: 'Click to close',
    };

    render(
      <Provider>
        <TestProvider initialToasts={[toast]}>
          <ToastContainer />
        </TestProvider>
      </Provider>
    );

    const closeButton = screen.getByLabelText('Close notification');
    expect(closeButton).toBeInTheDocument();

    // Verify button is clickable (in real app, would call hideToast and remove from DOM)
    await user.click(closeButton);
    // After clicking, toast is removed from DOM (state change via useToast)
    expect(screen.queryByText('Click to close')).not.toBeInTheDocument();
  });

  it('renders all toast types with correct icons', () => {
    const toasts: Toast[] = [
      { id: '1', type: 'success', message: 'Success' },
      { id: '2', type: 'error', message: 'Error' },
      { id: '3', type: 'warning', message: 'Warning' },
      { id: '4', type: 'info', message: 'Info' },
    ];

    render(
      <Provider>
        <TestProvider initialToasts={toasts}>
          <ToastContainer />
        </TestProvider>
      </Provider>
    );

    expect(screen.getByText('✓')).toBeInTheDocument(); // success
    expect(screen.getByText('✕')).toBeInTheDocument(); // error
    expect(screen.getByText('⚠')).toBeInTheDocument(); // warning
    expect(screen.getByText('ℹ')).toBeInTheDocument(); // info
  });
});
