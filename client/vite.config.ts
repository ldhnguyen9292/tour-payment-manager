import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import Checker from 'vite-plugin-checker';

export default defineConfig(() => {
  const env = loadEnv('', process.cwd());

  return {
    plugins: [
      react(),
      Checker({
        eslint: {
          useFlatConfig: true,
          lintCommand: "eslint 'src/**/*.{ts,tsx}'"
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000
    },
    define: {
      VITE_BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL)
    }
  };
});
