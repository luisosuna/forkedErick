import { test } from '@playwright/test';
import { ProductSortingOptions } from '../utilities/productSortingOptions';
import { CustomAsserts } from '../asserts/customAsserts';
import { TestUtilities } from '../utilities/testUtilities';
import SwagLoginPage from '../pom/pages/swagLoginPage'; // To use proymise import has to be without {}
import SwagDashboardPage from '../pom/pages/swagDashboardPage';

var swagLoginPage;
var swagDashboardPage;

// Runs before each run
test.beforeAll(async ({ browser }) => {
    /*
    Error: "context" and "page" fixtures are not supported in "beforeAll" since they are created on a per-test basis.
    If you would like to reuse a single page between tests, create context manually with browser.newContext(). See https://aka.ms/playwright/reuse-page for details.
    If you would like to configure your page before each test, do that in beforeEach hook instead.
    */
    //Initialize pages with static method in order to use proxymise and chain calls
    let context = await browser.newContext(); // Create multiple contexts when dealing with different web portals
    let page = await context.newPage(); // Create multiple pages when dealing with different tabs

    await page.setViewportSize({ width: 1920, height: 1080 });

    swagLoginPage = SwagLoginPage.initPage(page); // new SwagLoginPage(page); // old implementation without (browser >> context >> page)
    swagDashboardPage = SwagDashboardPage.initPage(page);

    /*
    browser >> context >> page

    So in simple words:
    •	browser = The app.
    •	context = A fresh user session.
    •	page = A tab you control.
    */
});

// Runs before each test
test.beforeEach(async () => {  
});

// Runs after each test
test.afterEach(async () => {  
});

// Runs after each run
test.afterAll(async () => {  
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