import { TestUtilities } from '../../utilities/testUtilities';
import { Page } from '@playwright/test';
import { BasePage } from './parent/basePage';
import { IBasePage } from './parent/iBasePage';
import { SwagAbilities } from '../abilities/swagAbilities';
import { ProductSortingOptions } from '../../utilities/productSortingOptions';
import { SortingOptions } from '../../utilities/sortingOptions';
import { CustomAsserts } from '../../asserts/customAsserts';
import proxymise from "proxymise";

export class SwagDashboardPage extends BasePage implements IBasePage {

    private _swagAbilities : SwagAbilities;

    constructor(page: Page){
        super(page);
        this._swagAbilities = new SwagAbilities(); 
    }

    // This method is static now. Necessary for proxymise correct work
    public static async initPage(page: Page): Promise<SwagDashboardPage> {
        return new SwagDashboardPage(page);
    }

    private itemsAlreadyAdded : string[] = [];
    private howManyItemsAlreadyAdded : number = 0;
    private expectedTotal : number = 0;

    //*********************************************** INTERFACE METHODS ***********************************************
    async goTo() : Promise<void> {
        throw new Error("Method not implemented yet");
        await this.page.goto(this._swagAbilities.getURL()); //ToDo
    }

    //************************************************ PUBLIC METHODS ************************************************

    public async addProductToCart(wantedProduct : string): Promise<SwagDashboardPage> {
        
        this.methodStart("addProductToCart", wantedProduct);

        await this.verifyElementIsNotVisible("fake.element", "Fake [Dummy Element]", 5);

        this.info("Adding to the cart the product: " + wantedProduct);
        let dynamicLocatorLabel : string = TestUtilities.replaceKey(this.SwagDashboardElements.ItemFromCatalogDescriptionCssPW, wantedProduct);
        let dynamicLocatorButton : string = TestUtilities.replaceKey(this.SwagDashboardElements.ButtonAddToCartItemFromCatalog, wantedProduct);

        await this.listIsNotEmpty(this.SwagDashboardElements.ListAllAddToCardButtons).then((listIsNotEmpty : boolean) => {
            CustomAsserts.assertTrue(listIsNotEmpty, "List of buttons is not empty");
        });
                    
        await this.verifyElementIsVisible(dynamicLocatorLabel, wantedProduct + " [Product from Catalog]");
        await this.verifyElementIsVisible(dynamicLocatorButton, "Add to cart [Button from " + wantedProduct + "]");

        let btnTextBefore = await this.getElementText(dynamicLocatorButton, "Add to cart [Button from " + wantedProduct + "]");

        if(btnTextBefore === "Remove") {
            this.info("Item was already added: " + wantedProduct);
            this.methodEnd("addProductToCart", "Was already added: " + wantedProduct);
            return this;
        }

        CustomAsserts.assertEquals(btnTextBefore, "Add to cart", "Button text is correct before click");

        await this.click(dynamicLocatorButton, "Add to cart [Button from " + wantedProduct + "]");
        this.howManyItemsAlreadyAdded++;
        this.itemsAlreadyAdded.push(wantedProduct);

        const priceLocator : string = TestUtilities.replaceKeyName("//div[@class='inventory_item' and contains(.,'{{itemName}}')]//child::*[@class='inventory_item_price']", "itemName", wantedProduct);
        const correspondingPriceStr : string = await this.getElementText(priceLocator, `'${wantedProduct}' price [Dynamic $ value]`);
        const correspondingPrice : number = TestUtilities.getNumericValue(TestUtilities.getTextAfter(correspondingPriceStr, "$"));

        this.infoYellow(`'${wantedProduct}' price: $${correspondingPrice}`);
        this.expectedTotal += correspondingPrice;

        let btnTextAfter = await this.getElementText(dynamicLocatorButton, "Add to cart [Button from " + wantedProduct + "]");
        CustomAsserts.assertEquals(btnTextAfter, "Remove", "Button text is correct after click");
    
        this.methodEnd("addProductToCart", wantedProduct);
        return this;
    }

    public async addProductsToCart(listOfProducts : string[]): Promise<SwagDashboardPage> {
        
        const doDummyThings = false;

        await this.verifyElementIsNotVisible("fake.element", "Fake [Dummy Element]", 5);

        if(doDummyThings)
        {
            await this.printElementText(this.SwagDashboardElements.DummyItemFromCatalogDescriptionXpath, "DummyItemFromCatalogDescriptionXpath");
            await this.printElementText(this.SwagDashboardElements.DummyItemFromCatalogDescriptionCssPW, "DummyItemFromCatalogDescriptionCssPW");

            await this.printDynamicElementText(this.SwagDashboardElements.ItemFromCatalogDescriptionXpath, "Bike", "ItemFromCatalogDescriptionXpath");
            await this.printDynamicElementText(this.SwagDashboardElements.ItemFromCatalogDescriptionCssPW, "Fleece", "ItemFromCatalogDescriptionCssPW");
        }       
                
        for (const locator of listOfProducts) {
            await this.addProductToCart(locator);
        }

        /*
        //This is async, so all clicks happens at the same time, not really wanted in MOST OF THE CASES
        await Promise.all(listOfProducts.map(async (wantedProduct) => {     
            
        }));

        //Click each locator one by one in sequence
        for (const locator of locators) {
            await locator.click();
        }    

        //Why for...of?
        //It ensures each click happens sequentially, waiting for one to finish before moving to the next.
        //U/like Promise.all, it preserves order, which is useful when clicks depend on previous actions.
        */
    
        return this;
    }

    public async sortProducts(orderBy : ProductSortingOptions) : Promise<SwagDashboardPage> {
        let valueAsStr : string = "";
        this.methodStart("sortProducts", orderBy.toString());

        //await this.page.waitForTimeout(800); //JUST FOR DEBUGGING PURPOSES
        
        const sortingMap: Record<ProductSortingOptions, string> = {
            [ProductSortingOptions.NameAscending]: "az",
            [ProductSortingOptions.NameDescending]: "za",
            [ProductSortingOptions.PriceAscending]: "lohi",
            [ProductSortingOptions.PriceDescending]: "hilo"
          };
          
        valueAsStr = sortingMap[orderBy];

        //Encapsulate into base page
        await this.selectDropdownOptionByValue(this.SwagDashboardElements.DdlProductsSort, valueAsStr);

        this.methodEnd("sortProducts", orderBy.toString());
        return this;
    }

    public async verifyCorrectProductsSorting(orderBy : ProductSortingOptions) : Promise<SwagDashboardPage> {
        let referenceLocator : string = "";
        var option;
        this.methodStart("verifyCorrectProductsSorting", orderBy.toString());

        switch(orderBy){
            case ProductSortingOptions.NameAscending:
                referenceLocator = this.SwagDashboardElements.ListAllProductsNames;
                option = SortingOptions.AlphabeticAsc;
                break;
            case ProductSortingOptions.NameDescending:
                referenceLocator = this.SwagDashboardElements.ListAllProductsNames;
                option = SortingOptions.AlphabeticDesc;
                break;
            case ProductSortingOptions.PriceAscending:
                referenceLocator = this.SwagDashboardElements.ListAllProductsPrices;
                option = SortingOptions.NumericAsc;
                break;
            case ProductSortingOptions.PriceDescending:
                referenceLocator = this.SwagDashboardElements.ListAllProductsPrices;
                option = SortingOptions.NumericDesc;
                break;
        }

        //Encapsulate into base page
        await this.verifyListIsSorted(referenceLocator, option, true); //bool for printListContents

        this.methodEnd("verifyCorrectProductsSorting", orderBy.toString());
        return this;
    }

    public async goToCart() : Promise<SwagDashboardPage> {
        this.methodStart("goToCart");

        CustomAsserts.assertEquals(this.howManyItemsAlreadyAdded.toString(), await this.getElementText(".shopping_cart_badge", "Items in cart [Dynamic counter]"), "Cart items counter");

        await this.click(".shopping_cart_link", "Cart [Icon]");

        this.methodEnd("goToCart");
        return this;
    }

    public async verifyCartHasCorrectItems() : Promise<SwagDashboardPage> {
        this.methodStart("verifyCartHasCorrectItems");

        const itemsDisplayedInsideCart : string[] = await this.page.locator(".inventory_item_name").allTextContents();

        CustomAsserts.assertEquals(this.howManyItemsAlreadyAdded, itemsDisplayedInsideCart.length, "All items displayed inside Cart");

        const actualItemsFromAToZ : string[] = itemsDisplayedInsideCart.sort();
        const expectedItemsFromAToZ : string[] = this.itemsAlreadyAdded.sort();

        for(let index = 0; index < expectedItemsFromAToZ.length; index++) {
            CustomAsserts.assertEquals(expectedItemsFromAToZ[index], actualItemsFromAToZ[index], "Item #" + (index + 1).toString());
        }

        this.methodEnd("verifyCartHasCorrectItems");
        return this;
    }

    public async goToCheckout() : Promise<SwagDashboardPage> {
        this.methodStart("goToCheckout", "How many items added: " + this.howManyItemsAlreadyAdded);

        await this.click("#checkout", "Checkout [Button]");
        await this.enterText("#first-name", "First Name [Input]", "Erick");
        await this.enterText("#last-name", "Last Name [Input]", "Jimenez");
        await this.enterText("#postal-code", "ZIP [Input]", "45130");
        await this.click("#continue", "Continue [Button]");

        this.methodEnd("goToCheckout");
        return this;
    }

    public async verifyFinalPriceIsCorrect() : Promise<SwagDashboardPage> {
        this.methodStart("verifyFinalPriceIsCorrect");

        const displayedPriceBeforeCleaning : string = await this.getElementText(".summary_subtotal_label", "Final price [Dynamic Value]");
        const displayedPriceAfterCleaning : number = TestUtilities.getNumericValue(TestUtilities.getTextAfter(displayedPriceBeforeCleaning, "$"));

        this.info(`Final price: ${displayedPriceBeforeCleaning}`);
        this.info(`Final price numeric: ${displayedPriceAfterCleaning}`);

        CustomAsserts.assertEquals(this.expectedTotal, displayedPriceAfterCleaning, "Total should match with selected items prices sum");

        this.methodEnd("verifyFinalPriceIsCorrect");
        return this;
    }

    //************************************************ PRIVATE METHODS ************************************************    
}

export default proxymise(SwagDashboardPage);