import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';

@Component({
  selector: 'app-sidebard',
  standalone: true,
  imports: [RouterLinkWithHref, LengSelectorComponent],
  templateUrl: './sidebard.component.html',
  styleUrl: './sidebard.component.scss'
})
export class SidebardComponent {

}
