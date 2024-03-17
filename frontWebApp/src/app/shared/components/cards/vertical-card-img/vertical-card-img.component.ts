import { Component, Input} from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-vertical-card-img',
  standalone: true,
  imports: [RouterLinkWithHref],
  templateUrl: './vertical-card-img.component.html',
  styleUrl: './vertical-card-img.component.scss'
})
export class VerticalCardImgComponent {
  @Input() titulo: string;
  @Input() descripcion: string;
  @Input() extra: string;
  @Input() imagen: string;
  @Input() link: string;

  constructor() {
    this.imagen = "";
    this.titulo = ''; 
    this.descripcion = ''; 
    this.extra = ''; 
    this.link = '';
  }
}
