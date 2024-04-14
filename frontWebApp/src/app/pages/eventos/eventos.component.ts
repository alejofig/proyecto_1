import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { HorizontalCardComponent } from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { EventosService } from './eventos.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [HeaderComponent, SidebardComponent, HorizontalCardComponent, CalendarComponent],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent {
  private eventosService = inject(EventosService)
  eventos = {}
  entrenamientos = {}

  ngOnInit(){
    this.eventosService.getEntrenamientos().subscribe({
      next: (entrenamientos) => {
        this.entrenamientos = entrenamientos
        console.log(this.entrenamientos)

      },
      error: (error) => {
        console.error('Error al obtener los Entrenamientos:', error); // Manejo de errores en caso de que falle la solicitud
      }
    })
    
    this.eventosService.getEvents().subscribe({
      next: (eventos) => {
        this.eventos = eventos
        console.log(this.eventos)

      },
      error: (error) => {
        console.error('Error al obtener los eventos:', error); // Manejo de errores en caso de que falle la solicitud
      }
    })



  }

}
