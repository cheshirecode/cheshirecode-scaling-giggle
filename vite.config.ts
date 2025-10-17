import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Manual chunking disabled to prevent React duplication issues
 *
 * The manual chunking strategy was causing React/React-DOM to be split
 * into separate bundles, creating duplicate React instances despite
 * the dedupe configuration. This caused "Cannot set properties of undefined
 * (setting 'Children')" errors in production.
 *
 * Vite's default chunking respects the dedupe config properly and creates
 * a single unified bundle that works correctly across all Node versions.
 */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    // Force single instance of React to prevent hook conflicts
    // Fixes: "Cannot set properties of undefined (setting 'Children')"
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks(id: string): string | undefined {
        //   return createVendorChunks(id);
        // },
      },
    },
    // Generate source maps for production debugging
    sourcemap: true,
    // Optimize chunk size warnings (default is 500KB)
    chunkSizeWarningLimit: 400,
  },
});
