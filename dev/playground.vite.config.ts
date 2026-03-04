import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './dev/playground.ts',
      formats: [ 'es' ],
      fileName: 'playground'
    },
    outDir: './dev/build'
  }
})