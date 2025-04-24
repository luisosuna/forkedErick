import { Page } from '@playwright/test';
import { BasePage } from './parent/basePage';
import { IBasePage } from './parent/iBasePage';
import { SwagAbilities } from '../abilities/swagAbilities';
import proxymise from "proxymise";

export class SwagLoginPage extends BasePage implements IBasePage {

    private _swagAbilities : SwagAbilities;

    constructor(page: Page){
        super(page);
        this._swagAbilities = new SwagAbilities(); 
    }

    // This method is static now. Necessary for proxymise correct work
    public static async initPage(page: Page): Promise<SwagLoginPage> {
        return new SwagLoginPage(page);
    }

    //*********************************************** INTERFACE METHODS ***********************************************
    async goTo() : Promise<void> {
        let url: string = this._swagAbilities.getURL();
        await this.goToURL(url);
    }

    //************************************************ PUBLIC METHODS ************************************************

    public async loginWithCredentials(username : string, password : string): Promise<SwagLoginPage> {
        
        this.methodStart("loginWithCredentials", username);

        //Call PRIVATE method from INTERFACE
        await this.goTo();

        //WAY #1: Native ENTER TEXT
        //await this.page.locator(this.SwagLoginElements.InputUsername).fill(username);
        //await this.page.locator(this.SwagLoginElements.InputPassword).fill(password);

        //WAY #2: Custom from parent class ENTER TEXT
        await this.enterText(this.SwagLoginElements.InputUsername, username, "Username [Input]");
        await this.enterText(this.SwagLoginElements.InputPassword, password, "Password [Input]");

        //Continue with click
        await this.click(this.SwagLoginElements.ButtonLogin, "Login [Button]");
        
        //Validate new page is displayed
        await this.verifyElementIsEnabled(this.SwagDashboardElements.TitleProducts, "Products [Title]");

        //Return THIS in order to allow method chaining
        this.methodEnd("loginWithCredentials");
        return this;
    }

    //************************************************ PRIVATE METHODS ************************************************
}

export default proxymise(SwagLoginPage);