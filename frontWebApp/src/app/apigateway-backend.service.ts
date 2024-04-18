import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiGatewayBackendService {

  private apiUrl = environment.apigateway_url;

  constructor(private http: HttpClient) {
  }


  registrar_usuario(user_data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar_usuario`, user_data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
