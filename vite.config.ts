import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    // Polyfill for Node.js process global
    'process.env': {},
    'process.platform': '"browser"',
    'process.version': '"v16.0.0"',
    'process.versions': '{}',
    'process.browser': 'true',
    'process.node': 'false'
  },
  optimizeDeps: {
    exclude: ['@aws-amplify/backend']
  },
  build: {
    // Optimize build performance
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunking for better performance
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: ['vue', 'vue-router'],
          // AWS Amplify separate chunk
          aws: ['aws-amplify', '@aws-amplify/ui-vue']
        }
      }
    },
    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  // Optimize dev server for mobile testing
  server: {
    host: true, // Allow external access for mobile testing
    port: 5173,
    // Enable compression
    middlewareMode: false
  },
  // CSS optimization
  css: {
    devSourcemap: false
  }
})
