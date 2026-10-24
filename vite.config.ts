import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /mybitrich/; the deploy workflow sets BASE_PATH.
  // Everywhere else (local dev, Vercel, Netlify) the site lives at the root.
  base: process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/mybitrich/' : '/'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true
  }
});
