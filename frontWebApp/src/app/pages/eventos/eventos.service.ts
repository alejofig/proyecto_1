import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from 'rxjs';
import {PlanEntrenamientoUser, SesionesEntrenador} from './eventos-interfaces';
import {AuthService} from '@auth0/auth0-angular';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private http = inject(HttpClient)
  private eventosUrl: string = environment.eventos_urls;
  private entrenamietoUrl: String = environment.planesUrl;
  private entrenadorUrl: String = environment.tercerosUrl;
  private auth = inject(AuthService);


  constructor() {
  }

  getEvents(): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        console.log(token)
        const headers = {Authorization: `Bearer ${token}`};
        return this.http.get(this.eventosUrl + '/api/web/eventos', {headers});
      })
    );
  }

  getEntrenamientos(): Observable<PlanEntrenamientoUser[]> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        const headers = {Authorization: `Bearer ${token}`};
        return this.http.get<PlanEntrenamientoUser[]>(this.entrenamietoUrl + '/api/web/plan', {headers});
      })
    );
  }

  getSesionesEntrenador(): Observable<SesionesEntrenador[]> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        const headers = {Authorization: `Bearer ${token}`};
        return this.http.get<SesionesEntrenador[]>(this.entrenadorUrl + '/sesiones_entrenador', {headers});
      })
    );
  }
}
