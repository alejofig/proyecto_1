import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface MessageResponse {
  message: string;
}

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule,SidebardComponent,RouterLinkWithHref, TranslateModule],
  templateUrl: './panel.component.html',
  // template: `
  //   <h2>User Profile</h2>
  //   <ul *ngIf="auth.user$ | async as user">
  //     <li>{{ user.name }}</li>
  //     <li>{{ user.email }}</li>
  //   </ul>`,
  styleUrl: './panel.component.scss'

})
export class PanelComponent {
  public message: string = '';
  constructor(public auth: AuthService, private http: HttpClient, private translate: TranslateService) {
    // this.callApi();
  }

  // callApi(): void {
  //   this.auth.getAccessTokenSilently().subscribe((token) => {
  //     const headers = new HttpHeaders({
  //       'Authorization': `Bearer ${token}`
  //     });
  //     console.log(token)
  //     this.http
  //       .get<MessageResponse>(`http://127.0.0.1:3002/get_complete_user/`, { headers })
  //       .subscribe((result) => {
  //         console.log(result);
  //       });
  //   });
  // }

}
