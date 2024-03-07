import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-vertical-card-img',
  standalone: true,
  imports: [],
  templateUrl: './vertical-card-img.component.html',
  styleUrl: './vertical-card-img.component.scss'
})
export class VerticalCardImgComponent {
  @Input() titulo: string;
  @Input() descripcion: string;
  @Input() extra: string;
  @Input() imagen: string;

  constructor() {
    this.imagen = "";
    this.titulo = ''; 
    this.descripcion = ''; 
    this.extra = ''; 
  }
}
