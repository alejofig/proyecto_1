import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {environment} from "../../../environments/environment";
import { Observable } from 'rxjs';
import { PlanEntrenamientoUser } from './eventos-interfaces';


@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private http = inject(HttpClient)
  private eventosUrl: string = environment.eventos_urls;
  private entrenamietoUrl: String = environment.planesUrl


  constructor() { }

  getEvents(){
    return this.http.get(this.eventosUrl + '/eventos');
  }

  getEntrenamientos(): Observable<PlanEntrenamientoUser[]>{
    return this.http.get<PlanEntrenamientoUser[]>(this.entrenamietoUrl + '/planes');
  }
}
