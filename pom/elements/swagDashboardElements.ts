export class SwagDashboardElements {

    //Define locators that should return LIST OF elements
    ListAllAddToCardButtons = "[id*='add-to-cart-']";
    AllButtonsAddToCart = "[id*='add-to-cart']";
    ListAllProductsNames = "[data-test='inventory-item-name']";
    ListAllProductsPrices = ".inventory_item_price";

    //Define locators that should return SINGLE element  
    TitleProducts : string = ".title";
    ItemFromCatalogDescriptionXpath = "//*[@data-test='inventory-item-name' and contains(text(),'{{key}}')]";
    ItemFromCatalogDescriptionCssPW = this.ListAllProductsNames + ":has-text('{{key}}')";
    ButtonAddToCartItemFromCatalog = this.ItemFromCatalogDescriptionXpath + "/following::button[1]";
    DdlProductsSort = ".product_sort_container";

    //Try same approach with XPATH and CSS-SELECTOR (only works in PlayWright, not on Chrome or other browsers)
    DummyItemFromCatalogDescriptionXpath = "//*[@data-test='inventory-item-name' and contains(text(),'Backpack')]";
    DummyItemFromCatalogDescriptionCssPW = this.ListAllProductsNames + ":has-text('Backpack')";
}