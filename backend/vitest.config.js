import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Disable parallel execution of test files since they share the same database
    fileParallelism: false,
  },
});
