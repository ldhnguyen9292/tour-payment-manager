import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import Checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    Checker({
      eslint: { useFlatConfig: true, lintCommand: "eslint 'src/**/*.{ts,tsx}'" }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  }
});
