import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private http = inject(HttpClient)
  private eventosUrl: string = environment.eventos_urls;
  private entrenamietoUrl: String = environment.entrenamientoUrl


  constructor() { }

  getEvents(){
    return this.http.get(this.eventosUrl + '/eventos');
  }

  getEntrenamientos(){
    return this.http.get(this.entrenamietoUrl + '/planes');
  }
}
