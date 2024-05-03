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
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [HeaderComponent, SidebardComponent, HorizontalCardComponent, CalendarComponent, CommonModule, TranslateModule],
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
    this.obtenerEntrenamientos();
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
        console.log("sesiones_data",sesiones_data)
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

  obtenerEntrenamientos() {
    this.eventosService.getEntrenamientosApp().subscribe({
      next: (entrenamientos) => {
        const entrenamientos_data = this.crear_entrenamientos_calendario(entrenamientos)
        if (Array.isArray(this.calendarOptions.events)) {
          this.calendarOptions.events = this.calendarOptions.events.concat(entrenamientos_data[0]);
        }

        if (Array.isArray(this.eventos_general)) {
          const temp_general = this.eventos_general.concat(entrenamientos_data[1])
          this.eventos_general = this.ordernar_eventos(temp_general);
        }
      },
      error: (error) => {
        console.error('Error al obtener las entrenamientos:', error); // Manejo de errores en caso de que falle la solicitud
      }
    })
  }

  crear_eventos_calendario(eventos: any): any {
    if (!eventos || !eventos["eventos"]) return [[], []];
    eventos = eventos["eventos"];
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
    let sesionesEvent: any[] = []
    let sesionesList: any[] = []

    if (!sesiones) return [[], []];

    sesionesList = sesiones.map((session: any) => {
      return {
        title: `Se: ${session.tipoEntrenamiento}`,
        date: session.fechaSesion,
        backgroundColor: "#5353ec",
      }
    });

    sesionesEvent = sesiones.map((session: any) => {
      return {
        titulo: `Sesión: ${session.tipoEntrenamiento}`,
        descripcion: `${session.comentarios}, ${session.proveedor}`,
        fecha: `Fecha: ${session.fechaSesion}, Hora ${session.horaSesion} Ubicacion: Virtual`,
        fecha_pura: session.fechaSesion,
      }
    });

    return [sesionesList, sesionesEvent ]
  }


  crear_entrenamientos_calendario(entrenamientos: any): any {
    let entrenamientosEvent: any[] = []
    let entrenamientosList: any[] = []

    if (!entrenamientos) return [[], []];

    entrenamientosList = entrenamientos.map((entrenamiento: any) => {
      return {
        title: `Entreno: ${entrenamiento.sport_type}`,
        date: entrenamiento.fecha,
        backgroundColor: "#009846",
      }
    });

    entrenamientosEvent = entrenamientos.map((entrenamiento: any) => {
      return {
        titulo: `Entreno: ${entrenamiento.sport_type}`,
        distancia: `${entrenamiento.distance}`,
        fecha: `Fecha: ${entrenamiento.fecha}`,
      }
    });

    return [entrenamientosList, entrenamientosEvent ]
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
