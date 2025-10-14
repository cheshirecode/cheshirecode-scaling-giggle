import { describe, it, expect } from 'vitest';
import { formatPercentage, formatPhoneNumber, capitalize } from './formatters';

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

