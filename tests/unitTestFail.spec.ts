import { test } from '@playwright/test';
import { CustomAsserts } from '../asserts/customAsserts';

test.beforeEach(async ({ page }) => {
  // Define screen size
  await page.setViewportSize({ width: 1920, height: 1080 });
});

test.skip('Unit Test Intentional Fail: assertTrue', async ({ page }) => {
  CustomAsserts.assertTrue(5 > 10, "5 should be greater than 10");
});

test.skip('Unit Test Intentional Fail: assertFalse', async ({ page }) => {
  CustomAsserts.assertFalse(10 > 5, "10 should not be greater than 5");
});

test.skip('Unit Test Intentional Fail: assertObjectsEqual', async ({ page }) => {
  const obj1 = { name: "Erick", age: 30 };
  const obj2 = { name: "Jimenez", age: 25 };
  CustomAsserts.assertObjectsEqual(obj1, obj2, "Objects should be equal");
});

test.skip('Unit Test Intentional Fail: assertObjectsNotEqual', async ({ page }) => {
  const obj1 = { name: "Erick", age: 30 };
  const obj2 = { name: "Erick", age: 30 };
  CustomAsserts.assertObjectsNotEqual(obj1, obj2, "Objects should not be equal");
});

test.skip('Unit Test Intentional Fail: assertStringContains', async ({ page }) => {
  const str1 = "Playwright is awesome";
  const str2 = "bad";
  CustomAsserts.assertStringContains(str1, str2, "String should contain the substring");
});

test.skip('Unit Test Intentional Fail: assertStringDoesNotContain', async ({ page }) => {
  const str1 = "Playwright is awesome";
  const str2 = "awesome";
  CustomAsserts.assertStringDoesNotContain(str1, str2, "String should not contain the substring");
});

test.skip('Unit Test Intentional Fail: assertNumberGreaterThanOrEqual', async ({ page }) => {
  CustomAsserts.assertNumberGreaterThanOrEqual(50, 100, "50 should be greater than or equal to 100");
});

test.skip('Unit Test Intentional Fail: assertNumberLessThanOrEqual', async ({ page }) => {
  CustomAsserts.assertNumberLessThanOrEqual(100, 50, "100 should be less than or equal to 50");
});

test.skip('Unit Test Intentional Fail: assertTextGreaterThanOrEqual', async ({ page }) => {
  CustomAsserts.assertTextGreaterThanOrEqual("apple", "zebra", "apple should be greater than or equal to zebra alphabetically");
});

test.skip('Unit Test Intentional Fail: assertTextLessThanOrEqual', async ({ page }) => {
  CustomAsserts.assertTextLessThanOrEqual("zebra", "apple", "zebra should be less than or equal to apple alphabetically");
});

test.skip('Unit Test Intentional Fail: assertEquals', async ({ page }) => {
  CustomAsserts.assertEquals(42, 24, "42 should be equal to 24");
});

test.skip('Unit Test Intentional Fail: assertNotEquals', async ({ page }) => {
  CustomAsserts.assertNotEquals(42, 42, "42 should not be equal to 42");
});