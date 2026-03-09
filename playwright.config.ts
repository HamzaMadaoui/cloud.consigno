import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    // 1. Login once, save session to disk
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // 2. Tests that require NO session (login page + unauthenticated access control)
    {
      name: 'no-auth',
      testMatch: [/01-auth\.spec\.ts/, /06-navigation-and-access-control\.spec\.ts/],
      use: { ...devices['Desktop Chrome'] },
    },

    // 3. All other tests reuse saved session — no re-login per test
    {
      name: 'chromium',
      testIgnore: [
        /auth\.setup\.ts/,
        /01-auth\.spec\.ts/,
        /06-navigation-and-access-control\.spec\.ts/,
        /07-logout\.spec\.ts/,
      ],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // 4. Logout tests run LAST with fresh login per test
    //    Never uses shared storageState — prevents session invalidation cascade
    {
      name: 'logout',
      testMatch: /07-logout\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
});
