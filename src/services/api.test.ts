import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetcher, post, put } from './api';
import { ApiError } from '../types/errors';

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetcher', () => {
    it('successfully fetches and parses JSON', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => Promise.resolve(mockData),
      });

      const result = await fetcher<typeof mockData>('/test');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://nesto-fe-exam.vercel.app/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Nesto-Candidat': expect.any(String) as string,
          }) as Record<string, string>,
        })
      );
    });

    it('throws ApiError on HTTP error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('Resource not found'),
      });

      try {
        await fetcher('/test');
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
        expect((error as ApiError).message).toBe('Resource not found');
      }
    });

    it('handles network errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetcher('/test');
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Network error');
      }
    });

    it('handles absolute URLs', async () => {
      const mockData = { test: true };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => Promise.resolve(mockData),
      });

      await fetcher('https://example.com/api/test');

      expect(global.fetch).toHaveBeenCalledWith('https://example.com/api/test', expect.any(Object));
    });
  });

  describe('post', () => {
    it('sends POST request with body', async () => {
      const mockData = { id: 1 };
      const body = { name: 'Test' };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => Promise.resolve(mockData),
      });

      const result = await post('/test', body);

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe('put', () => {
    it('sends PUT request with body', async () => {
      const mockData = { id: 1, updated: true };
      const body = { name: 'Updated' };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => Promise.resolve(mockData),
      });

      const result = await put('/test/1', body);

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        })
      );
    });
  });
});
