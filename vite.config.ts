import { defineConfig } from 'vite';

export default defineConfig({
  // Served from a project-pages subpath (…/ear-training/), so built asset
  // URLs must carry that prefix. A root-relative base would 404 in production.
  base: '/ear-training/',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});
