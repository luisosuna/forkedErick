import { expect } from "@playwright/test";
import { TestUtilities } from "../utilities/testUtilities";
import chalk from 'chalk';

export class CustomAsserts {
    private static info(message: string): void {
        let timestamp: string = TestUtilities.getCurrentFormattedTimestamp();
        console.log(chalk.bgGreenBright(timestamp + ": " + message));
    }

    private static throwError(originAssertMethodName: string, exception: Error, userMessage: string, assertionMessage: string = ""): void {
        let timestamp: string = TestUtilities.getCurrentFormattedTimestamp();
        console.error(timestamp + ": Assert FAILED! " + originAssertMethodName);
        console.error("Native error type: " + exception.constructor.name);
        console.error("Native error message: " + exception.message);
        console.error("User message: " + userMessage);

        if (!TestUtilities.isNullOrEmpty(assertionMessage)) {
            console.error(chalk.bgRedBright("Assertion message: " + assertionMessage));
        }

        throw exception;
    }

    //----------------------------------------- BASE ASSERTS -----------------------------------------

    public static assertFail(message: string): void {
        let error : Error = new Error("Test case FAILED! " + message);
        this.throwError("assertFail", error, message, "Test case should not fail.");
    }

    //----------------------------------------- BOUNDARY TESTING -----------------------------------------

    public static assertNumberGreaterThanOrEqual(valueBigger: number, valueSmaller: number, message: string = ""): void {
        try {
            expect(valueBigger).toBeGreaterThanOrEqual(valueSmaller);
            this.info("Assert PASSED! [" + valueBigger + "] is greater or equal to [" + valueSmaller + "] " + message);
        } catch (error) {
            this.throwError("assertNumberGreaterThanOrEqual", error, message, "[" + valueBigger + "] should be greater or equal to [" + valueSmaller + "]");
        }
    }

    public static assertNumberLessThanOrEqual(valueSmaller: number, valueBigger: number, message: string = ""): void {
        try {
            expect(valueSmaller).toBeLessThanOrEqual(valueBigger);
            this.info("Assert PASSED! [" + valueSmaller + "] is less or equal to [" + valueBigger + "] " + message);
        } catch (error) {
            this.throwError("assertNumberLessThanOrEqual", error, message, "[" + valueSmaller + "] should be less or equal to [" + valueBigger + "]");
        }
    }

    public static assertTextGreaterThanOrEqual(stringZ: string, stringA: string, message: string = ""): void {
        try {
            expect(stringA.localeCompare(stringZ) <= 0).toBe(true); // Number is negative when LEFT comes BEFORE RIGHT (L=Apple, R=Orange)
            this.info("Assert PASSED! [" + stringZ + "] is greater or equal to [" + stringA + "] " + message);
        } catch (error) {
            this.throwError("assertTextGreaterThanOrEqual", error, message, "[" + stringZ + "] should be greater or equal to [" + stringA + "]");
        }
    }

    public static assertTextLessThanOrEqual(stringA: string, stringZ: string, message: string = ""): void {
        try {
            expect(stringA.localeCompare(stringZ) <= 0).toBe(true); // Number is negative when LEFT comes BEFORE RIGHT (L=Apple, R=Orange)
            this.info("Assert PASSED! [" + stringA + "] is less or equal to [" + stringZ + "] " + message);
        } catch (error) {
            this.throwError("assertTextLessThanOrEqual", error, message, "[" + stringA + "] should be less or equal to [" + stringZ + "]");
        }
    }

    //----------------------------------------- BINARY TESTING -----------------------------------------

    public static assertTrue(condition: boolean, message: string): void {
        try {
            expect(condition).toBe(true);
            this.info("Assert PASSED! Condition is true: " + message);
        } catch (error) {
            this.throwError("assertTrue", error, message, "Condition should be true.");
        }
    }

    public static assertFalse(condition: boolean, message: string): void {
        try {
            expect(condition).toBe(false);
            this.info("Assert PASSED! Condition is false: " + message);
        } catch (error) {
            this.throwError("assertFalse", error, message, "Condition should be false.");
        }
    }

    //----------------------------------------- CONTAINS TESTING -----------------------------------------

    public static assertStringContains(outerString: string, innerString: string, message: string): void {
        try {
            expect(outerString.includes(innerString)).toBe(true);
            this.info("Assert PASSED! [" + innerString + "] is contained within [" + outerString + "] " + message);
        } catch (error) {
            this.throwError("assertStringContains", error, message, "[" + innerString + "] should be contained within [" + outerString + "]");
        }
    }

    public static assertStringDoesNotContain(outerString: string, innerString: string, message: string): void {
        try {
            expect(outerString.includes(innerString)).toBe(false);
            this.info("Assert PASSED! [" + innerString + "] is not contained within [" + outerString + "] " + message);
        } catch (error) {
            this.throwError("assertStringDoesNotContain", error, message, "[" + innerString + "] should NOT be contained within [" + outerString + "]");
        }
    }

    //----------------------------------------- EQUALITY TESTING -----------------------------------------

    public static assertEquals(expectedValue: number | string, actualValue: number | string, message: string = ""): void {
        try {
            expect(actualValue).toBe(expectedValue);
            this.info("Assert PASSED! [" + expectedValue + "] is equal to [" + actualValue + "] " + message);
        } catch (error) {
            this.throwError("assertEquals", error, message, "[" + actualValue + "] should be equal to [" + expectedValue + "]");
        }
    }

    public static assertNotEquals(value1: number | string, value2: number | string, message: string = ""): void {
        try {
            expect(value2).not.toBe(value1);
            this.info("Assert PASSED! [" + value1 + "] is not equal to [" + value2 + "] " + message);
        } catch (error) {
            this.throwError("assertNotEquals", error, message, "[" + value1 + "] should NOT be equal to [" + value2 + "]");
        }
    }

    public static assertObjectsEqual(expectedObject: object, actualObject: object, message: string = ""): void {
        try {
            expect(actualObject).toEqual(expectedObject);
            this.info("Assert PASSED! Objects are equal: " + message);
        } catch (error) {
            this.throwError("assertObjectsEqual", error, message, "Objects should be equal.");
        }
    }

    public static assertObjectsNotEqual(object1: object, object2: object, message: string = ""): void {
        try {
            expect(object1).not.toEqual(object2);
            this.info("Assert PASSED! Objects are not equal: " + message);
        } catch (error) {
            this.throwError("assertObjectsNotEqual", error, message, "Objects should NOT be equal.");
        }
    }

    //----------------------------------------- NULLNESS TESTING -----------------------------------------

    public static assertStringNullOrEmpty(text: string, message: string = ""): void {
        try {
            expect(TestUtilities.isNullOrEmpty(text)).toBe(true);
            this.info("Assert PASSED! String is null or empty: " + message);
        } catch (error) {
            this.throwError("assertStringNullOrEmpty", error, message, "String should be null or empty.");
        }
    }

    public static assertStringNotNullNorEmpty(text: string, message: string = ""): void {
        try {
            expect(TestUtilities.isNullOrEmpty(text)).toBe(false);
            this.info("Assert PASSED! String is not null or empty: " + message);
        } catch (error) {
            this.throwError("assertStringNotNullNorEmpty", error, message, "String should NOT be null or empty.");
        }
    }

    public static assertObjectNull(object: Object, message: string = ""): void {
        try {
            expect(object).toBeNull();
            this.info("Assert PASSED! Object is null: " + message);
        } catch (error) {
            this.throwError("assertObjectNull", error, message, "Object should be null.");
        }
    }

    public static assertObjectNotNull(object: Object, message: string = ""): void {
        try {
            expect(object).not.toBeNull();
            this.info("Assert PASSED! Object is not null: " + message);
        } catch (error) {
            this.throwError("assertObjectNotNull", error, message, "Object should NOT be null.");
        }
    }

    //----------------------------------------- OTHER TESTING -----------------------------------------

    public static assertTruthy(result: any, message: string): void {
        try {
            //Ensures that value is true in a boolean context, anything but false, 0, '', null, undefined or NaN. Use this method when you don't care about the specific value.
            expect(result).toBeTruthy();
            this.info("Assert PASSED! Result is truthy: " + message);
        } catch (error) {
            this.throwError("assertTruthy", error, message, "Result should be truthy.");
        }
    }
}