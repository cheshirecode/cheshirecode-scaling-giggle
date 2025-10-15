import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'jotai';
import { ThemeToggle } from './ThemeToggle';
import * as themeAtomModule from '@/atoms/themeAtom';

// Mock the applyTheme function
vi.mock('@/atoms/themeAtom', async () => {
  const actual = await vi.importActual('@/atoms/themeAtom');
  return {
    ...actual,
    applyTheme: vi.fn(),
  };
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all three theme buttons', () => {
    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    expect(screen.getByLabelText('Light theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark theme')).toBeInTheDocument();
    expect(screen.getByLabelText('System theme')).toBeInTheDocument();
  });

  it('has accessible group label', () => {
    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    const group = screen.getByRole('group', { name: 'Theme selection' });
    expect(group).toBeInTheDocument();
  });

  it('shows aria-pressed state for active theme', () => {
    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    // Default theme is 'system'
    const systemButton = screen.getByLabelText('System theme');
    expect(systemButton).toHaveAttribute('aria-pressed', 'true');

    const lightButton = screen.getByLabelText('Light theme');
    expect(lightButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls applyTheme when theme button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    const lightButton = screen.getByLabelText('Light theme');
    await user.click(lightButton);

    expect(themeAtomModule.applyTheme).toHaveBeenCalledWith('light');
  });

  it('updates active state when theme changes', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    const darkButton = screen.getByLabelText('Dark theme');
    await user.click(darkButton);

    expect(darkButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('has keyboard navigation support', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    const lightButton = screen.getByLabelText('Light theme');
    lightButton.focus();

    await user.keyboard('{Enter}');

    expect(themeAtomModule.applyTheme).toHaveBeenCalledWith('light');
  });
});
