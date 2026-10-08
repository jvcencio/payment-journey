import { defineConfig } from '@playwright/test';
const pages = process.env.PAGES_BUILD === 'true';
const port = pages ? 4183 : 4173;
const url = `http://127.0.0.1:${port}${pages ? '/payment-journey/' : '/'}`;
export default defineConfig({
  testDir: 'tests/ui',
  fullyParallel: true,
  use: { baseURL: url, browserName: 'chromium' },
  webServer: {
    command: `npm run preview -- --port ${port} --strictPort`,
    url,
    reuseExistingServer: !process.env.CI,
  },
});
