// Imports for all API services
import { MapsApi } from './servicesFamilies/mapsApi.ts';
import { DummyApi } from './servicesFamilies/dummyApi.ts';

// Imports for utilities and asserts
import { CustomAsserts } from '../../asserts/customAsserts';
import { TestUtilities } from '../../utilities/testUtilities.ts';

// Imports for models (Body/Payload or Response as JSON), if needed
import { BodyPostCreateNewPlace } from './models/serialize/bodyPostCreateNewPlace';
import { BodyPutUpdateExistingPlace } from './models/serialize/bodyPutUpdateExistingPlace';

// Imports for abilities, if needed
import { MapsAbilities } from '../abilities/mapsAbilities.ts';

export class Services {
    //Inside a 'class' file, object and class can be named the same (both in PascalCase)
    public MapsApi: MapsApi;
    public DummyApi: DummyApi;

    private MapsAbilities: MapsAbilities = new MapsAbilities();

    constructor() {
        this.MapsApi = new MapsApi();
        this.DummyApi = new DummyApi();
    }

    public async closeConnections() : Promise<void> {
        await this.MapsApi.closeConnection();
        await this.DummyApi.closeConnection();
    }    

    // ************************************************ 'MAPS' Service ************************************************

    public async maps_Get_PlaceLocationInfo() {
        TestUtilities.logToConsole("This is my first API test with Playwright");
        await this.MapsApi.getLocationInfo(this.MapsAbilities.KnownPlaceKey, this.MapsAbilities.KnownPlaceId);

        CustomAsserts.assertStringNotNullNorEmpty(this.MapsApi.responseJson, "Response JSON should not be null, nor empty");
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID get");
    }

    public async maps_Get_PlaceLocationInfo_404() {
        await this.MapsApi.getLocationInfo(this.MapsAbilities.KnownPlaceKey, "2151251251252151");

        CustomAsserts.assertStringNotNullNorEmpty(this.MapsApi.responseJson, "Response JSON should not be null or empty");
        CustomAsserts.assertEquals(404, this.MapsApi.statusCode, "Status code when NOT EXISTING place id");
    }

    public async maps_Post_NewLocation() {
        await this.MapsApi.postNewLocation(this.MapsAbilities.KnownPlaceKey, BodyPostCreateNewPlace.createSample());

        CustomAsserts.assertStringNotNullNorEmpty(this.MapsApi.responseJson, "Response JSON should not be null, nor empty");
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID post");
    }

    public async maps_Put_UpdateLocation() {
        let body : BodyPutUpdateExistingPlace = 
        {
            "place_id": this.MapsAbilities.KnownPlaceId,
            "address": "Put New Address " + TestUtilities.getCurrentFormattedTimestampYYMMDDhhmmss(" int "),
            "key": this.MapsAbilities.KnownPlaceKey
        };

        await this.MapsApi.putUpdateExistingLocation(body);

        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID put");
    }

    public async maps_GetPutGet_UpdateOnlyOnce() {
        /// .................................... STEP 1 - GET call before doing anything ....................................

        await this.MapsApi.getLocationInfo(this.MapsAbilities.KnownPlaceKey, this.MapsAbilities.KnownPlaceId);
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID get (step 1)");

        let addressBefore: string = this.MapsApi.deserializedResponseGet.address;

        /// .................................... STEP 2 - PUT call to update address ....................................

        let newAddress: string = "Put New Address " + TestUtilities.getCurrentFormattedTimestampYYMMDDhhmmss(" int ");

        let body : BodyPutUpdateExistingPlace = 
        {
            "place_id": this.MapsAbilities.KnownPlaceId,
            "address": newAddress,
            "key": this.MapsAbilities.KnownPlaceKey
        };

        await this.MapsApi.putUpdateExistingLocation(body);
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID put (step 2)");

        /// .................................... STEP 3 - GET call after changing address ....................................

        await this.MapsApi.getLocationInfo(this.MapsAbilities.KnownPlaceKey, this.MapsAbilities.KnownPlaceId);
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID get (step 3)");

        let addressAfter: string = this.MapsApi.deserializedResponseGet.address;

        CustomAsserts.assertEquals(newAddress, addressAfter, "Address after PUT should be the same as the one we sent in PUT");
        CustomAsserts.assertNotEquals(addressBefore, addressAfter, "Address before PUT should be different from the one we sent in PUT");
    }

    public async maps_PostGetPutGet_E2EFlow() {
        /// .................................... STEP 1 - POST call create new place ....................................
        let bodyPost : BodyPostCreateNewPlace = BodyPostCreateNewPlace.createSample();
        let originalAddress: string = bodyPost.address;
        let originalName: string = bodyPost.name;

        // Do REST API call and store the generated place id
        let generatedPlaceId: string = await this.MapsApi.postNewLocation(this.MapsAbilities.KnownPlaceKey, bodyPost);  
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID post (step 1)");

        /// .................................... STEP 2 - GET call before changing address ....................................

        await this.MapsApi.getLocationInfo(this.MapsAbilities.KnownPlaceKey, generatedPlaceId);
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID get (step 2)");
        CustomAsserts.assertEquals(originalAddress, this.MapsApi.deserializedResponseGet.address, "Address should be the same as the one we sent in POST");
        CustomAsserts.assertEquals(originalName, this.MapsApi.deserializedResponseGet.name, "Name should be the same as the one we sent in POST");

        /// .................................... STEP 3 - PUT call to update address ....................................

        let newAddress: string = "Put New Address " + TestUtilities.getCurrentFormattedTimestampYYMMDDhhmmss(" int ");

        let bodyPut : BodyPutUpdateExistingPlace = 
        {
        "place_id": generatedPlaceId,
        "address": newAddress,
        "key": this.MapsAbilities.KnownPlaceKey
        };

        await this.MapsApi.putUpdateExistingLocation(bodyPut);
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID put (step 3)");

        /// .................................... STEP 4 - GET call after changing address ....................................

        await this.MapsApi.getLocationInfo(this.MapsAbilities.KnownPlaceKey, generatedPlaceId);
        CustomAsserts.assertEquals(200, this.MapsApi.statusCode, "Status code when VALID get (step 4)");

        let addressAfter: string = this.MapsApi.deserializedResponseGet.address;

        CustomAsserts.assertEquals(originalName, this.MapsApi.deserializedResponseGet.name, "Name should be the same as the one we sent in POST");
        CustomAsserts.assertEquals(newAddress, addressAfter, "Address after PUT should be the same as the one we sent in PUT");
        CustomAsserts.assertNotEquals(originalAddress, addressAfter, "Address before PUT should be different from the one we sent in PUT");

        console.log("Successfully Finished inside 'Services'");
    }

    // ************************************************ 'DUMMY' Service ************************************************


}