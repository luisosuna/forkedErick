import { test } from '@playwright/test';
import { CustomAsserts } from '../asserts/customAsserts';
import { InterviewUtilities } from '../utilities/interviewUtilities';
import { TestUtilities } from '../utilities/testUtilities';
import * as config from '../configs/loadedConfig';
import * as fs from 'fs';
import * as path from 'path';

test.beforeEach(async ({ page }) => {
  // Define screen size
  await page.setViewportSize({ width: 1920, height: 1080 });
});

/*
Set the environment variable when running

  In the terminal:
  ENV=prod npx playwright test

  On Windows (PowerShell):
  $env:ENV="prod"; npx playwright test

  Or cross-platform via cross-env:
  npx cross-env ENV=prod npx playwright test
*/
test('Print config values', async ({ page }) => {
  TestUtilities.logToConsole("Will print all variables from dynamic JSON config files...(Forcing data type inside loadedConfig.ts)");

  TestUtilities.logToConsole("Variables declared in root directly");
  console.log("Dynamic erickVar: " + config.erickVar);
  console.log("Dynamic erickVarString: " + config.erickVarString);
  console.log("Dynamic erickVarInt: " + config.erickVarInt);
  console.log("Dynamic erickVarFloat: " + config.erickVarFloat);
  console.log("Dynamic erickVarBoolean: " + config.erickVarBoolean);
  console.log("Dynamic baseURL: " + config.baseURL);
  console.log("");

  TestUtilities.logToConsole("Variables declared in object nodes");
  console.log("Dynamic myUsername: " + config.myUsername);
  console.log("Dynamic myPassword: " + config.myPassword);
  
});

test('Read JSON directly', async ({ page }) => {
  const env = process.env.TEST_ENV || 'DEV';
  
  // Build path to the correct config file
  const configPath = path.resolve(__dirname, `./configs/${env}.json`).replace('\\tests', "");
  
  // Parse JSON config
  const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  console.log("erickVar: " + configFile.erickVar);
  console.log("erickVarString: " + configFile.erickVarString);
  console.log("erickVarInt: " + configFile.erickVarInt);
  console.log("erickVarFloat: " + configFile.erickVarFloat);
  console.log("erickVarBoolean: " + configFile.erickVarBoolean);
  console.log("baseURL: " + configFile.baseURL);
  console.log("");

  TestUtilities.logToConsole("Variables declared in object nodes");
  console.log("myUsername: " + configFile.myCredentials.myUsername);
  console.log("myPassword: " + configFile.myCredentials.myPassword);
  
});

test('Interview Richard Ledesma', async ({ page }) => {
  
  console.log(InterviewUtilities.solutionRichardLedesma([1, 3, 6, 4, 1, 2]));
  console.log(InterviewUtilities.solutionRichardLedesma([1, 2, 3]));
  console.log(InterviewUtilities.solutionRichardLedesma([-1, -3]));
  console.log(InterviewUtilities.solutionRichardLedesma([9, 8, 5, 7, 4, 3, 2, 1])); //6 expected
});

test.skip('Unit Test: Multiple Assertions New Name', async ({ page }) => {
  CustomAsserts.assertTextGreaterThanOrEqual("jimenez", "erick", "assertTextGreaterThanOrEqual");
  CustomAsserts.assertTextLessThanOrEqual("cristiano", "MESSI GOAT", "assertTextLessThanOrEqual");
  CustomAsserts.assertNumberGreaterThanOrEqual(90, 25, "assertNumberGreaterThanOrEqual");
  CustomAsserts.assertNumberLessThanOrEqual(1, 10, "assertNumberLessThanOrEqual");

  let str1: string = "Erick Eduardo Jimenez Rodriguez";
  let str2: string = "Jimenez";

  CustomAsserts.assertStringContains(str1, str2, "assertStringContains");
  CustomAsserts.assertStringDoesNotContain(str2, str1, "assertStringDoesNotContain");

  CustomAsserts.assertTrue(5 > 1, "assertTrue");
  CustomAsserts.assertFalse(5 < 1, "assertFalse");

  CustomAsserts.assertEquals("Erick", "Erick", "assertEquals");
  CustomAsserts.assertNotEquals("Erick", "erick", "assertNotEquals");
  CustomAsserts.assertNotEquals("10", 10);
  CustomAsserts.assertEquals(10.0000000, 10);
});

test.skip('Unit Test: assertTrue', async ({ page }) => {
  CustomAsserts.assertTrue(10 > 5, "10 should be greater than 5");
});

test.skip('Unit Test: assertFalse', async ({ page }) => {
  CustomAsserts.assertFalse(5 > 10, "5 should not be greater than 10");
});

test.skip('Unit Test: assertObjectsEqual', async ({ page }) => {
  const obj1 = { name: "Erick", age: 30 };
  const obj2 = { name: "Erick", age: 30 };
  CustomAsserts.assertObjectsEqual(obj1, obj2, "Objects should be equal");
});

test.skip('Unit Test: assertObjectsNotEqual', async ({ page }) => {
  const obj1 = { name: "Erick", age: 30 };
  const obj2 = { name: "Jimenez", age: 25 };
  CustomAsserts.assertObjectsNotEqual(obj1, obj2, "Objects should not be equal");
});

test.skip('Unit Test: assertStringContains', async ({ page }) => {
  const str1 = "Playwright is awesome";
  const str2 = "awesome";
  CustomAsserts.assertStringContains(str1, str2, "String should contain the substring");
});

test.skip('Unit Test: assertStringDoesNotContain', async ({ page }) => {
  const str1 = "Playwright is awesome";
  const str2 = "bad";
  CustomAsserts.assertStringDoesNotContain(str1, str2, "String should not contain the substring");
});

test.skip('Unit Test: assertNumberGreaterThanOrEqual', async ({ page }) => {
  CustomAsserts.assertNumberGreaterThanOrEqual(100, 50, "100 should be greater than or equal to 50");
});

test.skip('Unit Test: assertNumberLessThanOrEqual', async ({ page }) => {
  CustomAsserts.assertNumberLessThanOrEqual(50, 100, "50 should be less than or equal to 100");
});

test.skip('Unit Test: assertTextGreaterThanOrEqual', async ({ page }) => {
  CustomAsserts.assertTextGreaterThanOrEqual("zebra", "apple", "zebra should be greater than or equal to apple alphabetically");
});

test.skip('Unit Test: assertTextLessThanOrEqual', async ({ page }) => {
  CustomAsserts.assertTextLessThanOrEqual("apple", "zebra", "apple should be less than or equal to zebra alphabetically");
});

test.skip('Unit Test: assertEquals', async ({ page }) => {
  CustomAsserts.assertEquals(42, 42, "42 should be equal to 42");
});

test.skip('Unit Test: assertNotEquals', async ({ page }) => {
  CustomAsserts.assertNotEquals(42, 24, "42 should not be equal to 24");
});