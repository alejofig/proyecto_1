import { Component } from '@angular/core';
import { SidebardComponent } from '../../../shared/components/sidebard/sidebard.component';
import { HorizontalCardComponent } from '../../../shared/components/cards/horizontal-card/horizontal-card.component';
import { HeaderSociosComponent } from '../../../shared/components/header-socios/header-socios.component';


@Component({
  selector: 'app-agregar-servico',
  standalone: true,
  imports: [SidebardComponent, HorizontalCardComponent, HeaderSociosComponent],
  templateUrl: './agregar-servico.component.html',
  styleUrl: './agregar-servico.component.scss'
})
export class AgregarServicoComponent {

}
