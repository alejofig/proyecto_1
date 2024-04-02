import { Component } from '@angular/core';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';
@Component({
  selector: 'app-header-inicio',
  standalone: true,
  imports: [LengSelectorComponent],
  templateUrl: './header-inicio.component.html',
  styleUrl: './header-inicio.component.scss'
})
export class HeaderInicioComponent {

}
