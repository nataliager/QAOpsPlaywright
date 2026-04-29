// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 40 * 1000, //default timeout for each test is 30 seconds, we can override it here
  retries: 2, //retry failed tests, we can override it in test file
  //workers: 3, //number of parallel workers, we can override it in test file
  expect:{
    timeout: 5000, //assertion timeout
  },
  reporter: [['html'], ['allure-playwright']],
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    browserName: 'chromium', //default browser for all tests, we can override it in test file
    headless: true, //false to see the browser, true to run in headless mode
    // /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // screenshot: 'on',
    // trace: 'retain-on-failure',

  },

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: {
  //        ...devices['Desktop Chrome'],
  //       headless: false,
  //       screenshot: 'on',
  //       trace: 'retain-on-failure',
         
  //       },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { 
  //       ...devices['Desktop Firefox'],
  //       headless: true,
  //       screenshot: 'off',
  //       trace: 'on',
  //       ignoreHTTPSErrors: true,
  //       permissions: ['geolocation'],
  //       //viewport: { width: 1280, height: 720 },
  //       //...devices['iPhone 14 Pro Max'],
  //     },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { 
  //       ...devices['Desktop Safari'],
  //       headless: false,
  //       screenshot: 'only-on-failure',
  //       trace: 'off',
  //       //video: 'retain-on-failure'
  //     },
  //   },
  
  // ],
});

