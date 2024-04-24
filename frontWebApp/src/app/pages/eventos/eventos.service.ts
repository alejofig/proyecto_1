import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from 'rxjs';
import {PlanEntrenamientoUser, SesionesEntrenador} from './eventos-interfaces';


@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private http = inject(HttpClient)
  private eventosUrl: string = environment.eventos_urls;
  private entrenamietoUrl: String = environment.planesUrl;
  private entrenadorUrl: String = environment.tercerosUrl;


  constructor() {
  }

  getEvents() {
    return this.http.get(this.eventosUrl + '/eventos');
  }

  getEntrenamientos(): Observable<PlanEntrenamientoUser[]> {
    return this.http.get<PlanEntrenamientoUser[]>(this.entrenamietoUrl + '/planes');
  }

  getSesionesEntrenador(): Observable<SesionesEntrenador[]> {
    return this.http.get<SesionesEntrenador[]>(this.entrenadorUrl + '/sesiones_entrenador');
  }
}
