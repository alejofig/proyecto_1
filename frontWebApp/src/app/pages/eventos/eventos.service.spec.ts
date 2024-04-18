import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { EventosService } from './eventos.service';
import { environment } from '../../../environments/environment';

describe('EventosService', () => {
  let service: EventosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Asegúrate de importar HttpClientTestingModule

    });
    service = TestBed.inject(EventosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve events from the API via GET', () => {
    const dummyEvents = [{ id: 1, name: 'Evento 1' }, { id: 2, name: 'Evento 2' }];

    service.getEvents().subscribe((events: Object) => { // Change the type of 'events' parameter to 'Object'
      expect(events).toEqual(dummyEvents);
    });

    const request = httpMock.expectOne(`${environment.eventos_urls}/eventos`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyEvents);
  });

  it('should handle errors for getEvents', () => {
    const error = 'Failed to load events';
    service.getEvents().subscribe(
      events => fail('should have failed with the error'),
      error => expect(error.message).toContain('Failed to load')
    );

    const request = httpMock.expectOne(`${environment.eventos_urls}/eventos`);
    request.flush(null, { status: 500, statusText: error });
  });

  // Pruebas entrenamiento
  it('should fetch training plans successfully from the API', () => {
    const dummyPlans = [{ id: 1, name: 'Plan 1' }, { id: 2, name: 'Plan 2' }];

    service.getEntrenamientos().subscribe(plans => {
      expect(plans.length).toBe(2);
    });

    const request = httpMock.expectOne(`${environment.planesUrl}/planes`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyPlans);
  });

  it('should handle errors for getEntrenamientos', () => {
    const error = 'Error loading training plans';
    service.getEntrenamientos().subscribe(
      plans => fail('should have failed with an error'),
      error => expect(error.message).toContain('Error loading')
    );

    const request = httpMock.expectOne(`${environment.planesUrl}/planes`);
    request.flush(null, { status: 500, statusText: error });
  });

});
