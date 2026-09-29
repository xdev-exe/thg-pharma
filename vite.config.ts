import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    __META_PIXEL_ID__: JSON.stringify(
      process.env.VITE_META_PIXEL_ID ?? '2145574049372443'
    ),
  },
});
