import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkWithHref, LengSelectorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
