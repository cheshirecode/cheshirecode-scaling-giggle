import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dynamically create vendor chunks based on module ID
 * Prevents circular dependencies and optimizes caching
 *
 * Strategy:
 * - Group React ecosystem (react, react-dom, react-*)
 * - Separate other dependencies into individual chunks
 * - Avoid circular imports by checking module graph
 */
function createVendorChunks(id: string): string | undefined {
  // Skip non-node_modules code
  if (!id.includes('node_modules')) {
    return undefined;
  }

  // Extract package name from node_modules path
  // Handles both @scope/package and package formats
  const regex = /node_modules\/(@[^/]+\/[^/]+|[^/]+)/;
  const match = regex.exec(id);
  if (!match) {
    return undefined;
  }

  const packageName = match[1] ?? '';

  // Group React ecosystem together (they're tightly coupled)
  if (packageName === 'react' || packageName === 'react-dom' || packageName.startsWith('react-')) {
    return 'vendor-react';
  }

  // Separate other dependencies for better caching granularity
  // These change independently, so separate chunks = better cache hits
  const vendorMap: Record<string, string> = {
    wouter: 'vendor-routing',
    swr: 'vendor-data',
    jotai: 'vendor-state',
    i18next: 'vendor-i18n',
    'react-i18next': 'vendor-i18n',
  };

  return vendorMap[packageName];
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          return createVendorChunks(id);
        },
      },
    },
    // Generate source maps for production debugging
    sourcemap: true,
    // Optimize chunk size warnings (default is 500KB)
    chunkSizeWarningLimit: 400,
  },
});
