import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderInicioComponent } from '../../shared/components/header-inicio/header-inicio.component';
import { AuthButtonComponent } from '../auth-button/auth-button.component';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLinkWithHref, FooterComponent, HeaderInicioComponent,AuthButtonComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}
