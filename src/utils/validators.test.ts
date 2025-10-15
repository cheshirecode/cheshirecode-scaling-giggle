import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateName,
  composeValidators,
} from './validators';

describe('validators', () => {
  describe('validateEmail', () => {
    it('returns undefined for valid email', () => {
      expect(validateEmail('user@example.com')).toBeUndefined();
      expect(validateEmail('test.user+tag@domain.co.uk')).toBeUndefined();
    });

    it('returns error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
    });

    it('returns error for invalid email format', () => {
      expect(validateEmail('notanemail')).toBe('Please enter a valid email address');
      expect(validateEmail('missing@domain')).toBe('Please enter a valid email address');
      expect(validateEmail('@domain.com')).toBe('Please enter a valid email address');
      expect(validateEmail('user@')).toBe('Please enter a valid email address');
    });
  });

  describe('validatePhone', () => {
    it('returns undefined for valid phone numbers', () => {
      expect(validatePhone('1234567890')).toBeUndefined();
      expect(validatePhone('11234567890')).toBeUndefined();
      expect(validatePhone('(123) 456-7890')).toBeUndefined();
      expect(validatePhone('123-456-7890')).toBeUndefined();
    });

    it('returns error for empty phone', () => {
      expect(validatePhone('')).toBe('Phone number is required');
    });

    it('returns error for too short phone number', () => {
      expect(validatePhone('123456789')).toBe('Phone number must be at least 10 digits');
      expect(validatePhone('12345')).toBe('Phone number must be at least 10 digits');
    });

    it('returns error for too long phone number', () => {
      expect(validatePhone('123456789012')).toBe('Phone number is too long');
    });
  });

  describe('validateRequired', () => {
    it('returns undefined for non-empty value', () => {
      expect(validateRequired('value')).toBeUndefined();
      expect(validateRequired('a')).toBeUndefined();
    });

    it('returns error for empty value', () => {
      expect(validateRequired('')).toBe('This field is required');
      expect(validateRequired('   ')).toBe('This field is required');
    });

    it('uses custom field name in error message', () => {
      expect(validateRequired('', 'Email')).toBe('Email is required');
      expect(validateRequired('   ', 'Phone')).toBe('Phone is required');
    });
  });

  describe('validateMinLength', () => {
    it('returns undefined when value meets minimum length', () => {
      expect(validateMinLength('hello', 5)).toBeUndefined();
      expect(validateMinLength('hello', 3)).toBeUndefined();
    });

    it('returns error when value is too short', () => {
      expect(validateMinLength('hi', 5)).toBe('This field must be at least 5 characters');
      expect(validateMinLength('', 1)).toBe('This field must be at least 1 characters');
    });

    it('uses custom field name in error message', () => {
      expect(validateMinLength('hi', 5, 'Password')).toBe('Password must be at least 5 characters');
    });
  });

  describe('validateMaxLength', () => {
    it('returns undefined when value is within maximum length', () => {
      expect(validateMaxLength('hello', 10)).toBeUndefined();
      expect(validateMaxLength('hello', 5)).toBeUndefined();
    });

    it('returns error when value is too long', () => {
      expect(validateMaxLength('hello world', 10)).toBe(
        'This field must be no more than 10 characters'
      );
    });

    it('uses custom field name in error message', () => {
      expect(validateMaxLength('too long value', 5, 'Bio')).toBe(
        'Bio must be no more than 5 characters'
      );
    });
  });

  describe('validateName', () => {
    it('returns undefined for valid names', () => {
      expect(validateName('John')).toBeUndefined();
      expect(validateName('Mary-Jane')).toBeUndefined();
      expect(validateName("O'Brien")).toBeUndefined();
      expect(validateName('Jean Paul')).toBeUndefined();
    });

    it('returns error for empty name', () => {
      expect(validateName('')).toBe('Name is required');
    });

    it('returns error for name with special characters', () => {
      expect(validateName('John123')).toBe(
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      );
      expect(validateName('John@Doe')).toBe(
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      );
    });

    it('returns error for name too short', () => {
      expect(validateName('A')).toBe('Name must be at least 2 characters');
    });

    it('uses custom field name in error message', () => {
      expect(validateName('', 'First Name')).toBe('First Name is required');
      expect(validateName('A', 'Last Name')).toBe('Last Name must be at least 2 characters');
    });
  });

  describe('composeValidators', () => {
    it('returns undefined when all validators pass', () => {
      const validator = composeValidators(
        (val) => validateRequired(val, 'Field'),
        (val) => validateMinLength(val, 3, 'Field')
      );

      expect(validator('hello')).toBeUndefined();
    });

    it('returns first error encountered', () => {
      const validator = composeValidators(
        (val) => validateRequired(val, 'Field'),
        (val) => validateMinLength(val, 5, 'Field'),
        (val) => validateMaxLength(val, 3, 'Field')
      );

      expect(validator('')).toBe('Field is required');
      expect(validator('hi')).toBe('Field must be at least 5 characters');
    });

    it('stops validation at first error', () => {
      let secondValidatorCalled = false;

      const validator = composeValidators(
        () => 'First error',
        () => {
          secondValidatorCalled = true;
          return undefined;
        }
      );

      validator('test');
      expect(secondValidatorCalled).toBe(false);
    });

    it('works with no validators', () => {
      const validator = composeValidators();
      expect(validator('anything')).toBeUndefined();
    });
  });
});
