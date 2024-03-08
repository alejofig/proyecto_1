import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLinkWithHref, FooterComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}
