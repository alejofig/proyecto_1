import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import { AuthService } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenerarPlanEntreService {

  private apiUrl: string = environment.planesUrl;

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  generarPlanEntrenamiento(planEntrenamiento: any): Observable<any> {
    let postPlanEntrenamiento = this.apiUrl + '/api/web/plan';
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<any>(postPlanEntrenamiento, planEntrenamiento, { headers });
      })
    );
  }
}
