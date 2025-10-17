import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ApplicationFormPage } from './ApplicationFormPage';

// Mock dependencies
const mockUseRoute = vi.fn();
const mockSetLocation = vi.fn();
const mockShowToast = vi.fn();
const mockTrigger = vi.fn();

vi.mock('wouter', () => ({
  useRoute: () => mockUseRoute(),
  useLocation: () => ['/apply/1', mockSetLocation],
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

vi.mock('swr', () => ({
  default: () => ({
    data: {
      products: [
        {
          id: 1,
          name: 'Test Product',
          type: 'FIXED',
          bestRate: 0.035,
          term: '5_YEAR',
          lenderName: 'Test Lender',
        },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock('swr/mutation', () => ({
  default: () => ({
    trigger: mockTrigger,
    isMutating: false,
  }),
}));

describe('ApplicationFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRoute.mockReturnValue([true, { productId: '1' }]);
  });

  it('renders product summary section', async () => {
    render(<ApplicationFormPage />);

    await waitFor(() => {
      expect(screen.getByText('application.selectedProduct')).toBeInTheDocument();
    });
  });

  it('renders contact form section', async () => {
    render(<ApplicationFormPage />);

    await waitFor(() => {
      expect(screen.getByText('application.yourInformation')).toBeInTheDocument();
    });
  });

  it('displays product name', async () => {
    render(<ApplicationFormPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('renders all required form fields', async () => {
    render(<ApplicationFormPage />);

    await waitFor(() => {
      expect(screen.getByLabelText('application.firstName')).toBeInTheDocument();
      expect(screen.getByLabelText('application.lastName')).toBeInTheDocument();
      expect(screen.getByLabelText('application.email')).toBeInTheDocument();
      expect(screen.getByLabelText('application.phone')).toBeInTheDocument();
    });
  });

  it('renders submit button', async () => {
    render(<ApplicationFormPage />);

    await waitFor(() => {
      expect(screen.getByText('application.saveApplicantInfo')).toBeInTheDocument();
    });
  });
});
