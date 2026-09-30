import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IPs so mobile phones on the same Wi-Fi can open it!
    port: 5173,
  },
});
