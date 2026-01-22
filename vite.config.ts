import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', 
  // SECURITY: Ensure we don't accidentally expose non-public env vars
  envPrefix: 'VITE_', 
  build: {
    outDir: 'dist',
    sourcemap: false, // SECURITY: Disable sourcemaps in production to hide implementation details
  },
});