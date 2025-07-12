import { expect } from '@playwright/test';
import { CustomAsserts } from '../asserts/customAsserts.ts';
import chalk from 'chalk';

    /*
    Key Rules of Overloading in TypeScript:
    You must declare multiple method signatures before writing the actual method implementation.

    The actual implementation must be a single function that handles all cases.

    You cannot have multiple actual method implementations like in Java/C#.

    Overloading with Different Parameter Types
    typescript
    Copy
    Edit
    class MathUtil {
        public add(a: number, b: number): number;
        public add(a: string, b: string): string;

        public add(a: number | string, b: number | string): number | string {
            if (typeof a === "number" && typeof b === "number") {
                return a + b;
            } else if (typeof a === "string" && typeof b === "string") {
                return a + b;
            }
            throw new Error("Invalid arguments");
        }
    }

    const math = new MathUtil();
    console.log(math.add(5, 10)); // 15
    console.log(math.add("Hello, ", "World!")); // "Hello, World!"
    */

export class TestUtilities {

    public static logToConsole(message : string) : void {
        let timestamp : string = TestUtilities.getCurrentFormattedTimestamp();
        console.log(chalk.bgWhite(timestamp + ": " + message));
    }

    public static logToConsoleYellow(message : string) : void {
        let timestamp : string = TestUtilities.getCurrentFormattedTimestamp();
        console.log(chalk.bgYellowBright(timestamp + ": " + message));
    }

    public static isNullOrEmpty(text : string | undefined) {
        if(text == undefined || text.length == 0 || text == "")
            return true;
        else
            return false;
    }

    public static getPrettyJSON(jsonAsObject : any) : string {
        let semiPrettyJson : string = JSON.stringify(jsonAsObject, null, 2);
        return semiPrettyJson;
    }

    static replaceKeyName(text : string, keyName : string, keyValue : string) : string {
        let charLeft : string = "{{";
        let charRight : string = "}}";
        let key : string = charLeft + keyName + charRight;
        let val1 : boolean = text.includes(charLeft);
        let val2 : boolean = text.includes(charRight);
        let val3 : boolean = text.includes(key);
        let allesGut : boolean = val1 && val2 && val3;

        expect(allesGut).toBe(true);

        return text.replace(key, keyValue);
    }

    static replaceKey(text : string, keyValue : string) : string {
        let charLeft : string = "{{";
        let charRight : string = "}}";
        let key : string = "{{key}}";
        let val1 : boolean = text.includes(charLeft);
        let val2 : boolean = text.includes(charRight);
        let val3 : boolean = text.includes(key);
        let allesGut : boolean = val1 && val2 && val3;

        expect(allesGut).toBe(true);

        return text.replace(key, keyValue);
    }

    static stringToBoolean(booleanAsString : string) : boolean {
        // Check if the string is 'true' (case insensitive)
        if (booleanAsString.toLowerCase() === 'true') {
            return true;
        }
        // Check if the string is 'false' (case insensitive)
        else if (booleanAsString.toLowerCase() === 'false') {
            return false;
        }
        // For any other string, return false
        else {
            return false;
        }
    }

    /*
    Declare as extension method
    String.prototype.startsWithUpperCase = function() {
        return /^[A-Z]/.test(this);
    };
    */

    /*
    String.prototype.replaceKeyExt = function(url: string, keyName: string, keyValue: string) {
        const charLeft = "{";
        const charRight = "}";
        const key = charLeft + keyName + charRight;
    
        if (!(url.includes(charLeft) && url.includes(charRight) && url.includes(key))) {
            throw new Error("URL does not contain the necessary placeholders.");
        }
    
        return url.replace(key, keyValue);
    }*/

    static numberToCurrency(numberToFormat : number) : string {
        let formattedCurrency: string = "";
        formattedCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numberToFormat);
        return formattedCurrency;
    }

    static getCurrentFormattedDate() : string {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = this.padZero(currentDate.getMonth() + 1); // Months are zero-based
        const day = this.padZero(currentDate.getDate());
      
        return `${year}/${month}/${day}`;
    }

    public static getCurrentFormattedTimestamp() : string {
        let currentDate : Date;
        currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = this.padZero(currentDate.getMonth() + 1); // Months are zero-based
        const day = this.padZero(currentDate.getDate());
        const hours = this.padZero(currentDate.getHours());
        const minutes = this.padZero(currentDate.getMinutes());
        const seconds = this.padZero(currentDate.getSeconds());
        const milliseconds = currentDate.getMilliseconds().toFixed();
      
        return `${year}/${month}/${day} @ ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    public static getCurrentFormattedTimestampYYYYMMDDhhmmss(separatorChar : string = "") : string {
        let currentDate : Date;
        currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = this.padZero(currentDate.getMonth() + 1); // Months are zero-based
        const day = this.padZero(currentDate.getDate());
        const hours = this.padZero(currentDate.getHours());
        const minutes = this.padZero(currentDate.getMinutes());
        const seconds = this.padZero(currentDate.getSeconds());
              
        return `${year}${month}${day}${separatorChar}${hours}${minutes}${seconds}`;
    }

    public static getCurrentFormattedTimestampYYMMDDhhmmss(separatorChar : string = "") : string {
        let currentDate : Date;
        currentDate = new Date();
        const yearLast2 = currentDate.getFullYear().toString().slice(-2); // Get last two digits of the year
        const month = this.padZero(currentDate.getMonth() + 1); // Months are zero-based
        const day = this.padZero(currentDate.getDate());
        const hours = this.padZero(currentDate.getHours());
        const minutes = this.padZero(currentDate.getMinutes());
        const seconds = this.padZero(currentDate.getSeconds());
              
        return `${yearLast2}${month}${day}${separatorChar}${hours}${minutes}${seconds}`;
    }

    public static printCurrentFormattedTimestamp() : void {
        this.logToConsole("Current timestamp: " + TestUtilities.getCurrentFormattedTimestamp());
    }
      
    static padZero(value: number) : string {
        return value.toString().padStart(2, '0');
    }

    public static getMonthName(date : Date) {
        return date.toLocaleString('en-US', { month: 'long' });
    }

    public static printDateInfo(date : Date) : void {
        this.logToConsole("Full date is: " + date);

        let dayOfWeek : number = date.getDay();
        let day : number = date.getDate();
        let month : number = date.getMonth() + 1; //Month is 0-11, add +1 to make it 1-12
        let year : number = date.getFullYear();

        this.logToConsole("   Weekday: " + dayOfWeek);
        this.logToConsole("   Day: " + day);
        this.logToConsole("   Month: " + month);
        this.logToConsole("   Year: " + year);
        this.logToConsole("   Month name: " + TestUtilities.getMonthName(date));
    }

    /*
    You can handle both currency symbols and commas by modifying the .replace() logic. Here’s the improved version:

    Using parseFloat() (Recommended)
        const priceStr = "$49,999.99";
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, "").replace(/,/g, ""));
        this.logToConsole(price); // Output: 49999.99

    Alternative Using Regex match()
        const priceStr = "$49,999.99";
        const price = parseFloat(priceStr.replace(/,/g, "").match(/\d+(\.\d+)?/)![0]);
        this.logToConsole(price); // Output: 49999.99

    Explanation
        .replace(/[^0-9.,]/g, "") → Removes everything except numbers, . and ,
        .replace(/,/g, "") → Removes commas (for numbers like "49,999.99")
        parseFloat() → Converts the cleaned string to a number
    */
    public static convertStringToDoubleNumber(text : string) : number {
        return parseFloat(text.replace(/[^0-9.]/g, "").replace(/,/g, ""));
    }

    public static getQueryParamsAsString(queryParams: Record<string, string>): string {
        return "?" + Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    public static getNumericValue(str : string, shouldBeNumeric = true) : number {
        const num = parseFloat(str);
        let isNan = isNaN(num);

        if(shouldBeNumeric) CustomAsserts.assertFalse(isNan, "String should be a valid number: " + str);

        if(isNan) {
            CustomAsserts.assertFail("isNan: " + str)
        }

        return num;
    }

    public static getTextBefore(fullText, marker) {
        const index = fullText.indexOf(marker);
        if (index === -1) return fullText; // If marker not found, return full text
        return fullText.substring(0, index);
    }

    public static getTextAfter(fullText, marker) {
        if (typeof fullText !== 'string' || typeof marker !== 'string') return '';
    
        const index = fullText.indexOf(marker);
        if (index === -1) return ''; // marker not found

        return fullText.substring(index + marker.length);
    }

    public static getTextBetween(fullText, startText, endText, limitsShouldExist = true) {
        const startIndex = fullText.indexOf(startText);
        const endIndex = fullText.indexOf(endText, startIndex + startText.length);

        TestUtilities.logToConsole("Getting text between '" + startText + "' (left) and '" + endText + "' (right) from string: " + fullText);

        if(limitsShouldExist) {
            CustomAsserts.assertFalse(startIndex === -1 || endIndex === -1, "Both limits (LEFT & RIGHT) should be present in text: " + fullText);
        }

        if (startIndex === -1 || endIndex === -1) {
            return null; // or throw an error, or return empty string
        }

        return fullText.substring(startIndex + startText.length, endIndex);
    }
}