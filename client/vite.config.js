import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server. The `/api` proxy forwards requests to the Express backend so
// the frontend never talks to a hard-coded address (browser-safe).
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Accept any host (including the sandbox preview host) so the site loads.
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
