import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EntrenadorService {

  private apiUrl: string = environment.tercerosUrl;

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
