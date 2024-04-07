import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PlanEntrenamiento} from "./plan-entrenamiento";

@Injectable({
  providedIn: 'root'
})
export class PlanEntrenamientoService {

  private apiUrl: string = 'http://localhost:4200/generar_plan_entrenamiento';

  constructor(private http: HttpClient) {
  }

  generarPlanEntrenamiento(planEntrenamiento: PlanEntrenamiento): Observable<PlanEntrenamiento> {
    let postPlanEntrenamiento = this.apiUrl + 'planEntrenamiento';
    return this.http.post<PlanEntrenamiento>(postPlanEntrenamiento, planEntrenamiento);
  }
}
