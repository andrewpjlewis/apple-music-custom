import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/spotify': 'https://apple-music-custom.onrender.com',
      '/auth': 'https://apple-music-custom.onrender.com'
    }
  }
})
