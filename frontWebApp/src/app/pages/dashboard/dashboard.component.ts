import { Component, Input } from '@angular/core';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ApiGatewayBackendService } from '../../apigateway-backend.service';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { UserStatics } from './UserStatics';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  userStatics: any='';
  public user: any = this.auth.user$;
  profilePictureSrc: string = this.user.picture || "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
  constructor(private apiService: ApiGatewayBackendService, public auth: AuthService) { }
  ngOnInit(): void {
    const cachedUserStatics = sessionStorage.getItem('userStatics');
    if (cachedUserStatics) {
      this.userStatics = JSON.parse(cachedUserStatics);
    } else {
      this.getUserStatics();
    }
    console.log(this.userStatics)
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

}
