import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/spotify': {
        target: 'https://apple-music-custom.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://apple-music-custom.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})