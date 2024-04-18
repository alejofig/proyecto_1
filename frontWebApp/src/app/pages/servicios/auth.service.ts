
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface ManagementApiTokenResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  async checkIfEmailExists(email: string): Promise<boolean> {
    const token = await this.getManagementApiToken();
    if (!token) {
      console.error('El token de la API de gestión es undefined.');
      return false;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const url = `https://${environment.auth0Domain}api/v2/users-by-email?email=${email}`;
    try {
      const response: any = await this.http.get(url, { headers }).toPromise();
      if (Array.isArray(response)) {
        return response.length > 0;
      } else {
        console.error('La respuesta no es un array:', response);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar el correo electrónico:', error);
      return false;
    }
  }

  async getManagementApiToken(): Promise<string | undefined> {
    const url = `https://${environment.auth0Domain}oauth/token`;
    const body = {
      turbo: 'false',
      client_id: environment.auth0ClientId,
      client_secret: environment.auth0ClientSecret,
      audience: environment.auth0ApiIdentifier,
      grant_type: 'client_credentials'
    };
    try {
      const response: any = await this.http.post<ManagementApiTokenResponse>(url, body).toPromise();
      if (response) {
        return response.access_token;
      } else {
        console.error('La respuesta es undefined.');
        return undefined;
      }
        } catch (error) {
      console.error('Error al obtener el token de la Management API:', error);
      return undefined;
        }
      }
}
