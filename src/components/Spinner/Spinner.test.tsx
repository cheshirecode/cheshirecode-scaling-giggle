import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders with custom aria-label', () => {
    render(<Spinner aria-label="Processing" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Processing');
  });

  it('has accessible hidden text', () => {
    render(<Spinner aria-label="Loading data" />);
    expect(screen.getByText('Loading data')).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen readers', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });

  it('applies medium size by default', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner.className).toContain('spinner');
  });

  it('applies small size class', () => {
    render(<Spinner size="small" />);
    const spinner = screen.getByRole('status');
    expect(spinner.className).toContain('small');
  });

  it('applies large size class', () => {
    render(<Spinner size="large" />);
    const spinner = screen.getByRole('status');
    expect(spinner.className).toContain('large');
  });

  it('renders without center wrapper by default', () => {
    const { container } = render(<Spinner />);
    const centerWrapper = container.querySelector('[class*="center"]');
    expect(centerWrapper).toBeNull();
  });

  it('renders with center wrapper when center prop is true', () => {
    const { container } = render(<Spinner center />);
    const centerWrapper = container.querySelector('[class*="center"]');
    expect(centerWrapper).toBeInTheDocument();
  });

  it('centers spinner when center prop is true', () => {
    const { container } = render(<Spinner center />);
    const centerWrapper = container.querySelector('[class*="center"]');
    const spinner = screen.getByRole('status');
    expect(centerWrapper).toContainElement(spinner);
  });
});
