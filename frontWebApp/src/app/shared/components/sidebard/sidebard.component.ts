import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-sidebard',
  standalone: true,
  imports: [RouterLinkWithHref],
  templateUrl: './sidebard.component.html',
  styleUrl: './sidebard.component.scss'
})
export class SidebardComponent {

}
