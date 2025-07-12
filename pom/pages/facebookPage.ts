import { Page } from '@playwright/test';
import { BasePage } from './parent/basePage';
import { IBasePage } from './parent/iBasePage';
import { GenderOptions } from '../../utilities/genderOptions';
import { TestUtilities } from '../../utilities/testUtilities';

export class FacebookPage extends BasePage implements IBasePage {
    constructor(page: Page){
        super(page);
    }

    //*********************************************** INTERFACE METHODS ***********************************************
    async goTo() : Promise<void> {
        await this.page.goto("https://facebook.com");
    }

    //************************************************ PUBLIC METHODS ************************************************

    public async registerNewUser(firstName : string, lastName : string): Promise<this> {
        
        //Call PRIVATE method from INTERFACE
        await this.goTo();

        //Call PUBLIC methods from THIS CLASS
        await this.fillPersonBasicInfo(firstName, lastName);
        await this.fillDateOfBirth(new Date(1990, 5, 25));
        await this.fillRestOfInfo("erickj@sdetunosquare.com", GenderOptions.Male);

        //Final validation (2 ways: direct and encapsulated)
        await this.verifyElementIsEnabled(this.FacebookElements.ButtonSignUp, "Sign Up [Button]");

        //Return THIS in order to allow method chaining
        return this;
    }

    //************************************************ PRIVATE METHODS ************************************************

    private async fillPersonBasicInfo(firstName : string, lastName : string): Promise<this> {
        await this.click(this.FacebookElements.ButtonCreateNewAccount, "Create New Account [Button]");

        //Enter first name and last name
        await this.enterText(this.FacebookElements.InputFirstName, "First Name [Input]", firstName);
        await this.enterText(this.FacebookElements.InputLastName, "Last Name [Input]", lastName);

        return this;
    }

    private async fillDateOfBirth(dob : Date): Promise<this> {
        TestUtilities.printDateInfo(dob);
        TestUtilities.printCurrentFormattedTimestamp();

        let valueDay : string = dob.getDate().toString();
        let valueMonth : string = (dob.getMonth() + 1).toString();
        let valueYear : string = dob.getFullYear().toString();

        //Select day (1 - 31)
        await this.selectDropdownOptionByValue(this.FacebookElements.DDLDay, valueDay, "Day [Dropdown]");

        //Select year
        await this.selectDropdownOptionByValue(this.FacebookElements.DDLYear, valueYear, "Year [Dropdown]");

        //Select month (UI from 1 to 12)
        await this.selectDropdownOptionByValue(this.FacebookElements.DDLMonth, valueMonth, "Month [Dropdown]");

        return this;
    }

    private async fillRestOfInfo(email : string, gender : GenderOptions) : Promise<this> {
        const genericPassword : string = "P@$$w0rd1234.";

        switch(gender) {
            case GenderOptions.Male:
                await this.click(this.FacebookElements.RadioButtonMale, "Male [Radio Button]");
                break;
            case GenderOptions.Female:
                await this.click(this.FacebookElements.RadioButtonFemale, "Female [Radio Button]");
                break;
            case GenderOptions.NonBinary:
                await this.click(this.FacebookElements.RadioButtonCustom, "Custom [Radio Button]");
                break;
        }

        await this.enterText(this.FacebookElements.InputEmailOrPhone, "Email [Input]", email);
        await this.enterText(this.FacebookElements.InputPassword, "Password [Input]", genericPassword);
        
        return this;
    }
}
