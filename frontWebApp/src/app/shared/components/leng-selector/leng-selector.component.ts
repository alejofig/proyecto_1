import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-leng-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './leng-selector.component.html',
  styleUrl: './leng-selector.component.scss'
})
export class LengSelectorComponent {

  options = [
            {value:"es-co", label:"Español, Colombia"}, 
            {value:"es-ar", label:"Español, Argentina"}, 
            {value:"pt-br", label:"Portugués, Brasil"}]

  selectedOption = environment.language;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(environment.language);
  }


  onChange(event: any) {
    const lang = (event.target.value)
    this.translate.use(lang);
    environment.language = lang;
  }

}
