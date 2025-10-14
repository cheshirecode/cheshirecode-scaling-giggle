/**
 * Error types for API and application errors
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

export type ApiErrorResponse = {
  status: number;
  message: string;
  details?: unknown;
};

export type ValidationError = {
  field: string;
  message: string;
};

