import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

interface MessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiGatewayBackendService {

  private apiUrl = environment.apigateway_url;

  constructor(private http: HttpClient, private auth: AuthService) { }

  callApiAndGetCompleteUser(): Observable<any> {
    return new Observable(observer => {
      this.auth.getAccessTokenSilently().subscribe((token) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        this.http
          .get<MessageResponse>(`${this.apiUrl}/get_complete_user/`, { headers })
          .subscribe((result) => {
            console.log("Resultado",result);
            observer.next(result);
            observer.complete();
          }, (error) => {
            observer.error(error);
          });
      });
    });
  }

  registrarUsuario(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar_usuario`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
