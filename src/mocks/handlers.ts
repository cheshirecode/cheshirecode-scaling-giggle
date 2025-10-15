import { http, HttpResponse } from 'msw';
import { mockBestProductsResponse } from './data/products';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://nesto-fe-exam.vercel.app';

/**
 * MSW handlers for API endpoints
 * Used in tests and optionally in development
 */
export const handlers = [
  // GET /api/products/best - Fetch best products
  http.get(`${API_BASE_URL}/api/products/best`, () => {
    return HttpResponse.json(mockBestProductsResponse);
  }),

  // GET /api/products/best - Error scenario handler (can be used in tests)
  http.get(`${API_BASE_URL}/api/products/best-error`, () => {
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
  }),
];
