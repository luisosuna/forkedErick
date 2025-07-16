import { HttpMethods } from "../../enums/httpMethods.ts";
import { TestUtilities } from "../../../utilities/testUtilities.ts";
import { CustomAsserts } from "../../../asserts/customAsserts.ts";
import { request, APIRequestContext, APIResponse } from '@playwright/test';
import { z } from "zod";
import chalk from 'chalk';

export abstract class BaseApiInteractions {

    private readonly CLOSE_CONNECTION : boolean = false; //close after each call, or close ONCE at the end of all tests using hooks    

    // These 4 are NOT exposed
    protected requestContext: APIRequestContext;
    protected responseObject: APIResponse;
    protected bearerToken: string = ""; // Used for storing Bearer token if needed
    protected defaultHeaders: Record<string, string>;
    protected deserializingSchema?: z.ZodType<any, z.ZodTypeDef, any>;    

    // We want these 2 exposed in case we want to use them directly in tests
    public statusCode : number;
    public responseJson : any;

    constructor() {
    }
    
    private async init() : Promise<void> {
        if(this.requestContext) {
            //Do nothing, already defined/instanced
        }  
        else {
            this.requestContext = await request.newContext();
        }      
    }

    private async closeConnectionInternally(fromWhere : HttpMethods) : Promise<void> {
        if(this.CLOSE_CONNECTION) {
            this.info("Closing connection from HTTP call: " + fromWhere);
            await this.closeConnection();
        }        
    }

    public async closeConnection() : Promise<void> {
        try {
            if(this.requestContext) {
                await this.requestContext.dispose();
            }
        }
        catch (error) {
            this.error("Error while closing connection: " + error);
        }
    }

    protected async assignReturnValues() : Promise<void>{
        this.statusCode = await this.responseObject.status();
        this.responseJson = await this.responseObject.json();
    }

    protected info(message : string) : void {
        TestUtilities.logToConsole(message);
    }

    protected error(errorMessage : string) : void {
        TestUtilities.logErrorToConsole(errorMessage);
    }

    protected newEmptyLine() : void {
        console.log("");
    }

    protected printResponseDetails() : void {
        this.info("Response status: " + this.statusCode);
        this.info("Response body: " + JSON.stringify(this.responseJson));
    }

    private printRequestURL(url : string, method : HttpMethods) : void {
        this.newEmptyLine();
        this.info(chalk.bgCyan(`Executing '${method}' REST request with URL:`));
        console.log(chalk.bgCyan(url));
        this.newEmptyLine();
    } 

    protected async executeGetRequest(url: string, headers?: Record<string, string>): Promise<void> {
        this.printRequestURL(url, HttpMethods.GET);

        this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.get(url, { headers });

        await this.assignReturnValues();
        await this.closeConnectionInternally(HttpMethods.GET);
    }

    protected async executePostRequest(url: string, body: any, headers?: Record<string, string>): Promise<void> {
        this.printRequestURL(url, HttpMethods.POST);
        this.info("POST Body: " + JSON.stringify(body));

        this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.post(url, { 
            headers,
            data: JSON.stringify(body) 
        });

        await this.assignReturnValues();
        await this.closeConnectionInternally(HttpMethods.POST);
    }

    protected async executePostRequestFormURLEncoded(url: string, paramsInPairs: any, headers?: Record<string, string>): Promise<void> {
        this.printRequestURL(url, HttpMethods.POST);

        this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.post(url, { 
            headers,
            form: paramsInPairs
        });

        await this.assignReturnValues();
        await this.closeConnectionInternally(HttpMethods.POST);
    }

    protected async executePutRequest(url: string, body: any, headers?: Record<string, string>): Promise<void> {
        this.printRequestURL(url, HttpMethods.PUT);
        this.info("PUT Body: " + JSON.stringify(body));

        this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.put(url, { 
            headers,
            data: body 
        });

        await this.assignReturnValues();
        await this.closeConnectionInternally(HttpMethods.PUT);
    }

    protected async executePatchRequest(url: string, body: any, headers?: Record<string, string>): Promise<void> {
        this.printRequestURL(url, HttpMethods.PATCH);
        this.info("PATCH Body: " + JSON.stringify(body));

        this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.patch(url, { 
            headers,
            data: body 
        });

        await this.assignReturnValues();
        await this.closeConnectionInternally(HttpMethods.PATCH);
    }

    protected async executeDeleteRequest(url: string, headers?: Record<string, string>): Promise<void> {
        this.printRequestURL(url, HttpMethods.DELETE);

        this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.delete(url, { headers });;

        await this.assignReturnValues();
        await this.closeConnectionInternally(HttpMethods.DELETE);
    }

    protected deserializeResponseWithoutSchema<T>(): T { // Way #1 - without schema checking (SIMPLER)
        this.info("Standardly deserializing response to the specified Class model.");
        const responseBody = this.responseJson;
        return responseBody as T;
    }

    protected deserializeResponse<T>(): T { // Way #2 - with schema checking (SAFER & MORE COMPLEX)
        return this.deserializeResponseWithExplicitSchema<T>(this.deserializingSchema as z.ZodType<T, z.ZodTypeDef, any>);
    }

    protected deserializeResponseWithExplicitSchema<T>(schema?: z.ZodSchema<T>): T { // Way #2 - with schema checking (SAFER & MORE COMPLEX)
        this.info("Safely deserializing response to the specified Zod Schema.");

        if (!schema) {
            throw new Error("Schema is required for safe deserialization.");
        }

        try {
            const result = schema.safeParse(this.responseJson);
            CustomAsserts.assertTruthy(result.success, "Response JSON should be valid according to schema");

            let parsedObject = result.data;
            return parsedObject as T;
        } 
        catch (error) {
            this.info("Failed to safely deserialize response: " + error);
            throw error;
        }        
    }

    private printHeaders(headers?: Record<string, string>): void {
        if (headers && Object.keys(headers).length > 0) {
            this.info("Headers:");
            for (const [key, value] of Object.entries(headers)) {
                this.info(`  ${key}: ${value}`);
            }
        } else {
            this.info("No additional headers provided.");
        }
    }
}