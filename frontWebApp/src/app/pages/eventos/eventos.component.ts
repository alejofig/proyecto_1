import { Component, inject} from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { HorizontalCardComponent } from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { EventosService } from './eventos.service';
import { CalendarApi, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonModule } from '@angular/common';
import { ListCalendar } from './eventos-interfaces';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [HeaderComponent, SidebardComponent, HorizontalCardComponent, CalendarComponent, CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent {

  private eventosService = inject(EventosService)

  calendarOptions: CalendarOptions = {
    'initialView': 'dayGridMonth',
    'plugins': [dayGridPlugin],
    events: [
      { title: 'Event 1', date: '2024-04-15' },
    ]
  }

  eventos = {}
  entrenamientos: ListCalendar[] = []

  ngOnInit(){
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

  ngAfterViewInit() {
    this.eventosService.getEntrenamientos().subscribe({
      next: (entrenamientos) => {
        const entrenamientos_data = this.crear_entremientos_calendario(entrenamientos)

        this.calendarOptions.events = entrenamientos_data[0];
        this.entrenamientos = entrenamientos_data[1];
        console.log("entrenamientos_eventos",entrenamientos_data[1])
      },
      error: (error) => {
        console.error('Error al obtener los Entrenamientos:', error); // Manejo de errores en caso de que falle la solicitud
      }
    })
    
  }

  crear_entremientos_calendario(planes: any): any {
    const entrenamientosEvent: any[] = []
    const entrenamientosList: any[]=[]
    planes.forEach((plan:any) => {
      const dateParts = plan.fechas.replace(/'/g, "").split(', ');
      const formattedDates = dateParts.map((date: String) => date.replace(/\//g, '-'));

      formattedDates.forEach((date: string) => {
        let entr =  {
          title: `Ent: ${plan.deporte}, 
                  ${plan.nombre}`,
          date: date
         };
         entrenamientosEvent.push(entr);

         let entr2 ={
              titulo: `Entrenamiento: ${plan.deporte},  ${plan.nombre}`,
              descripcion: `Entrenamiento de ${plan.deporte} del Plan: ${plan.nombre} 
              Con objetivo de distancia ${plan.distanciaPorEntrenamientos} KM `,
              fecha: `Fecha: ${date}, Ubicacion Deseada ` ,
              fecha_pura: date
         };
         entrenamientosList.push(entr2);
         
      });
    });
    // Ajustar lista para tener solo fechas mayores a hoy ordenadas por antiguedad
    // Obtener la fecha de hoy
    const hoy = new Date();
    // Filtrar eventos que son futuros y ordenar por fecha descendente
    const eventosFiltradosYOrdenados = entrenamientosList
    .filter(evento => new Date(evento.fecha_pura) >= hoy)  // Filtra eventos pasados
    .sort((a, b) => new Date(a.fecha_pura).getTime() - new Date(b.fecha_pura).getTime());  // Ordena de más reciente a más lejano

    return [entrenamientosEvent, eventosFiltradosYOrdenados]
  };

  }

 
  

