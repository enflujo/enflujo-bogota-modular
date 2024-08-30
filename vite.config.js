import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // base: '/',
  server: {
    port: 3000,
  },
  publicDir: 'estaticos',
  build: {
    outDir: 'publico',
    assetsDir: 'estaticos',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/'),
    },
  },
});
