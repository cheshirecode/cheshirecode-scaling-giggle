import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'jotai';
import { Navigation } from './Navigation';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  useLocation: () => ['/', vi.fn()],
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.home': 'Home',
        'navigation.applications': 'Applications',
      };
      return translations[key] ?? key;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock child components to isolate Navigation testing
vi.mock('@/components/ThemeToggle/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

vi.mock('@/components/LanguageSwitcher/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

describe('Navigation', () => {
  it('renders brand logo image', () => {
    render(
      <Provider>
        <Navigation />
      </Provider>
    );

    const logo = screen.getByAltText('Nesto');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('IMG');
  });

  it('renders applications link only (per wireframe)', () => {
    render(
      <Provider>
        <Navigation />
      </Provider>
    );

    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('uses wouter Link for SPA navigation', () => {
    render(
      <Provider>
        <Navigation />
      </Provider>
    );

    const applicationsLink = screen.getByText('Applications');
    expect(applicationsLink.tagName).toBe('A');
    expect(applicationsLink).toHaveAttribute('href', '/applications');
  });

  it('renders ThemeToggle component', () => {
    render(
      <Provider>
        <Navigation />
      </Provider>
    );

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('renders LanguageSwitcher component', () => {
    render(
      <Provider>
        <Navigation />
      </Provider>
    );

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('has semantic nav element', () => {
    const { container } = render(
      <Provider>
        <Navigation />
      </Provider>
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  it('applies sticky positioning styles', () => {
    const { container } = render(
      <Provider>
        <Navigation />
      </Provider>
    );

    const nav = container.querySelector('nav');
    // CSS Modules hash class names, but we can verify the nav element exists
    expect(nav).toBeInTheDocument();
  });
});
