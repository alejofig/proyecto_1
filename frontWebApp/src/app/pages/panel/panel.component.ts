import { Component } from '@angular/core';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { RouterLinkWithHref } from '@angular/router';
@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [SidebardComponent, RouterLinkWithHref],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {

}
