import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../../../shared/components/header-admin/header-admin.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
@Component({
  selector: 'app-deportes',
  standalone: true,
  imports: [HeaderAdminComponent, FooterComponent],
  templateUrl: './deportes.component.html',
  styleUrl: './deportes.component.scss'
})
export class DeportesComponent {

}
