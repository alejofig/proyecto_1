import { Component } from '@angular/core';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [SidebardComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {

}
