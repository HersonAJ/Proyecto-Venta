import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class RestConstants {
    public readonly API_URL = 'http://localhost:8080/api/';

        // Para producción (descomentar cuando despliegue)
    // public readonly API_URL = 'https://tu-dominio.com/api/';
  
    public getApiURL(): string {
      return this.API_URL;
    }
}