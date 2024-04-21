import { Component, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';
import { AuthService } from '@auth0/auth0-angular';
import { ApiGatewayBackendService } from '../../../apigateway-backend.service';
import { CommonModule } from '@angular/common';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';

@Component({
  selector: 'app-sidebard',
  standalone: true,
  imports: [RouterLinkWithHref, LengSelectorComponent, CommonModule, LogoutButtonComponent],
  templateUrl: './sidebard.component.html',
  styleUrl: './sidebard.component.scss'
})
export class SidebardComponent implements OnInit {
  userData: any;

  constructor(public auth: AuthService, private apiService: ApiGatewayBackendService) { }

  ngOnInit(): void {
    const cachedUserData = sessionStorage.getItem('userData');
    if (cachedUserData) {
      this.userData = JSON.parse(cachedUserData);
    } else {
      this.getUserData();
    }
  }

  getUserData(): void {
    this.apiService.callApiAndGetCompleteUser().subscribe(
      (result) => {
        console.log('User data:', result);
        this.userData = result;
        sessionStorage.setItem('userData', JSON.stringify(result)); // Guardamos los datos en el almacenamiento de sesión
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );
  }
}
