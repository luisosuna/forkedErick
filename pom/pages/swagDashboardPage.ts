import { TestUtilities } from '../../utilities/testUtilities';
import { Page } from '@playwright/test';
import { BasePage } from './parent/basePage';
import { IBasePage } from './parent/iBasePage';
import { SwagAbilities } from '../abilities/swagAbilities';
import { ProductSortingOptions } from '../../utilities/productSortingOptions';
import { SortingOptions } from '../../utilities/sortingOptions';
import { CustomAsserts } from '../../asserts/customAsserts';

export class SwagDashboardPage extends BasePage implements IBasePage {

    private _swagAbilities : SwagAbilities;

    constructor(page: Page){
        super(page);
        this._swagAbilities = new SwagAbilities(); 
    }

    //*********************************************** INTERFACE METHODS ***********************************************
    async goTo() : Promise<void> {
        throw new Error("Method not implemented yet");
        await this.page.goto(this._swagAbilities.getURL()); //ToDo
    }

    //************************************************ PUBLIC METHODS ************************************************

    public async addProductToCart(wantedProduct : string): Promise<this> {
        
        this.methodStart("addProductToCart", wantedProduct);

        this.info("Adding to the cart the product: " + wantedProduct);
        let dynamicLocatorLabel : string = TestUtilities.replaceKey(this.SwagDashboardElements.ItemFromCatalogDescriptionCssPW, wantedProduct);
        let dynamicLocatorButton : string = TestUtilities.replaceKey(this.SwagDashboardElements.ButtonAddToCartItemFromCatalog, wantedProduct);

        await this.listIsNotEmpty(this.SwagDashboardElements.ListAllAddToCardButtons).then((listIsNotEmpty : boolean) => {
            CustomAsserts.assertTrue(listIsNotEmpty, "List of buttons is not empty");
        });
                    
        await this.verifyElementIsVisible(dynamicLocatorLabel, wantedProduct + " [Product from Catalog]");
        await this.verifyElementIsVisible(dynamicLocatorButton, "Add to cart [Button from " + wantedProduct + "]");

        let btnTextBefore = await this.getElementText(dynamicLocatorButton, "Add to cart [Button from " + wantedProduct + "]");
        CustomAsserts.assertEquals(btnTextBefore, "Add to cart", "Button text is correct before click");

        await this.click(dynamicLocatorButton, "Add to cart [Button from " + wantedProduct + "]");

        let btnTextAfter = await this.getElementText(dynamicLocatorButton, "Add to cart [Button from " + wantedProduct + "]");
        CustomAsserts.assertEquals(btnTextAfter, "Remove", "Button text is correct after click");
    
        this.methodEnd("addProductToCart", wantedProduct);
        return this;
    }

    public async addProductsToCart(listOfProducts : string[]): Promise<this> {
        
        const doDummyThings = false;

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

    public async sortProducts(orderBy : ProductSortingOptions) : Promise<this> {
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

    public async verifyCorrectProductsSorting(orderBy : ProductSortingOptions) : Promise<this> {
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

    //************************************************ PRIVATE METHODS ************************************************    
}
