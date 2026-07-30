import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Generate source maps for production debugging
    sourcemap: false,
    // Chunk size warning limit
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor dependencies into a separate chunk
        // so they can be cached independently of app code
        manualChunks: {
          vendor: ['react', 'react-dom'],
          http: ['axios'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})