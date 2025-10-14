import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

/**
 * Input component with label, validation, and accessibility
 *
 * @example
 * // Basic input with label
 * <Input label="Email" type="email" required />
 *
 * @example
 * // With error state
 * <Input
 *   label="First Name"
 *   value={firstName}
 *   onChange={(e) => setFirstName(e.target.value)}
 *   error={errors.firstName}
 * />
 *
 * @example
 * // With helper text
 * <Input
 *   label="Phone"
 *   type="tel"
 *   helperText="Format: (123) 456-7890"
 * />
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  required,
  id,
  className,
  ...props
}: InputProps): JSX.Element {
  const inputId = id ?? `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.input} ${hasError ? styles.error : ''} ${className ?? ''}`}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        required={required}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
}

