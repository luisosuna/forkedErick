import { TestUtilities } from "../../../utilities/testUtilities";
import { BaseApiInteractions } from "../parent/baseApiInteractions";
import { MapsAbilities } from "../../abilities/mapsAbilities";
import { BodyPostCreateNewPlace } from "../models/serialize/bodyPostCreateNewPlace"
import { BodyPutUpdateExistingPlace } from "../models/serialize/bodyPutUpdateExistingPlace";
import { ResponsePostCreateNewPlace } from "../models/deserialize/responsePostCreateNewPlace";
import { ResponseGetExistingPlace } from "../models/deserialize/responseGetExistingPlace";
import { ResponseGenericMsg } from "../models/deserialize/responseGenericMsg";
import { CustomAsserts } from "../../../asserts/customAsserts";
import { z } from "zod";

export class MapsApi extends BaseApiInteractions{

    private mapsAbilities : MapsAbilities;    
    private readonly ADD_HEADER_KEEP_CONNECTION : boolean = false; //false by default here (When using Postman default is true)

    // Response objects
    public deserializedResponsePost : ResponsePostCreateNewPlace;
    public deserializedResponseGet : ResponseGetExistingPlace;
    public deserializedResponseGenericMessage : ResponseGenericMsg;

    // Return string
    public generatedPlaceId : string = "";
    
    constructor() {
        super();
        this.mapsAbilities = new MapsAbilities();

        if(this.ADD_HEADER_KEEP_CONNECTION) {
            this.defaultHeaders = {
                "Connection": "keep-alive"
            };
        }
    }

    public async getLocationInfo(placeKey : string, placeId : string) : Promise<void> {

        // Build URI with parameters
        let uri : string = TestUtilities.replaceKeyName(this.mapsAbilities.URLGetLocationInfo, "key", placeKey);
        uri = TestUtilities.replaceKeyName(uri, "placeId", placeId);
        
        await this.executeGetRequest(uri, this.defaultHeaders);
        await this.printResponseDetails();

        // Declare Schema for later deserialization (DEPENDS ON THE STATUS CODE)
        switch (this.statusCode) {
            case 200:
                this.deserializingSchema = z.object({
                    location: z.object({
                      latitude: z.string(),
                      longitude: z.string()
                    }),
                    accuracy: z.string(),
                    name: z.string(),
                    phone_number: z.string(),
                    address: z.string(),
                    types: z.string(), // Comma-separated list — you could transform this if needed
                    website: z.string().url(),
                    language: z.string()
                });
        
                // Deserialize with Schema declared above
                this.deserializedResponseGet = this.deserializeResponse<ResponseGetExistingPlace>();
        
                CustomAsserts.assertObjectNotNull(this.deserializedResponseGet, "Deserialized Object (from response JSON) should not be null");
                this.info("Location name: " + this.deserializedResponseGet.name);
                this.info("Location addresss: " + this.deserializedResponseGet.address);
                break;

            case 404:
                this.deserializingSchema = z.object({
                    msg: z.string()
                });
        
                // Deserialize with Schema declared above
                this.deserializedResponseGenericMessage = this.deserializeResponse<ResponseGenericMsg>();
        
                CustomAsserts.assertObjectNotNull(this.deserializedResponseGenericMessage, "Deserialized Object (from response JSON) should not be null");
                CustomAsserts.assertEquals("Get operation failed, looks like place_id  doesn't exists", this.deserializedResponseGenericMessage.msg, "Error message should be as expected");
                break;

            default:
                CustomAsserts.assertFail("Unhandled status code: " + this.statusCode);
                break;
        }        
    }

    public async postNewLocation(placeKey : string, body : BodyPostCreateNewPlace) : Promise<string> {
        // Build URI with parameters
        let uri : string = TestUtilities.replaceKeyName(this.mapsAbilities.URLPostNewLocation, "key", placeKey);

        await this.executePostRequest(uri, body, this.defaultHeaders);
        await this.printResponseDetails();

        // Declare Schema for later deserialization
        this.deserializingSchema = z.object({
            status: z.string(),
            place_id: z.string(),
            scope: z.string(),
            reference: z.string(),
            id: z.string()
        });

        // Deserialize with Schema declared above
        this.deserializedResponsePost = this.deserializeResponse<ResponsePostCreateNewPlace>();

        CustomAsserts.assertObjectNotNull(this.deserializedResponsePost, "Deserialized Object (from response JSON) should not be null");

        // Assign generated place id to the class variable
        this.generatedPlaceId = this.deserializedResponsePost.place_id;

        this.info("New place id generated from POST call: " + this.generatedPlaceId);
        this.info("Scope: " + this.deserializedResponsePost.scope);
        return this.generatedPlaceId;
    }

    public async putUpdateExistingLocation(body : BodyPutUpdateExistingPlace) : Promise<void> {
        await this.executePutRequest(this.mapsAbilities.URLPutUpdateExistingLocation, body, this.defaultHeaders);
        await this.printResponseDetails();

        // Declare Schema for later deserialization
        this.deserializingSchema = z.object({
            msg: z.string()
        });

        // Deserialize with Schema declared above
        this.deserializedResponseGenericMessage = this.deserializeResponse<ResponseGenericMsg>();
                
        CustomAsserts.assertObjectNotNull(this.deserializedResponseGenericMessage, "Deserialized Object (from response JSON) should not be null");
        CustomAsserts.assertEquals("Address successfully updated", this.deserializedResponseGenericMessage.msg, "Success HTTP PUT message should be as expected");
    }
}
