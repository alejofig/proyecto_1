import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ApiGatewayBackendService } from '../../apigateway-backend.service';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { UserStatics } from './UserStatics';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent, CommonModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private apiUrl = environment.apigateway_url;
  userStatics: any = '';
  finalUser: any;
  profilePictureSrc: string = '';
  authSubscription: Subscription | undefined;
  userCheckSubscription: Subscription | undefined;
  loading: boolean = false;
  readonly updateInterval = 60000;

  constructor(private apiService: ApiGatewayBackendService, public auth: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.auth.user$.subscribe((user) => {
      if (user) {
        this.profilePictureSrc = user.picture || "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
        this.loadUserData();
        this.getUserStatics();
        this.startUserCheckInterval();
      } else {
        this.clearUserData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userCheckSubscription) {
      this.userCheckSubscription.unsubscribe();
    }
  }

  getUser(): void {
    this.loading = true;
    this.apiService.callApiAndGetCompleteUser().subscribe(
      (result) => {
        console.log('User data:', result);
        this.finalUser = result;
        this.saveUserDataToCache(result);
        this.loading = false;
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
        this.loading = false;
      }
    );
  }

  getUserStatics(): void {
    this.loading = true;
    this.apiService.callApiAndGetStatics().subscribe(
      (result) => {
        this.userStatics = result;
        this.loading = false;
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
        this.loading = false;
      }
    );
  }

  vincularConStrava(): void {
    this.auth.user$.subscribe(user => {
      if (user?.email !== null && user?.email !== undefined) {
        window.location.href = `${this.apiUrl}/login_strava?email=${encodeURIComponent(user.email)}`;
        this.getUser();
      } else {
        alert('No se puede vincular con Strava porque el usuario no tiene email');
      }
    });
  }

  saveUserDataToCache(data: any): void {
    localStorage.setItem('finalUser', JSON.stringify(data));
  }

  loadUserData(): void {
    const cachedUserData = localStorage.getItem('finalUser');
    if (cachedUserData) {
      this.finalUser = JSON.parse(cachedUserData);
      this.profilePictureSrc = this.finalUser.picture || "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
    } else {
      this.getUser();
    }
  }

  clearUserData(): void {
    this.finalUser = null;
    localStorage.removeItem('finalUser');
    this.profilePictureSrc = "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
  }

  startUserCheckInterval(): void {
    this.userCheckSubscription = interval(this.updateInterval).pipe(
      switchMap(() => this.apiService.callApiAndGetCompleteUser())
    ).subscribe(
      (result) => {
        console.log('Periodic user data update:', result);
        this.finalUser = result;
        this.saveUserDataToCache(result);
      },
      (error) => {
        console.error('Error actualizando datos del usuario:', error);
      }
    );
  }
}
