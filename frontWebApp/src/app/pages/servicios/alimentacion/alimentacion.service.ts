import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AlimentacionService {

  private apiUrl: string = environment.localTerceros;

  constructor(private http: HttpClient) {
  }

  crear_servicio_alimentacion(alimentacion: any): Observable<any> {
    let postAlimentacion = this.apiUrl + '/crear_servicio_alimentacion';
    return this.http.post<any>(postAlimentacion, alimentacion, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
  }
}
