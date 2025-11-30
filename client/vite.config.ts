import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Port configuration with fallbacks
  const CLIENT_PORT = parseInt(env.VITE_PORT || env.PORT || '3000', 10);
  const SERVER_PORT = parseInt(env.VITE_API_PORT || '3001', 10);
  const API_URL = env.VITE_API_URL || `http://localhost:${SERVER_PORT}`;

  return {
    server: {
      port: CLIENT_PORT,
      strictPort: false, // Allow fallback to next available port
      host: '0.0.0.0',
      proxy: {
        // Proxy API requests to the backend server
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: CLIENT_PORT,
      strictPort: false,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_API_URL': JSON.stringify(API_URL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
    },
  };
});
