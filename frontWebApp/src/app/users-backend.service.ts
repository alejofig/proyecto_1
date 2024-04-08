import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersBackendService {

  private apiUrl = environment.users_url;

  constructor(private http: HttpClient) { }

  register_user(user_data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user_data);
  }

}
