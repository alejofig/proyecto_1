import { Component } from '@angular/core';
import { SidebardComponent } from '../../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';


@Component({
  selector: 'app-mototaller',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent],
  templateUrl: './mototaller.component.html',
  styleUrl: './mototaller.component.scss'
})
export class MototallerComponent {

}
