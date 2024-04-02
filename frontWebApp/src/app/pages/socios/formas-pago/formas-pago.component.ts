import { Component } from '@angular/core';
import { HeaderSociosComponent } from '../../../shared/components/header-socios/header-socios.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-formas-pago',
  standalone: true,
  imports: [HeaderSociosComponent, FooterComponent],
  templateUrl: './formas-pago.component.html',
  styleUrl: './formas-pago.component.scss'
})
export class FormasPagoComponent {

}
