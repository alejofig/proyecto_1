import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../../../shared/components/header-admin/header-admin.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-indicadores',
  standalone: true,
  imports: [HeaderAdminComponent, FooterComponent],
  templateUrl: './indicadores.component.html',
  styleUrl: './indicadores.component.scss'
})
export class IndicadoresComponent {

}
