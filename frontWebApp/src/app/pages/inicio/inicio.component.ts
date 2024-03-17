import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderInicioComponent } from '../../shared/components/header-inicio/header-inicio.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLinkWithHref, FooterComponent, HeaderInicioComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}
