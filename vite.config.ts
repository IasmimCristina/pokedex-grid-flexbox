import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

// <reference types="vitest/config" />, had to change it to vitest/config because of Typescript.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: "./src/tests/setup.ts",
    include: ['src/**/*.test.tsx'],
    silent: false,
    watch: true,
    coverage: {
      provider: 'v8', // 'v8' used by NodeJs
      reporter: ['text'], // Coverage on temrinal
      exclude: ['src/tests/**/*'], // Test files should not be covered.
    },  
    
  }
})
