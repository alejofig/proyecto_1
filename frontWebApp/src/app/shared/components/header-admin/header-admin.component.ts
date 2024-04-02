import { Component } from '@angular/core';
import {RouterLinkWithHref} from '@angular/router';
import { LengSelectorComponent } from '../leng-selector/leng-selector.component';
@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [RouterLinkWithHref, LengSelectorComponent],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.scss'
})
export class HeaderAdminComponent {

}
