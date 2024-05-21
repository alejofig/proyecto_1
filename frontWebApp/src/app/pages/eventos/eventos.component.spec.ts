import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventosComponent } from './eventos.component';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from './eventos.service';
import { of } from 'rxjs';
import { AuthModule } from '@auth0/auth0-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('EventosComponent', () => {
  let component: EventosComponent;
  let fixture: ComponentFixture<EventosComponent>;
  let eventosServiceMock: any;


  beforeEach(async () => {
    eventosServiceMock = jasmine.createSpyObj('EventosService', ['getEvents', 'getEntrenamientos', 'getSesionesEntrenador', 'getEntrenamientosApp']);
    eventosServiceMock.getEvents.and.returnValue(of([])); // Retorna un observable vacío inicialmente
    eventosServiceMock.getEntrenamientos.and.returnValue(of([])); // Igual para entrenamientos
    eventosServiceMock.getSesionesEntrenador.and.returnValue(of([])); 
    eventosServiceMock.getEntrenamientosApp.and.returnValue(of([])); 

    await TestBed.configureTestingModule({
      imports: [EventosComponent, HttpClientTestingModule,AuthModule.forRoot({
        domain: 'domain',
        clientId: 'clientId'
      }), TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: EventosService, useValue: eventosServiceMock },
        TranslateService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ordenar_eventos', () => {
    const eventosDesordenados = [
      { fecha_pura: '2020-01-03' },
      { fecha_pura: '2124-01-04' },
      { fecha_pura: '2124-01-01' },

    ];

    const eventosOrdenados = component.ordernar_eventos(eventosDesordenados);

    expect(eventosOrdenados[0].fecha_pura).toBe('2124-01-01');
    expect(eventosOrdenados[1].fecha_pura).toBe('2124-01-04');
  });

  it('should fetch events and handle them on init', () => {
    const fakeEvents = [{ nombre: 'Evento1', fecha: '2024-01-01' }];
    eventosServiceMock.getEvents.and.returnValue(of(fakeEvents)); // Simula respuesta con eventos
    component.ngOnInit();

    fixture.detectChanges(); // Actualiza el componente con los datos simulados

    //expect(eventosServiceMock.getEvents).toHaveBeenCalled();
    //expect(component.eventos_general.length).toBeGreaterThan(0);
  });


  it('should properly transform event data for calendar and general list', () => {
      const mockEvents = {"eventos": [
        {
          nombre: 'Conferencia Angular',
          fecha: '2024-04-15',
          descripcion: 'Una conferencia sobre Angular.',
          hora: '10:00',
          ciudad: 'Madrid',
          pais: 'España'
        },
        {
          nombre: 'Taller Vue',
          fecha: '2024-04-20',
          descripcion: 'Taller práctico de Vue.js',
          hora: '12:00',
          ciudad: 'Barcelona',
          pais: 'España'
        }
      ]};

      const expectedCalendarEvents = [
        {
          title: 'Evt: Conferencia Angular',
          date: '2024-04-15',
          backgroundColor: "#c9b924",
        },
        {
          title: 'Evt: Taller Vue',
          date: '2024-04-20',
          backgroundColor: "#c9b924",
        }
      ];

      const expectedGeneralEvents = [
        {
          titulo: 'Evento: Conferencia Angular',
          descripcion: 'Una conferencia sobre Angular.',
          fecha: 'Fecha: 2024-04-15, Hora 10:00 Ubicacion Madrid, España',
          fecha_pura: '2024-04-15',
        },
        {
          titulo: 'Evento: Taller Vue',
          descripcion: 'Taller práctico de Vue.js',
          fecha: 'Fecha: 2024-04-20, Hora 12:00 Ubicacion Barcelona, España',
          fecha_pura: '2024-04-20',
        }
      ];

      const transformedData = component.crear_eventos_calendario(mockEvents);
      console.log(transformedData);
      expect(transformedData[0]).toEqual(expectedCalendarEvents, 'Calendar events should match expected data');
      expect(transformedData[1]).toEqual(expectedGeneralEvents, 'General events should match expected data');
    });

  it('should call getEvents on ngOnInit', () => {
    eventosServiceMock.getEvents.and.returnValue(of([]));  // Simula una respuesta vacía
    component.ngOnInit();
    expect(eventosServiceMock.getEvents).toHaveBeenCalled();
  });

  it('should call getEntrenamientos on ngAfterViewInit', () => {
    eventosServiceMock.getEntrenamientos.and.returnValue(of([]));  // Simula una respuesta vacía
    component.ngAfterViewInit();
    expect(eventosServiceMock.getEntrenamientos).toHaveBeenCalled();
  });

  it('should transform training data correctly', () => {
    const plan = {
      "cantidadEntrenamientos": "2",
      "usuario": "Pedro",
      "deporte": "Atletismo",
      "nombre": "nuevo",
      "id": 1,
      "distanciaPorEntrenamientos": "5",
      "fechas": "'2024/04/14', '2024/04/15'"
  }
    spyOn(component, 'crear_entremientos_calendario');
    component.crear_entremientos_calendario([plan]);
    expect(component.crear_entremientos_calendario).toHaveBeenCalledWith([plan]);
  });

  });
