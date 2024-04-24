import { Component, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';
import { AuthService } from '@auth0/auth0-angular';
import { ApiGatewayBackendService } from '../../../apigateway-backend.service';
import { CommonModule } from '@angular/common';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebard',
  standalone: true,
  imports: [RouterLinkWithHref, LengSelectorComponent,CommonModule,LogoutButtonComponent, TranslateModule],
  templateUrl: './sidebard.component.html',
  styleUrl: './sidebard.component.scss'
})
export class SidebardComponent implements OnInit {
  userData: any;

  constructor(public auth: AuthService, private apiService: ApiGatewayBackendService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.apiService.callApiAndGetCompleteUser().subscribe(
      (result) => {
        console.log('User data:', result);
        this.userData = result;
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );
  }
}
