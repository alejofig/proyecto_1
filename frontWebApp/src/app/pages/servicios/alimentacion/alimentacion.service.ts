import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlimentacionService {

  private apiUrl: string = 'http://0.0.0.0:3002';

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
