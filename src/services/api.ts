/**
 * API Client for Nesto Frontend Challenge
 * Base fetcher for SWR with error handling
 */

import { ApiError } from '../types/errors';

const API_BASE_URL = 'https://nesto-fe-exam.vercel.app/api';
const CANDIDATE_NAME = 'Dac Anh Tran'; // TODO: Replace with actual candidate name

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Nesto-Candidat': CANDIDATE_NAME,
};

/**
 * Generic fetcher for SWR
 * @param url - API endpoint (relative to base URL or absolute)
 * @param init - Fetch options
 * @returns Parsed JSON response
 * @throws ApiError with status and message
 */
export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(fullUrl, {
      ...init,
      signal: controller.signal,
      headers: {
        ...DEFAULT_HEADERS,
        ...(init?.headers || {}),
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new ApiError(response.status, text || response.statusText);
    }

    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      throw new ApiError(0, error.message);
    }

    throw new ApiError(0, 'Unknown error occurred');
  }
}

/**
 * Helper for POST requests
 */
export async function post<T>(url: string, body: unknown): Promise<T> {
  return fetcher<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Helper for PUT requests
 */
export async function put<T>(url: string, body: unknown): Promise<T> {
  return fetcher<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * Helper for DELETE requests
 */
export async function del<T>(url: string): Promise<T> {
  return fetcher<T>(url, {
    method: 'DELETE',
  });
}

