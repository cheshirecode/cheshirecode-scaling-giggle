/**
 * Error types for API and application errors
 */

/**
 * Custom error class for API errors
 *
 * @example
 * try {
 *   await fetcher('/products');
 * } catch (error) {
 *   if (isApiError(error)) {
 *     console.log(`API Error ${error.status}: ${error.message}`);
 *   }
 * }
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Type guard to check if error is ApiError
 * @param error - Error to check
 * @returns true if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

