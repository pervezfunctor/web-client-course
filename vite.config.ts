import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@core', replacement: path.resolve(__dirname, 'src/core') },
      { find: '@reducer', replacement: path.resolve(__dirname, 'src/reducer') },
    ],
  },
  plugins: [react({ include: '**/*.tsx' })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
