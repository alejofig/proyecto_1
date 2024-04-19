import { Component } from '@angular/core';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
