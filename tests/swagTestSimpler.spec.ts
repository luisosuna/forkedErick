import { test } from '@playwright/test';
import { ProductSortingOptions } from '../utilities/productSortingOptions';
import { CustomAsserts } from '../asserts/customAsserts';
import { TestUtilities } from '../utilities/testUtilities';
import SwagLoginPage from '../pom/pages/swagLoginPage'; // To use proymise import has to be without {}
import SwagDashboardPage from '../pom/pages/swagDashboardPage';

var swagLoginPage;
var swagDashboardPage;

test.beforeAll(async () => {
  /*
  Error: "context" and "page" fixtures are not supported in "beforeAll" since they are created on a per-test basis.
  If you would like to reuse a single page between tests, create context manually with browser.newContext(). See https://aka.ms/playwright/reuse-page for details.
  If you would like to configure your page before each test, do that in beforeEach hook instead.
  */
});

test.beforeEach(async ({ page }) => {
  //Initialize pages with static method in order to use proxymise and chain calls
  swagLoginPage = SwagLoginPage.initPage(page); // new SwagLoginPage(page); // old implementation
  swagDashboardPage = SwagDashboardPage.initPage(page);

  //Define screen size
  await page.setViewportSize({ width: 1920, height: 1080 });
});

test.afterEach(async ({ page }) => {
  // Runs after each test
});

test.afterAll(async () => {
  // Runs after each run
});

test('Add products to cart ONE BY ONE', async ({ page }) => {
  await swagLoginPage.loginWithCredentials("standard_user", "secret_sauce");

  await swagDashboardPage
            .addProductToCart("Sauce Labs Bike Light")
            .addProductToCart("Sauce Labs Fleece Jacket")
            .sortProducts(ProductSortingOptions.NameAscending)
            .verifyCorrectProductsSorting(ProductSortingOptions.NameAscending)
            .sortProducts(ProductSortingOptions.PriceAscending)
            .verifyCorrectProductsSorting(ProductSortingOptions.PriceAscending)
            .sortProducts(ProductSortingOptions.NameDescending)
            .verifyCorrectProductsSorting(ProductSortingOptions.NameDescending)
            .sortProducts(ProductSortingOptions.PriceDescending)
            .verifyCorrectProductsSorting(ProductSortingOptions.PriceDescending);
});

test('Add products to cart ALL AT ONCE', async ({ page }) => {
  await swagLoginPage.loginWithCredentials("standard_user", "secret_sauce");

  let list : string[] = [ "Sauce Labs Bike Light", "Sauce Labs Fleece Jacket"];

  await swagDashboardPage
            .addProductsToCart(list)
            .sortProducts(ProductSortingOptions.PriceAscending)
            .sortProducts(ProductSortingOptions.NameAscending)
            .sortProducts(ProductSortingOptions.PriceDescending)
            .sortProducts(ProductSortingOptions.PriceDescending);
});