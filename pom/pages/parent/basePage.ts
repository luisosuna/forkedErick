import { Page, test, expect } from '@playwright/test';
import { FacebookElements} from "../../elements/facebookElements";
import { SwagLoginElements} from "../../elements/swagLoginElements";
import { SwagDashboardElements} from "../../elements/swagDashboardElements";
import { TestUtilities } from '../../../utilities/testUtilities';
import { SortingOptions } from '../../../utilities/sortingOptions';
import { CustomAsserts } from '../../../asserts/customAsserts';

export abstract class BasePage {

    protected FacebookElements : FacebookElements;
    protected SwagLoginElements : SwagLoginElements;
    protected SwagDashboardElements : SwagDashboardElements;
    protected page: Page;
    
    constructor(page : Page) {
        this.page = page;
        this.FacebookElements = new FacebookElements();
        this.SwagLoginElements = new SwagLoginElements();
        this.SwagDashboardElements = new SwagDashboardElements();
    }

    //------------------------------------ LOGGING INTERACTIONS ------------------------------------

    protected async info(message : string) : Promise<void> {
        TestUtilities.logToConsole(message);
    }

    protected async methodStart(methodName : string, additionalInfo : string = "") : Promise<void> {
        let hasInfo = !TestUtilities.isNullOrEmpty(additionalInfo);
        console.log("");        
        this.info(hasInfo ? "...Starting method [" + methodName + "] " + additionalInfo : "...Starting method [" + methodName + "]");
    }

    protected async methodEnd(methodName : string, additionalInfo : string = "") : Promise<void> {
        let hasInfo = !TestUtilities.isNullOrEmpty(additionalInfo);
        this.info(hasInfo ? "...Ending method [" + methodName + "] " + additionalInfo : "...Ending method [" + methodName + "]");
        console.log("");
    }

    //------------------------------------ WEB INTERACTIONS ------------------------------------

    protected async goToURL(url : string) : Promise<void> {
        this.info("Navigating to URL: " + url);
        await this.page.goto(url);        
    }

    protected async click(locator : string, elementDescription : string = "") : Promise<void> {
        test.info().annotations.push({ type : "Clicking '" +  elementDescription + "' element"}); //Prints into PLAYWRIGHT test reporter (but as annotation, not exactly on the corresponding step)
        await this.page.click(locator);
        await this.info("Clicked '" +  elementDescription + "' element"); //Prints just into IDE console
    }

    protected async enterText(locator : string, text : string, elementDescription : string = "") : Promise<void> {        
        test.info().annotations.push({ type : "Entering text into '" +  elementDescription + "' element", description : text }); //Prints into PLAYWRIGHT test reporter (but as annotation, not exactly on the corresponding step)
        await this.page.fill(locator, text);
        await this.info("Entered '" + text  + "' into '" +  elementDescription + "' element"); //Prints just into IDE console
    }

    protected async verifyElementExists(locator : string, elementDescription : string = "") : Promise<void> {
        await this.info("Verifying that '" + elementDescription + "' element exists (can be hidden)");
        expect(await this.page.locator(locator).count()).toBeGreaterThanOrEqual(1);
    }

    protected async verifyElementIsEnabled(locator : string, elementDescription : string = "") : Promise<void> {
        await this.info("Verifying that '" + elementDescription + "' element is enabled");
        expect(await this.page.locator(locator).isEnabled()).toBe(true);
    }

    protected async verifyElementIsVisible(locator : string, elementDescription : string = "") : Promise<void> {
        await this.info("Verifying that '" + elementDescription + "' element is visible");
        expect(await this.page.locator(locator).count()).toBeGreaterThanOrEqual(1);
        expect(await this.page.locator(locator).isVisible()).toBe(true);
    }

    protected async getCountFromList(locator : string) : Promise<number> {
        let allElements = await this.page.locator(locator);
        let count : number = await allElements.count();
        await this.info("List has " + count  + " elements");

        return count;
    }

    protected async listIsNotEmpty(locator : string) : Promise<boolean> {
        let count : number = await this.getCountFromList(locator);

        return count >= 1; //either true or false
    }

    //ToDo NOT IMPLEMENTED
    protected async listContainElementWithText(locator : string, wantedText : string, expectedCount : number |  undefined = undefined) : Promise<boolean> {
        let isTextFound = true;

        let count : number = await this.getCountFromList(locator);

        if(expectedCount !== undefined)
        {
            expect(count).toBe(expectedCount);
            await this.info("Count is the exact one wanted");
        }
        else
        {
            expect(count).toBeGreaterThan(1);
            await this.info("Count is greater than 1");
        }

        const elements = await this.page.locator(locator).allInnerTexts();

        elements.forEach(async innerText => {
            await this.info("innerText: " + innerText); // Output the visible text of each element
            if(innerText == wantedText)
            {
                isTextFound = true;
            }
        });

        return isTextFound;
    }

    protected async getElementText(locator : string, elementDescription : string = "") : Promise<string> {
        return await this.page.locator(locator).innerText();    
    }

    protected async printElementText(locator : string, elementDescription : string = "") : Promise<void> {
        let innerText = await this.page.locator(locator).innerText();

        if(elementDescription.length >= 1)
        {
            await this.info("Text from '" + elementDescription + "' element is: " + innerText);
        }
        else 
        {
            await this.info("Element text is: " + innerText);
        }        
    }

    protected async printDynamicElementText(locatorWithKey : string, keyValue : string, elementDescription : string = "") : Promise<void> {
        let finalLocator = TestUtilities.replaceKey(locatorWithKey, keyValue);
        let innerText = await this.page.locator(finalLocator).innerText();

        if(elementDescription.length >= 1)
        {
            await this.info("Text from '" + elementDescription + "' element is: " + innerText);
        }
        else 
        {
            await this.info("Element text is: " + innerText);
        }        
    }

    protected async selectDropdownOptionByValue(ddlLocator : string, valueStr : string, elementDescription : string = "") : Promise<void> {        
        await this.verifyElementIsVisible(ddlLocator, "Dropdown " + ddlLocator);
        await this.page.locator(ddlLocator).selectOption({ value: valueStr });
        var selectedValue = await this.page.locator(ddlLocator).inputValue();
        expect(selectedValue).toBe(valueStr);
        this.info("Selected by value: " + valueStr);
    }

    protected async selectDropdownOptionByLabel(ddlLocator : string, labelStr : string, elementDescription : string = "") : Promise<void> {
        await this.page.locator(ddlLocator).selectOption({ label: labelStr });
        this.info("Selected by label: " + labelStr);
    }

    protected async selectDropdownOptionByIndex(ddlLocator : string, indexInt : number, elementDescription : string = "") : Promise<void> {
        await this.page.locator(ddlLocator).selectOption({ index : indexInt });
        this.info("Selected by index: " + indexInt);
    }

    protected async verifyListIsSorted(locatorForList: string, orderByOptionSelected: SortingOptions, printListContents: boolean = false): Promise<void> {
        let allTexts: string[] = await this.page.locator(locatorForList).allInnerTexts();
        expect(allTexts.length).toBeGreaterThanOrEqual(2);

        if (printListContents) {
            this.info("All texts from list below:");
            allTexts.forEach(text => this.info(text));
        }

        switch (orderByOptionSelected) {
            case SortingOptions.AlphabeticAsc:
            case SortingOptions.AlphabeticDesc:
                for (let index = 0; index < allTexts.length - 1; index++) {
                    let itemBefore: string = allTexts[index];
                    let itemAfter: string = allTexts[index + 1];

                    orderByOptionSelected == SortingOptions.AlphabeticAsc
                        ? CustomAsserts.assertTextLessThanOrEqual(itemBefore, itemAfter)
                        : CustomAsserts.assertTextGreaterThanOrEqual(itemBefore, itemAfter);
                }
                break;
            case SortingOptions.NumericAsc:
            case SortingOptions.NumericDesc:
                for (let index = 0; index < allTexts.length - 1; index++) {
                    let itemBefore: number = TestUtilities.convertStringToDoubleNumber(allTexts[index]);
                    let itemAfter: number = TestUtilities.convertStringToDoubleNumber(allTexts[index + 1]);

                    orderByOptionSelected == SortingOptions.NumericAsc
                        ? CustomAsserts.assertNumberLessThanOrEqual(itemBefore, itemAfter)
                        : CustomAsserts.assertNumberGreaterThanOrEqual(itemBefore, itemAfter);
                }
                break;
        }
    }

    protected async verifyElementIsNotVisible(elementLocator : string, elementDescription : string, timeoutMs : number= 5000) : Promise<void>{  
        const isDetached = await this.isDetachedState(elementLocator, elementDescription, timeoutMs);
        const isHidden = await this.isHiddenState(elementLocator, elementDescription, timeoutMs);
        const isVisible = await this.isVisibleState(elementLocator, elementDescription, timeoutMs);
        CustomAsserts.assertTrue(isDetached || isHidden || !isVisible, "'" + elementLocator + "' Element should be detached or hidden");
    }

    protected async isDetachedState(elementLocator : string, elementDescription : string, timeoutMs : number= 5000) : Promise<boolean>{  
        let isDetached = false;

        try {
            await this.page.locator(elementLocator).waitFor({ state: 'detached', timeout: timeoutMs });
            isDetached = true;
            TestUtilities.logToConsole("Element is detached: " + elementDescription);
        } 
        catch {
            isDetached = false;
            TestUtilities.logToConsole("Element is NOT detached: " + elementDescription);
        }

        return isDetached;
    }

    protected async isHiddenState(elementLocator : string, elementDescription : string, timeoutMs : number= 5000) : Promise<boolean>{  
        let isHidden = false;

        try {
            await this.page.locator(elementLocator).waitFor({ state: 'hidden', timeout: timeoutMs });
            isHidden = true;
            TestUtilities.logToConsole("Element is hidden: " + elementDescription);
        } 
        catch {
            isHidden = false;
            TestUtilities.logToConsole("Element is NOT hidden: " + elementDescription);
        }

        return isHidden;
    }

    protected async isVisibleState(elementLocator : string, elementDescription : string, timeoutMs : number= 5000) : Promise<boolean>{  
        let isVisible = false;

        try {
            await this.page.locator(elementLocator).waitFor({ state: 'visible', timeout: timeoutMs });
            isVisible = true;
            TestUtilities.logToConsole("Element is visible: " + elementDescription);
        } 
        catch {
            isVisible = false;
            TestUtilities.logToConsole("Element is NOT visible: " + elementDescription);
        }

        return isVisible;
    }
}
