import { describe, it, expect } from 'vitest';
import {
  formatPercentage,
  formatPhoneNumber,
  capitalize,
  formatRate,
  formatTerm,
} from './formatters';

describe('formatPercentage', () => {
  it('formats decimal to percentage with 2 decimals by default', () => {
    expect(formatPercentage(0.0525)).toBe('5.25%');
  });

  it('formats decimal to percentage with specified decimals', () => {
    expect(formatPercentage(0.05, 0)).toBe('5%');
    expect(formatPercentage(0.0525, 3)).toBe('5.250%');
  });

  it('handles zero', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });

  it('handles whole numbers', () => {
    expect(formatPercentage(1)).toBe('100.00%');
  });
});

describe('formatPhoneNumber', () => {
  it('formats 10-digit phone number', () => {
    expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
  });

  it('formats phone number with existing formatting', () => {
    expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567');
  });

  it('returns original if not 10 digits', () => {
    expect(formatPhoneNumber('123')).toBe('123');
    expect(formatPhoneNumber('12345678901')).toBe('12345678901');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter and lowercases rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
    expect(capitalize('hELLO')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A');
  });
});

describe('formatRate', () => {
  it('formats rate with 2 decimals by default', () => {
    expect(formatRate(3.5)).toBe('3.50%');
    expect(formatRate(4.125)).toBe('4.13%');
    expect(formatRate(5.25)).toBe('5.25%');
  });

  it('formats rate with specified decimals', () => {
    expect(formatRate(3.5, 1)).toBe('3.5%');
    expect(formatRate(4.125, 3)).toBe('4.125%');
    expect(formatRate(5, 0)).toBe('5%');
  });

  it('handles zero rate', () => {
    expect(formatRate(0)).toBe('0.00%');
  });

  it('handles high rates', () => {
    expect(formatRate(12.5)).toBe('12.50%');
    expect(formatRate(15.999)).toBe('16.00%');
  });
});

describe('formatTerm', () => {
  it('formats standard term values', () => {
    expect(formatTerm('1_YEAR')).toBe('1 Year');
    expect(formatTerm('3_YEAR')).toBe('3 Year');
    expect(formatTerm('5_YEAR')).toBe('5 Year');
    expect(formatTerm('10_YEAR')).toBe('10 Year');
  });

  it('handles all valid term formats', () => {
    expect(formatTerm('2_YEAR')).toBe('2 Year');
    expect(formatTerm('4_YEAR')).toBe('4 Year');
    expect(formatTerm('6_YEAR')).toBe('6 Year');
    expect(formatTerm('7_YEAR')).toBe('7 Year');
  });
});
