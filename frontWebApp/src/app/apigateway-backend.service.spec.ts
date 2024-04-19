import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiGatewayBackendService } from './apigateway-backend.service';
import { environment } from '../environments/environment';

describe('ApiGatewayBackendService', () => {
  let service: ApiGatewayBackendService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiGatewayBackendService]
    });
    service = TestBed.inject(ApiGatewayBackendService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya solicitudes pendientes después de cada prueba
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to register a user', () => {
    const userData = {
    };

    service.registrar_usuario(userData).subscribe(response => {
    });
    const req = httpTestingController.expectOne(`${environment.apigateway_url}/registrar_usuario`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(userData);

  });
});
