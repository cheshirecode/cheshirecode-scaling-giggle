/**
 * Validation utilities for form inputs
 *
 * @example
 * ```tsx
 * const emailError = validateEmail('user@example.com');
 * if (emailError) {
 *   console.log(emailError); // Display error message
 * }
 * ```
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address
 */
export function validateEmail(email: string): string | undefined {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return undefined;
}

/**
 * Validate phone number (basic North American format)
 */
export function validatePhone(phone: string): string | undefined {
  if (!phone) {
    return 'Phone number is required';
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  if (digits.length < 10) {
    return 'Phone number must be at least 10 digits';
  }

  if (digits.length > 11) {
    return 'Phone number is too long';
  }

  return undefined;
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName = 'This field'): string | undefined {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return undefined;
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName = 'This field'
): string | undefined {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return undefined;
}

/**
 * Validate maximum length
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName = 'This field'
): string | undefined {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return undefined;
}

/**
 * Validate name (no special characters except spaces, hyphens, apostrophes)
 */
export function validateName(name: string, fieldName = 'Name'): string | undefined {
  if (!name) {
    return `${fieldName} is required`;
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }

  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }

  return undefined;
}

/**
 * Compose multiple validators
 */
export function composeValidators(
  ...validators: ((value: string) => string | undefined)[]
): (value: string) => string | undefined {
  return (value: string) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return undefined;
  };
}
