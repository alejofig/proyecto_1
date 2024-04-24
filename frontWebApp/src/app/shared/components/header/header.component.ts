import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkWithHref, LengSelectorComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(translate: TranslateService) { }

}
