import { Component } from '@angular/core';
import { HeaderSociosComponent } from '../../../shared/components/header-socios/header-socios.component';
import {VerticalCardImgComponent} from '../../../shared/components/cards/vertical-card-img/vertical-card-img.component';

@Component({
  selector: 'app-gestion-contratos',
  standalone: true,
  imports: [HeaderSociosComponent, VerticalCardImgComponent],
  templateUrl: './gestion-contratos.component.html',
  styleUrl: './gestion-contratos.component.scss'
})
export class GestionContratosComponent {

}
