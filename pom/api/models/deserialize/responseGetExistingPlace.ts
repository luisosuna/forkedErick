import { ResponseGetExistingPlaceInnerLocation } from "./responseGetExistingPlaceInnerLocation";

export class ResponseGetExistingPlace{
    
    public location: ResponseGetExistingPlaceInnerLocation;
    public accuracy: string;
    public name: string;
    public phone_number: string;
    public address: string;
    public types: string;
    public website: string;
    public language: string;
}