import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AlimentacionService {

  private apiUrl: string = environment.tercerosUrl;

  constructor(private http: HttpClient) {
  }

  solicitarAlimentacion(alimentacion: any): Observable<any> {
    let postAlimentacion = this.apiUrl + '/solicitar_alimentacion';
    return this.http.post<any>(postAlimentacion, alimentacion, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
  }
}
