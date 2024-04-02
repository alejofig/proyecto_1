import { Component } from '@angular/core';
import { SidebardComponent } from '../../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-primeros-auxilios',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent],
  templateUrl: './primeros-auxilios.component.html',
  styleUrl: './primeros-auxilios.component.scss'
})
export class PrimerosAuxiliosComponent {

}
