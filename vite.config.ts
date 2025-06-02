import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

// https://vite.dev/config/
export default defineConfig({
  base: '/yatzy/',
  plugins: [
    react(),
    istanbul({
      cypress: false,
      requireEnv: false,
      exclude: ['node_modules', 'e2e', 'playwright.config.ts'],
      extension: ['.js', '.ts', '.jsx', '.tsx'],
    }),
  ],
});
