import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RestConstants } from '../rest-constants'; 

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  userRole?: string;
  userName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private restConstants: RestConstants
  ) {
    this.apiUrl = this.restConstants.getApiURL() + 'auth/';
  }

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login`, loginData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            const errorResponse: LoginResponse = {
              success: false,
              message: 'Correo o contraseña incorrecta',
              token: ''
            };
            return throwError(() => errorResponse);
          } else {
            const errorResponse: LoginResponse = {
              success: false,
              message: 'Error del servidor',
              token: ''
            };
            return throwError(() => errorResponse);
          }
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}