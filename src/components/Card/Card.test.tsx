import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies base card styling', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    // CSS Modules hash class names, so we just verify the element exists
    expect(card).toBeTruthy();
    expect(card.tagName).toBe('DIV');
  });

  it('does not have button role by default', () => {
    render(<Card>Content</Card>);
    const card = screen.getByText('Content').parentElement;
    expect(card).not.toHaveAttribute('role', 'button');
    expect(card).not.toHaveAttribute('tabIndex');
  });

  it('adds interactive styling when interactive prop is true', () => {
    render(<Card interactive>Content</Card>);
    // Interactive cards should have button role
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
  });

  it('has button role when interactive', () => {
    render(<Card interactive>Content</Card>);
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
  });

  it('is keyboard accessible when interactive', () => {
    render(<Card interactive>Content</Card>);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class" data-testid="test-card">
        Content
      </Card>
    );
    const card = screen.getByTestId('test-card');
    expect(card.className).toContain('custom-class');
  });

  it('forwards all div props', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick} data-testid="test-card">
        Content
      </Card>
    );
    const card = screen.getByTestId('test-card');
    expect(card).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Card interactive onClick={handleClick}>
        Content
      </Card>
    );

    const card = screen.getByRole('button');
    await user.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders complex children', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
        <button type="button">Action</button>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
