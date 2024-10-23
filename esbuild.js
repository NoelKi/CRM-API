const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    sourcemap: true,
    platform: 'node',
    outfile: './dist/main.js',
    logLevel: 'info'
  })
  .catch(() => process.exit(1));