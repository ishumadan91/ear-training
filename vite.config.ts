import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    // Embed build: one self-contained ESM file a host page can load with a
    // plain <script type="module">. Lit is deliberately NOT externalised —
    // the host (a Django app with no bundler) cannot resolve a bare import.
    // Tokens are not bundled either: the host's own :root supplies them.
    return {
      build: {
        lib: {
          entry: 'src/embed.ts',
          formats: ['es' as const],
          fileName: () => 'ear-training.js',
        },
        outDir: 'dist-lib',
        emptyOutDir: true,
      },
    };
  }

  return {
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
  };
});
