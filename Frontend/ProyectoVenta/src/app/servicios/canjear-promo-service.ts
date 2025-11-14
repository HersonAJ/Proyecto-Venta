import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestConstants } from '../rest-constants';
import { AuthService } from './auth-service';

export interface CanjearPromocionRequest {
  usuarioId: number;
  cantidad: number;
}

export interface CanjearPromocionResponse {
  success: boolean;
  message: string;
  promocionesRestantes: number;
  nombreUsuario?: string;
  cantidadCanjeada?: number;
}

export interface ConsultarPromocionesRequest {
  usuarioId: number;
}

export interface ConsultarPromocionesResponse {
  success: boolean;
  nombre?: string;
  email?: string;
  promocionesPendientes?: number;
  promocionesCanjeadas?: number;
  promocionActual?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CanjearPromoService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private restConstants: RestConstants,
    private authService: AuthService
  ) {
    this.apiUrl = this.restConstants.getApiURL() + 'trabajador/';
  }

  canjearPromocion(usuarioId: number, cantidad: number = 1): Observable<CanjearPromocionResponse> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body: CanjearPromocionRequest = {
      usuarioId: usuarioId,
      cantidad: cantidad
    };

    return this.http.post<CanjearPromocionResponse>(
      `${this.apiUrl}promociones/canjear`,
      body,
      { headers }
    );
  }

  consultarPromocionesUsuario(usuarioId: number): Observable<ConsultarPromocionesResponse> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ConsultarPromocionesResponse>(
      `${this.apiUrl}promociones/consultar/${usuarioId}`,
      { headers }
    );
  }

  // Método de conveniencia para canjear 1 promoción
  canjearUnaPromocion(usuarioId: number): Observable<CanjearPromocionResponse> {
    return this.canjearPromocion(usuarioId, 1);
  }
}