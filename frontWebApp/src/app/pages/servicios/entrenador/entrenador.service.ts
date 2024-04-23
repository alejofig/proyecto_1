import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntrenadorService {

  private apiUrl: string = 'http://0.0.0.0:3002';

  constructor(private http: HttpClient) {
  }

  solicitarSesionEntrenador(entrenador: any): Observable<any> {
    let postEntrenador = this.apiUrl + '/solicitar_sesion_entrenador';
    return this.http.post<any>(postEntrenador, entrenador, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
  }
}
