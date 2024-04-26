import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { HorizontalCardComponent } from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import { VerticalCardImgComponent } from '../../shared/components/cards/vertical-card-img/vertical-card-img.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-servicios-terceros',
  standalone: true,
  imports: [HeaderComponent, SidebardComponent, HorizontalCardComponent, VerticalCardImgComponent, TranslateModule],
  templateUrl: './servicios-terceros.component.html',
  styleUrl: './servicios-terceros.component.scss'
})
export class ServiciosTercerosComponent {

}
