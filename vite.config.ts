import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - libraries that rarely change
          'vendor-react': ['react', 'react-dom'],
          'vendor-routing': ['wouter'],
          'vendor-data': ['swr'],
          'vendor-state': ['jotai'],
          'vendor-i18n': ['react-i18next', 'i18next'],
        },
      },
    },
    // Generate source maps for production debugging
    sourcemap: true,
    // Optimize chunk size warnings (default is 500KB)
    chunkSizeWarningLimit: 400,
  },
});
