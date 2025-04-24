import { test } from '@playwright/test';
import { SwagLoginPage } from '../pom/pages/swagLoginPage';
import { SwagDashboardPage } from '../pom/pages/swagDashboardPage';
import { ProductSortingOptions } from '../utilities/productSortingOptions';
import { CustomAsserts } from '../asserts/customAsserts';
import { TestUtilities } from '../utilities/testUtilities';

var swagLoginPage: SwagLoginPage;
var swagDashboardPage: SwagDashboardPage;

test.beforeAll(async () => {
  /*
  Error: "context" and "page" fixtures are not supported in "beforeAll" since they are created on a per-test basis.
  If you would like to reuse a single page between tests, create context manually with browser.newContext(). See https://aka.ms/playwright/reuse-page for details.
  If you would like to configure your page before each test, do that in beforeEach hook instead.
  */
});

test.beforeEach(async ({ page }) => {
  //Initialize pages
  swagLoginPage = new SwagLoginPage(page);
  swagDashboardPage = new SwagDashboardPage(page);

  //Define screen size
  await page.setViewportSize({ width: 1920, height: 1080 });
});

test.afterEach(async ({ page }) => {
  // Runs after each test
});

test.afterAll(async () => {
  // Runs after each run
});

test('Method chaining sample', async ({ page }) => {
  await swagLoginPage
          .method1()
          .method2();
});

test('Add products to cart ONE BY ONE', async ({ page }) => {
  await swagLoginPage.loginWithCredentials("standard_user", "secret_sauce");

  await swagDashboardPage.addProductToCart("Sauce Labs Bike Light");
  await swagDashboardPage.addProductToCart("Sauce Labs Fleece Jacket");

  await swagDashboardPage.sortProducts(ProductSortingOptions.NameAscending);
  await swagDashboardPage.verifyCorrectProductsSorting(ProductSortingOptions.NameAscending);

  await swagDashboardPage.sortProducts(ProductSortingOptions.PriceAscending);
  await swagDashboardPage.verifyCorrectProductsSorting(ProductSortingOptions.PriceAscending);

  await swagDashboardPage.sortProducts(ProductSortingOptions.NameDescending);
  await swagDashboardPage.verifyCorrectProductsSorting(ProductSortingOptions.NameDescending);

  await swagDashboardPage.sortProducts(ProductSortingOptions.PriceDescending);
  await swagDashboardPage.verifyCorrectProductsSorting(ProductSortingOptions.PriceDescending);
});

test('Add products to cart ALL AT ONCE', async ({ page }) => {
  await swagLoginPage.loginWithCredentials("standard_user", "secret_sauce");

  let list : string[] = [ "Sauce Labs Bike Light", "Sauce Labs Fleece Jacket"];

  await swagDashboardPage.addProductsToCart(list);
  await swagDashboardPage.sortProducts(ProductSortingOptions.PriceAscending)
  await swagDashboardPage.sortProducts(ProductSortingOptions.NameAscending);
  await swagDashboardPage.sortProducts(ProductSortingOptions.PriceDescending);
  await swagDashboardPage.sortProducts(ProductSortingOptions.PriceDescending);
});