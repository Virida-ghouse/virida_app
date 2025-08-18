import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    exclude: ['three-stdlib']
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      external: ['three-stdlib/libs/lottie'],
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
    // Désactiver eval() pour éviter les problèmes de sécurité
    'eval': '(function() { console.warn("eval disabled"); return function() {}; })'
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  server: {
    host: true,
    port: 5173
  }
})
