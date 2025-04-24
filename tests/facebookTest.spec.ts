import { test } from '@playwright/test';
import { FacebookPage } from '../pom/pages/facebookPage';
import { CustomAsserts } from '../asserts/customAsserts';
import { TestUtilities } from '../utilities/testUtilities';

var facebookPage: FacebookPage;

test.beforeAll(async () => {
  /*
  Error: "context" and "page" fixtures are not supported in "beforeAll" since they are created on a per-test basis.
  If you would like to reuse a single page between tests, create context manually with browser.newContext(). See https://aka.ms/playwright/reuse-page for details.
  If you would like to configure your page before each test, do that in beforeEach hook instead.
  */
});

test.beforeEach(async ({ page }) => {
  //Initialize pages
  facebookPage = new FacebookPage(page);

  //Define screen size
  await page.setViewportSize({ width: 1920, height: 1080 });
});

test.afterEach(async ({ page }) => {
  // Runs after each test
});

test.afterAll(async () => {
  // Runs after each run
});

test('Facebook Test Register', async ({ page }) => {
  await facebookPage.registerNewUser("Erick", "Jimenez");
});

/*
// Define the pairs of test data
const testData = [
  ['firstPairData1', 'secondPairData1'],
  ['firstPairData2', 'secondPairData2'],
  ['firstPairData3', 'secondPairData3'],
];

test.describe('Test with different data pairs', () => {
  test.each(testData)('should test with data %s and %s', async (page, data1: string, data2: string) => {
    // Example of using the data pairs in your test logic
    console.log('Running test with', data1, 'and', data2);

    // Your actual test code goes here
    // For example, you could test that these strings appear on the page or interact with elements
    await page.goto('https://example.com');
    await expect(page.locator('text="Some text that matches ' + data1 + '"')).toBeVisible();
    await expect(page.locator('text="Some text that matches ' + data2 + '"')).toBeVisible();
  });
});*/