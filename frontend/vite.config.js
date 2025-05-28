import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['localhost', '192.168.29.102', 'connectsphere.local', '127.0.0.1', '192.168.29.102.nip.io'],
    hmr: {
      host: '192.168.29.102',
      port: 5173,
      protocol: 'ws',
    },
  },
});