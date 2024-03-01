import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
@Component({
  selector: 'app-servicios-terceros',
  standalone: true,
  imports: [HeaderComponent, SidebardComponent],
  templateUrl: './servicios-terceros.component.html',
  styleUrl: './servicios-terceros.component.scss'
})
export class ServiciosTercerosComponent {

}
