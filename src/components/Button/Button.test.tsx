/**
 * Component tests for Button
 *
 * NOTE: If these tests fail with JSDOM errors like:
 * "Cannot read properties of undefined (reading 'DONT_CONTEXTIFY')"
 * This is due to Node.js version incompatibility with JSDOM.
 * Resolution: Use Node 20 LTS or wait for JSDOM compatibility updates.
 *
 * @see https://github.com/jsdom/jsdom/issues/3363
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables when loading prop is true', () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button').className).toContain('secondary');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button').className).toContain('ghost');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button').className).toContain('small');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button').className).toContain('large');
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button').className).toContain('fullWidth');
  });
});
