import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Safe chunking strategy that prevents React duplication
 *
 * Key principles:
 * 1. Keep React + React-DOM together in ONE vendor-react chunk
 * 2. Split other dependencies by category for optimal caching
 * 3. Use dedupe to ensure single React instance
 *
 * This approach balances bundle optimization with React stability.
 */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    // Force single instance of React to prevent hook conflicts
    // CRITICAL: Must be combined with proper chunking strategy
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          // Skip non-node_modules
          if (!id.includes('node_modules')) {
            return undefined;
          }

          // CRITICAL: Keep React + React-DOM together in ONE chunk
          // They share internal state and MUST NOT be split
          if (id.includes('/react/') || id.includes('/react-dom/')) {
            return 'vendor-react';
          }

          // Safe to split: React hooks libraries (they don't have internal state)
          if (id.includes('use-sync-external-store')) {
            return 'vendor-react';
          }

          // Routing library (wouter) - small, can be separate
          if (id.includes('/wouter/')) {
            return 'vendor-routing';
          }

          // Data fetching (SWR) - independent, safe to split
          if (id.includes('/swr/')) {
            return 'vendor-data';
          }

          // State management (Jotai) - independent, safe to split
          if (id.includes('/jotai/')) {
            return 'vendor-state';
          }

          // i18n libraries - independent, safe to split
          if (id.includes('/i18next/') || id.includes('/react-i18next/')) {
            return 'vendor-i18n';
          }

          // Other small utilities can go to a generic vendor chunk
          return 'vendor-lib';
        },
      },
    },
    // Generate source maps for production debugging
    sourcemap: true,
    // Optimize chunk size warnings (default is 500KB)
    chunkSizeWarningLimit: 400,
  },
});
