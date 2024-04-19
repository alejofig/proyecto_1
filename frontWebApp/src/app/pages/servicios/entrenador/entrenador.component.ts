import { Component } from '@angular/core';
import { SidebardComponent } from '../../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-entrenador',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent],
  templateUrl: './entrenador.component.html',
  styleUrl: './entrenador.component.scss'
})
export class EntrenadorComponent {

}
