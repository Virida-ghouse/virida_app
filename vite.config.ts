import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
    exclude: ['three-stdlib']
  },
  build: {
    target: 'es2015',
    minify: false,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: undefined
      },
      external: (id) => {
        // Exclure les modules problématiques
        if (id.includes('three-stdlib/libs/lottie')) {
          return true;
        }
        return false;
      }
    }
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
  },
  preview: {
    port: 8080,
    host: '0.0.0.0',
  },
  // Assure que les routes SPA fonctionnent correctement
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
