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

  it('renders dropdown toggle button with current theme', () => {
    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    // Check for the toggle button with theme.label aria-label
    const toggleButton = screen.getByRole('button', { expanded: false });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-haspopup', 'true');
    expect(toggleButton).toHaveAttribute('aria-label', 'theme.label');

    // Default theme is 'system', should show system icon and label
    expect(toggleButton).toHaveTextContent('💻');
    expect(toggleButton).toHaveTextContent('theme.system');
  });

  it('opens dropdown when toggle button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    const toggleButton = screen.getByRole('button', { expanded: false });
    await user.click(toggleButton);

    // Dropdown should now be visible with menu role
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    // All three options should be visible
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(3);
  });

  it('displays all theme options in dropdown with icons and descriptions', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);

    // Check for system option (should be first and active)
    const systemOption = screen.getByRole('menuitem', {
      name: /theme\.system.*theme\.systemDesc/,
    });
    expect(systemOption).toBeInTheDocument();
    expect(systemOption).toHaveTextContent('💻');
    expect(systemOption).toHaveClass('active');

    // Check for light option
    const lightOption = screen.getByRole('menuitem', {
      name: /theme\.light.*theme\.lightDesc/,
    });
    expect(lightOption).toBeInTheDocument();
    expect(lightOption).toHaveTextContent('☀️');

    // Check for dark option
    const darkOption = screen.getByRole('menuitem', {
      name: /theme\.dark.*theme\.darkDesc/,
    });
    expect(darkOption).toBeInTheDocument();
    expect(darkOption).toHaveTextContent('🌙');
  });

  it('calls applyTheme when theme option is selected', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    // Open dropdown
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);

    // Click light theme option
    const lightOption = screen.getByRole('menuitem', {
      name: /theme\.light/,
    });
    await user.click(lightOption);

    expect(themeAtomModule.applyTheme).toHaveBeenCalledWith('light');
  });

  it('closes dropdown after selecting a theme', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    // Open dropdown
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);

    // Select an option
    const darkOption = screen.getByRole('menuitem', { name: /theme\.dark/ });
    await user.click(darkOption);

    // Dropdown should be closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes dropdown when Escape key is pressed', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <ThemeToggle />
      </Provider>
    );

    // Open dropdown
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);

    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Press Escape
    await user.keyboard('{Escape}');

    // Dropdown should be closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
