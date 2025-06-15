import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8000',
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  retries: 1,
  reporter: [
    ['html', { open: 'always' }], 
    ['json', { outputFile: 'report.json' }]
  ],
});
