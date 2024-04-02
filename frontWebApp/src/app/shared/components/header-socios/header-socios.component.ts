import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';

@Component({
  selector: 'app-header-socios',
  standalone: true,
  imports: [RouterLinkWithHref, LengSelectorComponent],
  templateUrl: './header-socios.component.html',
  styleUrl: './header-socios.component.scss'
})
export class HeaderSociosComponent {

}
