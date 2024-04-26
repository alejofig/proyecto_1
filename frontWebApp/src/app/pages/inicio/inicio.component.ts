import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderInicioComponent } from '../../shared/components/header-inicio/header-inicio.component';
import { AuthButtonComponent } from '../auth-button/auth-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLinkWithHref, 
            FooterComponent, 
            HeaderInicioComponent,
            AuthButtonComponent, 
            CommonModule,
            TranslateModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es-co', 'es-ar', 'pt-br']);
    const lang = localStorage.getItem('lang') || 'es-co';
    if (!(lang  in ['es-co', 'es-ar', 'pt-br'])) {
      translate.setDefaultLang('es-co');
    }
    else {
      translate.setDefaultLang(lang);
    }
  }

}
