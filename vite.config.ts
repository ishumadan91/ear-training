import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    // Embed build: one self-contained file a host page loads with a plain
    // classic <script src>. Lit is deliberately NOT externalised — the host (a
    // Django app with no bundler) cannot resolve a bare import. Tokens are not
    // bundled either: the host's own :root supplies them.
    //
    // IIFE rather than ESM, and that is load-bearing: a `<script type=module>`
    // fetch is always CORS-mode, so serving the bundle from a CDN on another
    // origin needs an Access-Control-Allow-Origin header the bucket does not
    // send. A classic script has no such requirement. The entry exports only
    // types, so the global this defines is an empty object — the real work is
    // the custom element registration, which is a side effect.
    return {
      build: {
        lib: {
          entry: 'src/embed.ts',
          formats: ['iife' as const],
          name: 'EarTraining',
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
