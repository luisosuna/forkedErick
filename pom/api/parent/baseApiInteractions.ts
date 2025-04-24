import { TestUtilities } from "../../../utilities/testUtilities";
import { CustomAsserts } from "../../../asserts/customAsserts";
import { request, APIRequestContext, APIResponse } from '@playwright/test';
import { z } from "zod";

export abstract class BaseApiInteractions {

    private readonly CLOSE_CONNECTION : boolean = false; //close after each call, or close ONCE at the end of all tests using hooks    

    protected requestContext: APIRequestContext;
    protected responseObject: APIResponse;
    protected deserializingSchema: z.ZodObject<any>;

    public statusCode : number;
    public responseJson : any;

    constructor() {
        this.init();
    }
    
    protected async init() {
        if(this.requestContext) {
            //Do nothing, already defined/instanced
        }  
        else {
            this.requestContext = await request.newContext();
        }      
    }

    protected async closeConnectionInternally(fromWhere : string) {
        if(this.CLOSE_CONNECTION) {
            this.info("Closing connection from: " + fromWhere);
            await this.closeConnection();
        }        
    }

    public async closeConnection() {
        try {
            if(this.requestContext) {
                await this.requestContext.dispose();
            }
        }
        catch (error) {
            this.info("Error while closing connection: " + error);
        }
    }

    protected async assignReturnValues() {
        this.statusCode = this.responseObject.status();
        this.responseJson = await this.responseObject.json();
    }

    protected async info(message : string) : Promise<void> {
        TestUtilities.logToConsole(message);
    }

    protected async printResponseDetails() : Promise<void> {
        this.info("Response status: " + this.statusCode);
        this.info("Response body: " + JSON.stringify(this.responseJson));
    }

    protected async executeGetRequest(url: string, headers?: Record<string, string>): Promise<void> {
        this.info("GET URL: " + url);

        await this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.get(url, { headers });

        await this.assignReturnValues();
        await this.closeConnectionInternally("GET");
    }

    protected async executePostRequest(url: string, body: any, headers?: Record<string, string>): Promise<void> {
        this.info("POST URL: " + url);
        this.info("POST Body: " + JSON.stringify(body));

        await this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.post(url, { 
            headers,
            data: JSON.stringify(body) 
        });

        await this.assignReturnValues();
        await this.closeConnectionInternally("POST");
    }

    protected async executePutRequest(url: string, body: any, headers?: Record<string, string>): Promise<void> {
        this.info("PUT URL: " + url);
        this.info("PUT Body: " + JSON.stringify(body));

        await this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.put(url, { 
            headers,
            data: body 
        });

        await this.assignReturnValues();
        await this.closeConnectionInternally("PUT");
    }

    protected async executeDeleteRequest(url: string, headers?: Record<string, string>): Promise<void> {
        this.info("DELETE URL: " + url);

        await this.printHeaders(headers);

        await this.init();
        this.responseObject = await this.requestContext.delete(url, { headers });;

        await this.assignReturnValues();
        await this.closeConnectionInternally("DELETE");
    }

    protected async deserializeResponseWithoutErrorChecking<T>(): Promise<T> {
        this.info("Standardly deserializing response to the specified type.");
        const responseBody = this.responseJson;
        return responseBody as T;
    }

    //protected async deserializeResponse<T>(schema?: z.ZodSchema<T>): Promise<T> {
    protected async deserializeResponse<T>(): Promise<T> {
        this.info("Safely deserializing response to the specified type.");

        var localSchema = this.deserializingSchema;

        if (!localSchema) {
            throw new Error("Schema is required for safe deserialization.");
        }

        try {
            const result = localSchema.safeParse(this.responseJson);
            CustomAsserts.assertTruthy(result.success, "Response JSON should be valid according to schema");

            let parsedObject = result.data;
            return parsedObject as T;
        } 
        catch (error) {
            this.info("Failed to safely deserialize response: " + error);
            throw error;
        }        
    }

    private async printHeaders(headers?: Record<string, string>): Promise<void> {
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