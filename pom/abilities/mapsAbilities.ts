export class MapsAbilities {
    //URLs
    public BaseURL : string = "https://rahulshettyacademy.com/maps/api/place/";
    public URLGetLocationInfo = this.BaseURL + "get/json?key={{key}}&place_id={{placeId}}";
    public URLPostNewLocation = this.BaseURL + "add/json?key={{key}}";
    public URLPutUpdateExistingLocation = this.BaseURL + "update/json";

    //Other values
    public KnownPlaceId : string = "f360892225d5d091e4b043b63e391f54";
    public KnownPlaceKey : string = "qaclick123";
}