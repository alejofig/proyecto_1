import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlanEntrenamientoService {

  private apiUrl: string = environment.local;

  constructor(private http: HttpClient) {
  }

  generarPlanEntrenamiento(planEntrenamiento: any): Observable<any> {
    let postPlanEntrenamiento = this.apiUrl + '/plan';
    return this.http.post<any>(postPlanEntrenamiento, planEntrenamiento, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
