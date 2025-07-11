import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/spotify': 'http://localhost:8888',
      '/auth': 'http://localhost:8888'
    }
  }
})
