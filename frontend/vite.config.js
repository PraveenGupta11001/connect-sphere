import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // to allow access from local network
    allowedHosts: ['connectsphere.local', '192.168.29.102.nip.io'], // ✅ allow custom domain
  },
})
