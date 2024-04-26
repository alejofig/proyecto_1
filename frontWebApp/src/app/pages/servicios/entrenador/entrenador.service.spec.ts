import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntrenadorService} from './entrenador.service';
import {environment} from '../../../../environments/environment';

describe('EntrenadorService', () => {
  let service: EntrenadorService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EntrenadorService]
    });

    service = TestBed.inject(EntrenadorService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure that there are no outstanding HTTP requests after each test.
  });

  describe('solicitarSesionEntrenador', () => {
    it('should send POST request to create a training session', () => {
      const entrenadorData = {name: 'John Doe', sessionType: 'yoga'};
      const expectedResponse = {success: true, message: 'Session scheduled successfully'};

      service.solicitarSesionEntrenador(entrenadorData).subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(`${environment.tercerosUrl}/solicitar_sesion_entrenador`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(entrenadorData);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(expectedResponse); // Mock the response
    });

    it('should handle errors for training session creation', () => {
      const entrenadorData = {name: 'Jane Doe', sessionType: 'cardio'};
      const mockError = new ErrorEvent('Network error', {
        message: 'Network error occurred'
      });

      service.solicitarSesionEntrenador(entrenadorData).subscribe(
        response => fail('Expected an error, not training session'),
        error => expect(error.error.message).toContain('Network error')
      );

      const req = httpTestingController.expectOne(`${environment.tercerosUrl}/solicitar_sesion_entrenador`);
      expect(req.request.method).toBe('POST');
      req.error(mockError);
    });
  });
});
