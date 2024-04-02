import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { HeaderInicioComponent } from '../../shared/components/header-inicio/header-inicio.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLinkWithHref, HeaderInicioComponent, FooterComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

}
