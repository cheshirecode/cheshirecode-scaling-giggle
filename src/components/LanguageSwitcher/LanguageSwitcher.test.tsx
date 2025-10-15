import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from './LanguageSwitcher';

// Mock react-i18next
const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders language buttons', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByLabelText('Switch to English')).toBeInTheDocument();
    expect(screen.getByLabelText('Passer au français')).toBeInTheDocument();
  });

  it('has accessible group label', () => {
    render(<LanguageSwitcher />);

    const group = screen.getByRole('group', { name: 'Language selection' });
    expect(group).toBeInTheDocument();
  });

  it('shows active language with aria-pressed', () => {
    render(<LanguageSwitcher />);

    const enButton = screen.getByLabelText('Switch to English');
    expect(enButton).toHaveAttribute('aria-pressed', 'true');

    const frButton = screen.getByLabelText('Passer au français');
    expect(frButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('changes language when button is clicked', async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcher />);

    const frButton = screen.getByLabelText('Passer au français');
    await user.click(frButton);

    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
  });

  it('displays separator between languages', () => {
    render(<LanguageSwitcher />);

    const separator = screen.getByText('|');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-hidden', 'true');
  });

  it('has keyboard navigation support', async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcher />);

    const frButton = screen.getByLabelText('Passer au français');
    frButton.focus();

    await user.keyboard('{Enter}');

    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
  });
});
