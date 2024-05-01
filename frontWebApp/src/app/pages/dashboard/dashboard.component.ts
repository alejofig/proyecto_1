import { Component, Input } from '@angular/core';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ApiGatewayBackendService } from '../../apigateway-backend.service';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { UserStatics } from './UserStatics';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent,CommonModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private apiUrl = environment.apigateway_url;
  userStatics: any='';
  public user: any = this.auth.user$;
  profilePictureSrc: string = this.user.picture || "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
  finalUser: any;
  constructor(private apiService: ApiGatewayBackendService, public auth: AuthService) { }
  ngOnInit(): void {
    const cachedUserStatics = sessionStorage.getItem('userStatics');
    if (cachedUserStatics) {
      this.userStatics = JSON.parse(cachedUserStatics);
    } else {
      this.getUserStatics();
    }
    const cachedfinalUser = sessionStorage.getItem('finalUser');
    if (cachedfinalUser) {
      this.finalUser = JSON.parse(cachedfinalUser);
    } else {
      this.getUser();
    }
  }

  getUser(): void {
    this.apiService.callApiAndGetCompleteUser().subscribe(
      (result) => {
        console.log('Complete User:', result);
        this.finalUser = result;
        sessionStorage.setItem('finalUser', JSON.stringify(result)); // Guardamos los datos en el almacenamiento de sesión

      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );
  }

  getUserStatics(): void {
    this.apiService.callApiAndGetStatics().subscribe(
      (result) => {
        console.log('User Statics:', result);
        this.userStatics = result;
        sessionStorage.setItem('userStatics', JSON.stringify(result)); // Guardamos los datos en el almacenamiento de sesión
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );
  }

  vincularConStrava(): void {
    this.auth.user$.subscribe( user=> {
      if (user?.email !== null && user?.email !== undefined) {
        window.location.href = `${this.apiUrl}/login_strava?email=${encodeURIComponent(user.email)}`;
      }
      else{
        alert('No se puede vincular con Strava porque el usuario no tiene email');
      }
    });
  }

}
