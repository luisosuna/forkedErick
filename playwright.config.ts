import { defineConfig, devices } from '@playwright/test';
import { ProjectTestConfig } from './ProjectTestConfig';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export const env = process.env.TEST_ENV || 'DEV';

// Build path to the correct config file
export const configPath = path.resolve(__dirname, `./configs/${env}.json`);

// Parse JSON config
export const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

//See https://www.youtube.com/watch?v=XqcXzfOiUus for reference
//export default defineConfig({
export const config: ProjectTestConfig = {
  timeout: 30000, // Global timeout for all tests in milliseconds (default is 30 seconds)
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  //reporter: process.env.CI ? 'dot' : 'list',
  //reporter: process.env.CI ? 'dot' : 'html',
  reporter: [
    ['list'],
    ['json', {  outputFile: 'test-results-ej.json' }],
    ['html', { outputFolder: 'playwright-report' }],
    //['allure-playwright', { outputDir: 'allure-results' }],
    [process.env.CI ? 'dot' : 'html', { open: 'always' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    //Variables from root
    baseURL: configFile.baseURL,
    erickVar: configFile.erickVar,
    erickVarString: configFile.erickVarString,  
    erickVarInt: configFile.erickVarInt,
    erickVarFloat: configFile.erickVarFloat,
    erickVarBoolean : configFile.erickVarBoolean,
    //Variables from object nodes
    myUsername: configFile.myCredentials.myUsername,
    myPassword: configFile.myCredentials.myPassword,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on', // Options: 'on', 'off', 'retain-on-failure', 'on-first-retry'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }/*,

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
};

export default config;