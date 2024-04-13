import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanEntrenamiento } from "./plan-entrenamiento";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlanEntrenamientoService {

  private apiUrl: string = 'http://0.0.0.0:3002' //environment.backendUrl;

  constructor(private http: HttpClient) {
  }

  generarPlanEntrenamiento(planEntrenamiento: any): Observable<any> {
    let postPlanEntrenamiento = this.apiUrl + '/generate';
    return this.http.post<any>(postPlanEntrenamiento, planEntrenamiento, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
