import { CustomAsserts } from "../../asserts/customAsserts";
import { TestUtilities } from "../../utilities/testUtilities";
import { BaseApiInteractions } from "./parent/baseApiInteractions";

export class DummyApi extends BaseApiInteractions{

    // See documentation in https://fakestoreapi.com/
    public async getDummy(queryParams: Record<string, string>, headers?: Record<string, string>): Promise<void> {

        // Build URI with parameters
        let queryParamsString: string = TestUtilities.getQueryParamsAsString(queryParams);
        let uri: string = "https://fakestoreapi.com/products" + queryParamsString;

        this.info("Query params: " + queryParamsString);
        this.info("Complete URI: " + uri);

        // Pass an empty object if headers are not provided
        await this.executeGetRequest(uri, headers || {});
    }    
}
