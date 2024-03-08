import { Component } from '@angular/core';
import {RouterLinkWithHref} from '@angular/router';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [RouterLinkWithHref],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.scss'
})
export class HeaderAdminComponent {

}
