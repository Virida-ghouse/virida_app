import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 5000,
    minify: false, // Désactiver la minification pour accélérer
    sourcemap: false,
    target: 'es2015', // Target plus ancien pour moins de transformations
    rollupOptions: {
      output: {
        // Un seul chunk pour simplifier
        manualChunks: undefined
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
