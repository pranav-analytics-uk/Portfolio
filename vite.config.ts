import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from https://<user>.github.io/Portfolio/
  base: '/Portfolio/',
  plugins: [react()],
});
