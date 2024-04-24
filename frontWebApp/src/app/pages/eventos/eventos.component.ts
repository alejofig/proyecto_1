import {Component, inject} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {SidebardComponent} from '../../shared/components/sidebard/sidebard.component';
import {HorizontalCardComponent} from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import {CalendarComponent} from '../../shared/components/calendar/calendar.component';
import {EventosService} from './eventos.service';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {CommonModule} from '@angular/common';
import {ListCalendar} from './eventos-interfaces';

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
    events: []
  }

  eventos_general: ListCalendar[] = []

  ngOnInit() {
    this.eventosService.getEvents().subscribe({
      next: (eventos) => {
        const eventos_data = this.crear_eventos_calendario(eventos)
        if (Array.isArray(this.calendarOptions.events)) {
          this.calendarOptions.events = this.calendarOptions.events.concat(eventos_data[0]);
        }

        if (Array.isArray(this.eventos_general)) {
          const temp_general = this.eventos_general.concat(eventos_data[1])
          this.eventos_general = this.ordernar_eventos(temp_general);
        }
      },
      error: (error) => {
        console.error('Error al obtener los eventos:', error); // Manejo de errores en caso de que falle la solicitud
      }
    })
  }

  ngAfterViewInit() {
    this.obtenerPlanesEntrenamiento();
    this.obtenerSesionesEntrenador();
  }

  obtenerPlanesEntrenamiento() {
    this.eventosService.getEntrenamientos().subscribe({
      next: (entrenamientos) => {
        const entrenamientos_data = this.crear_entremientos_calendario(entrenamientos)
        if (Array.isArray(this.calendarOptions.events)) {
          this.calendarOptions.events = this.calendarOptions.events.concat(entrenamientos_data[0]);
        }

        if (Array.isArray(this.eventos_general)) {
          const temp_general = this.eventos_general.concat(entrenamientos_data[1])
          this.eventos_general = this.ordernar_eventos(temp_general);
        }
      },
      error: (error) => {
        console.error('Error al obtener los Entrenamientos:', error); // Manejo de errores en caso de que falle la solicitud
      }
    })
  }

  obtenerSesionesEntrenador() {
    this.eventosService.getSesionesEntrenador().subscribe({
      next: (sesiones) => {
        const sesiones_data = this.crear_sesiones_entrenador_calendario(sesiones)
        if (Array.isArray(this.calendarOptions.events)) {
          this.calendarOptions.events = this.calendarOptions.events.concat(sesiones_data[0]);
        }

        if (Array.isArray(this.eventos_general)) {
          const temp_general = this.eventos_general.concat(sesiones_data[1])
          this.eventos_general = this.ordernar_eventos(temp_general);
        }
      },
      error: (error) => {
        console.error('Error al obtener las sesiones con entrenador:', error); // Manejo de errores en caso de que falle la solicitud
      }
    })
  }

  crear_eventos_calendario(eventos: any): any {
    const listaEventosCalendar = eventos.map((evento: any) => {
      return {
        title: `Evt: ${evento.nombre}`,
        date: evento.fecha,
        backgroundColor: "#c9b924",
      }
    });

    const listaEventos = eventos.map((evento: any) => {
      return {
        titulo: `Evento: ${evento.nombre}`,
        descripcion: evento.descripcion,
        fecha: `Fecha: ${evento.fecha}, Hora ${evento.hora} Ubicacion ${evento.ciudad}, ${evento.pais}`,
        fecha_pura: evento.fecha,
      }
    });

    return [listaEventosCalendar, listaEventos];
  };

  crear_entremientos_calendario(planes: any): any {
    const entrenamientosEvent: any[] = []
    const entrenamientosList: any[] = []

    planes.forEach((plan: any) => {
      const dateParts = plan.fechas.replace(/'/g, "").split(', ');
      const formattedDates = dateParts.map((date: String) => date.replace(/\//g, '-'));

      formattedDates.forEach((date: string) => {
        let entr = {
          title: `Ent: ${plan.deporte},
                  ${plan.nombre}`,
          date: date,
          backgroundColor: "#db2d2a",
        };
        entrenamientosEvent.push(entr);

        let entr2 = {
          titulo: `Entrenamiento: ${plan.deporte},  ${plan.nombre}`,
          descripcion: `Entrenamiento de ${plan.deporte} del Plan: ${plan.nombre}
              Con objetivo de distancia ${plan.distanciaPorEntrenamientos} KM `,
          fecha: `Fecha: ${date}, Ubicacion Deseada `,
          fecha_pura: date,
        };
        entrenamientosList.push(entr2);
      });
    });

    return [entrenamientosEvent, entrenamientosList]
  };

  crear_sesiones_entrenador_calendario(sesiones: any): any {
    const sesionesEvent: any[] = []
    const sesionesList: any[] = []

    sesiones.forEach((sesion: any) => {
      const dateParts = sesion.fechas.replace(/'/g, "").split(', ');
      const formattedDates = dateParts.map((date: String) => date.replace(/\//g, '-'));

      formattedDates.forEach((date: string) => {
        let entr = {
          title: `Ent: ${sesion.proveedor},
                  ${sesion.tipoEntrenamiento}`,
          date: date,
          backgroundColor: "#00FFFF",
        };
        sesionesEvent.push(entr);

        let entr2 = {
          titulo: `Sesión: ${sesion.proveedor},  ${sesion.tipoEntrenamiento}`,
          descripcion: `Sesión con un entrenador de la empresa ${sesion.proveedor}
              enfocado en el tipo de entrenamiento: ${sesion.tipoEntrenamiento}.
              Comentarios adicionales: ${sesion.comentarios}`,
          fecha: `Fecha: ${date}`,
          fecha_pura: date,
        };
        sesionesList.push(entr2);
      });
    });

    return [sesionesEvent, sesionesList]
  }

  ordernar_eventos(eventos: any) {
    const hoy = new Date();
    if (!eventos || !Array.isArray(eventos)) return [];

    const eventosFiltradosYOrdenados = eventos
      .filter((evento: any) => new Date(evento.fecha_pura) >= hoy)  // Filtra eventos pasados
      .sort((a: any, b: any) => new Date(a.fecha_pura).getTime() - new Date(b.fecha_pura).getTime());  // Ordena de más reciente a más lejano

    return eventosFiltradosYOrdenados
  }
}
