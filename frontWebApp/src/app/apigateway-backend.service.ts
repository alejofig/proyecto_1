import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../environments/environment';
import {AuthService} from '@auth0/auth0-angular';
import {catchError, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiGatewayBackendService {

  private apiUrl = environment.apigateway_url;
  private token = '';

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  private callApiWithToken(url: string, method: string, data?: any): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        this.token = token;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        let request$: Observable<any>;

        switch (method.toUpperCase()) {
          case 'GET':
            request$ = this.http.get<any>(url, {headers});
            break;
          case 'POST':
            request$ = this.http.post<any>(url, data, {headers});
            break;
          default:
            throw new Error('Unsupported HTTP method');
        }

        return request$;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  callApiAndGetCompleteUser(): Observable<any> {
    return this.callApiWithToken(`${this.apiUrl}/get_complete_user/`, 'GET');
  }

  callApiAndGetStatics(): Observable<any> {
    return this.callApiWithToken(`${this.apiUrl}/obtener_estadisticas/`, 'GET');
  }

  registrarUsuario(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar_usuario`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  registrarMototaller(motoTallerData: any): Observable<any> {
    return this.callApiWithToken(`${this.apiUrl}/crear_servicio_mototaller/`, 'POST', motoTallerData);
  }

  crear_servicio_alimentacion(alimentacionData: any): Observable<any> {
    return this.callApiWithToken(`${this.apiUrl}/crear_servicio_alimentacion/`, 'POST', alimentacionData);
  }

  solicitarSesionEntrenador(entrenadorData: any): Observable<any> {
    return this.callApiWithToken(`${this.apiUrl}/solicitar_sesion_entrenador/`, 'POST', entrenadorData);
  }
}
