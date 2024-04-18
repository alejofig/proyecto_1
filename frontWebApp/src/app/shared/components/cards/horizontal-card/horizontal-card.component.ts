import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-card',
  standalone: true,
  imports: [],
  templateUrl: './horizontal-card.component.html',
  styleUrl: './horizontal-card.component.scss'
})
export class HorizontalCardComponent {
  @Input() titulo: string;
  @Input() descripcion: string;
  @Input() fecha: string;

  constructor() {
    this.titulo = ''; // Puedes asignar un valor por defecto aquí
    this.descripcion = ''; // Puedes asignar un valor por defecto aquí
    this.fecha = ''; // Puedes asignar un valor por defecto aquí
  }
}
