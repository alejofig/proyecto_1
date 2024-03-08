import { Component } from '@angular/core';
import { HorizontalCardComponent } from '../../../shared/components/cards/horizontal-card/horizontal-card.component';
import { HeaderSociosComponent } from '../../../shared/components/header-socios/header-socios.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-estado-cuenta',
  standalone: true,
  imports: [HeaderSociosComponent, HorizontalCardComponent, FooterComponent],
  templateUrl: './estado-cuenta.component.html',
  styleUrl: './estado-cuenta.component.scss'
})
export class EstadoCuentaComponent {

}
