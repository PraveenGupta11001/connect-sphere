import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['connectsphere.local', '192.168.29.102.nip.io'],
    hmr: {
      host: 'connectsphere.local', // use LAN IP or your local domain here
    }
  }
});
