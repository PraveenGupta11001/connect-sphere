import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173, // Local dev only; Firebase uses 443
    https: {
      cert: fs.readFileSync(path.resolve(__dirname, '../backend/certs/192.168.29.102.nip.io+3.pem')),
      key: fs.readFileSync(path.resolve(__dirname, '../backend/certs/192.168.29.102.nip.io+3-key.pem')),
    },
    allowedHosts: ['localhost', '192.168.29.102', 'connectsphere.local', '127.0.0.1', '192.168.29.102.nip.io'],
    hmr: {
      host: '192.168.29.102.nip.io',
      port: 5173,
      protocol: 'wss',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});