import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RestConstants {
    public readonly API_URL = environment.API_URL;
    
    public getApiURL(): string {
      return this.API_URL;
    }
}