import { test } from '@playwright/test';
import { CustomAsserts } from '../asserts/customAsserts';
import { DummyApi } from '../pom/api/dummyApi';

var dummyApi: DummyApi;

//Run them sequentially to avoid timeout errors
test.describe.serial('Sequential Dummy API Tests', () => {
  
  test.beforeAll(() => {
    // Initialize required instances ONLY ONCE
    dummyApi = new DummyApi();
  });
  
  test.afterAll(() => {
    // Close connection ONLY ONCE
    dummyApi.closeConnection();
  });

  test('Dummy get to test query params & headers MULTIPLE', async () => {
    let params : Record<string, string> = {
      "limit" : "2",
      "page" : "1",
    };

    let headers : Record<string, string> = {
      "User-Agent" : "PostmanRuntime/7.43.3",
      "Connection" : "keep-alive"
    };

    await dummyApi.getDummy(params, headers);
    CustomAsserts.assertEquals(200, dummyApi.statusCode, "Status code assertion");
  });

  test('Dummy get to test query params & headers SINGLE', async () => {
    let params : Record<string, string> = {
      "limit" : "2"
    };

    let headers : Record<string, string> = {
      "User-Agent" : "PostmanRuntime/7.43.3"
    };

    await dummyApi.getDummy(params, headers);
    CustomAsserts.assertEquals(200, dummyApi.statusCode, "Status code assertion");
  });

  test('Dummy get WITHOUT headers', async () => {
    let params : Record<string, string> = {
      "limit" : "2"
    };

    await dummyApi.getDummy(params);
    CustomAsserts.assertEquals(200, dummyApi.statusCode, "Status code assertion");
  });
});
