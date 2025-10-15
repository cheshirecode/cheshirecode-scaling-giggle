import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Build vendor map from package.json dependencies
 * Groups packages by logical categories for optimal chunking
 */
function buildVendorMap(): Record<string, string> {
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
    dependencies?: Record<string, string>;
  };

  const dependencies = packageJson.dependencies ?? {};
  const vendorMap: Record<string, string> = {};

  // Categorize dependencies by their purpose
  // This allows logical grouping for better cache invalidation
  for (const pkg of Object.keys(dependencies)) {
    // Skip React core (handled separately, but keep react-i18next)
    if (pkg === 'react' || pkg === 'react-dom') {
      continue;
    }

    // Route/navigation libraries
    if (pkg.includes('route') || pkg.includes('router') || pkg === 'wouter') {
      vendorMap[pkg] = 'vendor-routing';
    }
    // Data fetching/caching libraries
    else if (pkg.includes('swr') || pkg.includes('query') || pkg.includes('fetch')) {
      vendorMap[pkg] = 'vendor-data';
    }
    // State management libraries
    else if (pkg.includes('jotai') || pkg.includes('zustand') || pkg.includes('redux')) {
      vendorMap[pkg] = 'vendor-state';
    }
    // i18n libraries
    else if (pkg.includes('i18n') || pkg.includes('intl')) {
      vendorMap[pkg] = 'vendor-i18n';
    }
    // All other dependencies go to a generic vendor chunk
    else {
      vendorMap[pkg] = 'vendor-lib';
    }
  }

  return vendorMap;
}

// Build vendor map once at config time
const VENDOR_MAP = buildVendorMap();

// Log vendor map in development for debugging
if (process.env.NODE_ENV !== 'production') {
  console.log('📦 Vendor chunk map:', VENDOR_MAP);
}

/**
 * Dynamically create vendor chunks based on module ID
 * Prevents circular dependencies and optimizes caching
 *
 * Strategy:
 * - Group React ecosystem (react, react-dom, react-*)
 * - Separate other dependencies by category (routing, data, state, i18n)
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

  // Use dynamic vendor map built from package.json
  return VENDOR_MAP[packageName];
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
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
