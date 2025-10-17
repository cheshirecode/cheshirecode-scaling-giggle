import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ApplicationFormPage from './index';

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

const mockApplicationData = {
  id: 1,
  productId: 1,
  status: 'DRAFT',
  applicants: [],
  created: '2025-01-01T00:00:00Z',
  updated: '2025-01-01T00:00:00Z',
};

const mockProductsData = [
  {
    id: 1,
    name: 'Test Product',
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
    lenderName: 'Test Lender',
    lenderType: 'Bank',
    rateHold: '90_DAYS',
    rate: 3.5,
    ratePrimeVariance: 0,
    bestRate: 3.5,
    created: '2025-01-01T00:00:00Z',
    updated: '2025-01-01T00:00:00Z',
  },
];

vi.mock('swr', () => ({
  default: (key: string) => {
    if (key && key.includes('/applications/')) {
      return {
        data: mockApplicationData,
        isLoading: false,
      };
    }
    if (key === '/products') {
      return {
        data: mockProductsData,
        isLoading: false,
      };
    }
    return {
      data: undefined,
      isLoading: false,
    };
  },
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
    mockUseRoute.mockReturnValue([true, { applicationId: '1' }]);
  });

  it('renders product summary section', async () => {
    render(<ApplicationFormPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('renders contact form section', async () => {
    render(<ApplicationFormPage />);

    await waitFor(() => {
      expect(screen.getByText('application.title')).toBeInTheDocument();
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
      expect(screen.getByLabelText(/application\.firstName/)).toBeInTheDocument();
      expect(screen.getByLabelText(/application\.lastName/)).toBeInTheDocument();
      expect(screen.getByLabelText(/application\.email/)).toBeInTheDocument();
      expect(screen.getByLabelText(/application\.phone/)).toBeInTheDocument();
    });
  });

  it('renders submit button', async () => {
    render(<ApplicationFormPage />);

    await waitFor(() => {
      expect(screen.getByText('application.saveApplicantInfo')).toBeInTheDocument();
    });
  });
});
