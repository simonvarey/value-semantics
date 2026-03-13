import { defineConfig } from 'vitest/config';
import { doctest } from './test/doctest';

export default defineConfig({
  plugins: [doctest({ markdownSetup: 'import { equals, clone, customize } from "./lib/main";\n' })],
  build: {
    lib: {
      entry: './lib/main.ts',
      formats: [ 'es' ],
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'html', 'clover', 'json', 'json-summary'],
      include: ['lib/**']
    },
    includeSource: [
      './**/*.md'
    ],
  }
})