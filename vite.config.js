import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // VITE_BASE lets CI build for subpath hosting (e.g. GitHub Pages at /Citrus/).
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
});
