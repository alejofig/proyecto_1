import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { HeaderInicioComponent } from '../../shared/components/header-inicio/header-inicio.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [RouterLinkWithHref, HeaderInicioComponent, FooterComponent],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss'
})
export class InicioSesionComponent {

}
