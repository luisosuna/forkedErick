import { test } from '@playwright/test';
import { CustomAsserts } from '../asserts/customAsserts';
import { MapsApi } from '../pom/api/mapsApi';
import { MapsAbilities } from '../pom/abilities/mapsAbilities';
import { TestUtilities } from '../utilities/testUtilities';
import { BodyPostCreateNewPlace } from '../pom/api/models/serialize/bodyPostCreateNewPlace';
import { BodyPutUpdateExistingPlace } from '../pom/api/models/serialize/bodyPutUpdateExistingPlace';

var mapsApi: MapsApi;
var mapsAbilities: MapsAbilities;

test.beforeAll(() => {
  // Initialize required instances with environment-specific settings
  mapsApi = new MapsApi();
  mapsAbilities = new MapsAbilities();
});

test.afterAll(() => {
  // Close connection ONLY ONCE
  mapsApi.closeConnection();
});

test('Get Known Place Info', async () => {
  TestUtilities.logToConsole("This is my first API test with Playwright");
  await mapsApi.getLocationInfo(mapsAbilities.KnownPlaceKey, mapsAbilities.KnownPlaceId);

  CustomAsserts.assertStringNotNullNorEmpty(mapsApi.responseJson, "Response JSON should not be null, nor empty");
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID get");
});

test('Get Fake Place Info', async () => {
  await mapsApi.getLocationInfo(mapsAbilities.KnownPlaceKey, "2151251251252151");

  CustomAsserts.assertStringNotNullNorEmpty(mapsApi.responseJson, "Response JSON should not be null or empty");
  CustomAsserts.assertEquals(404, mapsApi.statusCode, "Status code when NOT EXISTING place id");
});

test('Post New Place with Info', async () => {
  await mapsApi.postNewLocation(mapsAbilities.KnownPlaceKey, BodyPostCreateNewPlace.createSample());

  CustomAsserts.assertStringNotNullNorEmpty(mapsApi.responseJson, "Response JSON should not be null, nor empty");
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID post");
});

test('Put Update Existing Place with new address', async () => {
  let body : BodyPutUpdateExistingPlace = 
  {
    "place_id": mapsAbilities.KnownPlaceId,
    "address": "Put New Address " + TestUtilities.getCurrentFormattedTimestampYYMMDDhhmmss(" int "),
    "key": mapsAbilities.KnownPlaceKey
  };

  await mapsApi.putUpdateExistingLocation(body);

  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID put");
});

test('Put Update Existing Place with new address, then Get and validate changes', async () => {
  /// .................................... STEP 1 - GET call before doing anything ....................................

  await mapsApi.getLocationInfo(mapsAbilities.KnownPlaceKey, mapsAbilities.KnownPlaceId);
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID get (step 1)");

  let addressBefore: string = mapsApi.deserializedResponseGet.address;

  /// .................................... STEP 2 - PUT call to update address ....................................

  let newAddress: string = "Put New Address " + TestUtilities.getCurrentFormattedTimestampYYMMDDhhmmss(" int ");

  let body : BodyPutUpdateExistingPlace = 
  {
    "place_id": mapsAbilities.KnownPlaceId,
    "address": newAddress,
    "key": mapsAbilities.KnownPlaceKey
  };

  await mapsApi.putUpdateExistingLocation(body);
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID put (step 2)");

  /// .................................... STEP 3 - GET call after changing address ....................................

  await mapsApi.getLocationInfo(mapsAbilities.KnownPlaceKey, mapsAbilities.KnownPlaceId);
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID get (step 3)");

  let addressAfter: string = mapsApi.deserializedResponseGet.address;

  CustomAsserts.assertEquals(newAddress, addressAfter, "Address after PUT should be the same as the one we sent in PUT");
  CustomAsserts.assertNotEquals(addressBefore, addressAfter, "Address before PUT should be different from the one we sent in PUT");
});

test('Post, then Get, then Put with new address, then Get and validate changes', async () => {

  /// .................................... STEP 1 - POST call create new place ....................................
  let bodyPost : BodyPostCreateNewPlace = BodyPostCreateNewPlace.createSample();
  let originalAddress: string = bodyPost.address;
  let originalName: string = bodyPost.name;

  // Do REST API call and store the generated place id
  let generatedPlaceId: string = await mapsApi.postNewLocation(mapsAbilities.KnownPlaceKey, bodyPost);  
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID post (step 1)");

  /// .................................... STEP 2 - GET call before changing address ....................................

  await mapsApi.getLocationInfo(mapsAbilities.KnownPlaceKey, generatedPlaceId);
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID get (step 2)");
  CustomAsserts.assertEquals(originalAddress, mapsApi.deserializedResponseGet.address, "Address should be the same as the one we sent in POST");
  CustomAsserts.assertEquals(originalName, mapsApi.deserializedResponseGet.name, "Name should be the same as the one we sent in POST");

  /// .................................... STEP 3 - PUT call to update address ....................................

  let newAddress: string = "Put New Address " + TestUtilities.getCurrentFormattedTimestampYYMMDDhhmmss(" int ");

  let bodyPut : BodyPutUpdateExistingPlace = 
  {
    "place_id": generatedPlaceId,
    "address": newAddress,
    "key": mapsAbilities.KnownPlaceKey
  };

  await mapsApi.putUpdateExistingLocation(bodyPut);
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID put (step 3)");

  /// .................................... STEP 4 - GET call after changing address ....................................

  await mapsApi.getLocationInfo(mapsAbilities.KnownPlaceKey, generatedPlaceId);
  CustomAsserts.assertEquals(200, mapsApi.statusCode, "Status code when VALID get (step 4)");

  let addressAfter: string = mapsApi.deserializedResponseGet.address;

  CustomAsserts.assertEquals(originalName, mapsApi.deserializedResponseGet.name, "Name should be the same as the one we sent in POST");
  CustomAsserts.assertEquals(newAddress, addressAfter, "Address after PUT should be the same as the one we sent in PUT");
  CustomAsserts.assertNotEquals(originalAddress, addressAfter, "Address before PUT should be different from the one we sent in PUT");
});
