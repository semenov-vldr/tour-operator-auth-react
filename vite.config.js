import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: true, // или '0.0.0.0'
    // Указываем порт, если он специфичен для вашего проекта. Если не указан, будет использоваться стандартный (5173 или 5174)
    port: 5174,
  },
})
