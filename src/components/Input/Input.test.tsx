import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders required indicator when required prop is true', () => {
    render(<Input label="Email" required />);
    const label = screen.getByText('Email');
    const requiredIndicator = label.parentElement?.querySelector('span');
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('shows error message when error prop is provided', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('shows helper text when provided and no error', () => {
    render(<Input label="Phone" helperText="Format: (123) 456-7890" />);
    expect(screen.getByText('Format: (123) 456-7890')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Input label="Phone" helperText="Format: (123) 456-7890" error="Invalid phone" />);
    expect(screen.queryByText('Format: (123) 456-7890')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid phone');
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error', () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    const ariaDescribedBy = input.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBeTruthy();
    expect(document.getElementById(ariaDescribedBy!)).toHaveTextContent('Invalid email');
  });

  it('sets aria-describedby for helper text', () => {
    render(<Input label="Phone" helperText="Format: (123) 456-7890" />);
    const input = screen.getByLabelText('Phone');
    const ariaDescribedBy = input.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBeTruthy();
    expect(document.getElementById(ariaDescribedBy!)).toHaveTextContent('Format: (123) 456-7890');
  });

  it('calls onChange handler when user types', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input label="Email" onChange={handleChange} />);
    const input = screen.getByLabelText('Email');

    await user.type(input, 'test@example.com');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test@example.com');
  });

  it('applies custom className', () => {
    render(<Input label="Email" className="custom-class" />);
    const input = screen.getByLabelText('Email');
    expect(input.className).toContain('custom-class');
  });

  it('forwards all input props', () => {
    render(<Input label="Email" type="email" placeholder="Enter email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
  });

  it('generates unique id when not provided', () => {
    const { rerender } = render(<Input label="Email 1" />);
    const input1 = screen.getByLabelText('Email 1');
    const id1 = input1.getAttribute('id');

    rerender(<Input label="Email 2" />);
    const input2 = screen.getByLabelText('Email 2');
    const id2 = input2.getAttribute('id');

    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('uses provided id when specified', () => {
    render(<Input label="Email" id="email-input" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email-input');
  });
});
