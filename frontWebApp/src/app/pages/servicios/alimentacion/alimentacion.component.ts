import { Component } from '@angular/core';
import { SidebardComponent } from '../../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';


@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent ],
  templateUrl: './alimentacion.component.html',
  styleUrl: './alimentacion.component.scss'
})
export class AlimentacionComponent {

}
