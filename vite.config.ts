import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      formats: [ 'es' ]
    }
  },
  test: {
    coverage: {
      reporter: ['text', 'html', 'clover', 'json', 'json-summary'],
    },
  },
})