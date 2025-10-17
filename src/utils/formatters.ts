/**
 * Utility functions for formatting data
 */

/**
 * Formats a number as a percentage with specified decimal places
 * @param value - The number to format (e.g., 0.0525 for 5.25%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a phone number to (XXX) XXX-XXXX format
 * @param phone - The phone number string (digits only)
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = /^(\d{3})(\d{3})(\d{4})$/.exec(cleaned);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
}

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats a rate value as a percentage
 * @param rate - The rate value (e.g., 3.5 for 3.50%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted rate string (e.g., "3.50%")
 *
 * @example
 * formatRate(3.5) // "3.50%"
 * formatRate(4.125) // "4.13%"
 */
export function formatRate(rate: number, decimals = 2): string {
  return `${rate.toFixed(decimals)}%`;
}

/**
 * Formats a product term enum to human-readable string
 * @param term - The product term enum (e.g., "3_YEAR")
 * @returns Formatted term string (e.g., "3 Year")
 *
 * @example
 * formatTerm("3_YEAR") // "3 Year"
 * formatTerm("10_YEAR") // "10 Year"
 */
export function formatTerm(term: string): string {
  const [years] = term.split('_');
  return `${years} Year`;
}

/**
 * Format an ISO date string to a localized date
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
