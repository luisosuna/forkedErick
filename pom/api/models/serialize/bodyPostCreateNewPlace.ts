import { TestUtilities } from '../../../../utilities/testUtilities';
import {BodyPostCreateNewPlaceLocation} from './bodyPostCreateNewPlaceLocation';

export class BodyPostCreateNewPlace {
    public location: BodyPostCreateNewPlaceLocation;
    public accuracy: number;
    public name: string;
    public phone_number: string;
    public address: string;
    public types: string[];
    public website: string;
    public language: string;

    public static createSample(): BodyPostCreateNewPlace {
        const sample = new BodyPostCreateNewPlace();
        sample.location = {
            lat: 20.7565972669,
            lng: -103.40019389712755
        };
        sample.accuracy = 2;
        sample.name = "Nice Restaurant";
        sample.phone_number = "(52) 55 3312 3456";
        sample.address = "Valdepeñas " + TestUtilities.getCurrentFormattedTimestampYYMMDDhhmmss(" int "),
        sample.types = ["coffe", "restaurant", "bar"];
        sample.website = "https://nicerestaurant.com";
        sample.language = "United States-EN";
        return sample;
    }
}