import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

/**
 * Button component with variants, sizes, and loading states
 *
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>Save</Button>
 *
 * @example
 * // Loading state
 * <Button loading={isMutating} disabled={isMutating}>
 *   {isMutating ? 'Saving...' : 'Save'}
 * </Button>
 *
 * @example
 * // Full width button
 * <Button variant="secondary" fullWidth>Cancel</Button>
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps): JSX.Element {
  const classes = [
    'button',
    variant,
    size !== 'medium' && size,
    fullWidth && 'full-width',
    loading && 'loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled ?? loading} aria-busy={loading} {...props}>
      {children}
    </button>
  );
}
