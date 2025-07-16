import { test } from '@playwright/test';
import { Services } from '../pom/api/services.ts';

//Inside a 'test' file, object and class can NOT be named the same (object in camelCase, class in PascalCase)
let services: Services;

test.beforeAll(() => {
  // Initialize required instances with environment-specific settings
  services = new Services();
});

test.afterAll(() => {
  // Close connection ONLY ONCE
  services.closeConnections();
});

test.skip('Get Happy', async () => {
  await services.maps_Get_PlaceLocationInfo();
})

test.skip('Get Negative', async () => {
  await services.maps_Get_PlaceLocationInfo_404();
})

test.skip('Post New Location', async () => {
  await services.maps_Post_NewLocation();
})

test.skip('Put Update Existing Location', async () => {
  await services.maps_Put_UpdateLocation();
})

test.skip('Get Put and Get Same Location', async () => {
  await services.maps_GetPutGet_UpdateOnlyOnce();
})

test('E2E Flow Maps: POST, GET, PUT, GET', async () => {
  await services.maps_PostGetPutGet_E2EFlow();
})
