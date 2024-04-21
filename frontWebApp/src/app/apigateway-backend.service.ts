import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap, catchError } from 'rxjs/operators';

interface MessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiGatewayBackendService {

  private apiUrl = environment.apigateway_url;

  constructor(private http: HttpClient, private auth: AuthService) { }

  private callApiWithToken(url: string): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any>(url, { headers });
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  callApiAndGetCompleteUser(): Observable<any> {
    return this.callApiWithToken(`${this.apiUrl}/get_complete_user/`);
  }

  callApiAndGetStatics(): Observable<any> {
    return this.callApiWithToken(`${this.apiUrl}/obtener_estadisticas/`);
  }

  registrarUsuario(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar_usuario`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
