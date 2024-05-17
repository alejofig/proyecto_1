import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';
import { AuthService } from '@auth0/auth0-angular';
import { ApiGatewayBackendService } from '../../../apigateway-backend.service';
import { CommonModule } from '@angular/common';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebard',
  standalone: true,
  imports: [RouterLinkWithHref, LengSelectorComponent,CommonModule,LogoutButtonComponent, TranslateModule],
  templateUrl: './sidebard.component.html',
  styleUrls: ['./sidebard.component.scss']
})
export class SidebardComponent implements OnInit, OnDestroy {
  userData: any;
  authSubscription: Subscription | undefined;

  constructor(public auth: AuthService, private apiService: ApiGatewayBackendService) { }

  ngOnInit(): void {
    this.authSubscription = this.auth.user$.subscribe((user) => {
      if (user) {
        this.getUserData();
      } else {
        this.clearUserData();
      }
    });

    this.loadUserData();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getUserData(): void {
    this.apiService.callApiAndGetCompleteUser().subscribe(
      (result) => {
        console.log('User data:', result);
        this.userData = result;
        this.saveUserDataToCache(result);
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );
  }

  saveUserDataToCache(data: any): void {
    localStorage.setItem('userData', JSON.stringify(data));
  }

  loadUserData(): void {
    const cachedUserData = localStorage.getItem('userData');
    if (cachedUserData) {
      this.userData = JSON.parse(cachedUserData);
    } else {
      this.getUserData();
    }
  }

  clearUserData(): void {
    this.userData = null;
    localStorage.removeItem('userData');
  }
}
