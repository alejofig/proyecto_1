import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {ApiGatewayBackendService} from './apigateway-backend.service';
import {environment} from '../environments/environment';
import {AuthModule, AuthService} from '@auth0/auth0-angular';
import {of} from 'rxjs';

describe('ApiGatewayBackendService', () => {
  let service: ApiGatewayBackendService;
  let httpTestingController: HttpTestingController;
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      getAccessTokenSilently: jasmine.createSpy('getAccessTokenSilently').and.returnValue(of('mock-token'))
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AuthModule.forRoot({
        domain: 'domain',
        clientId: 'clientId'
      })],
      providers: [ApiGatewayBackendService, {provide: AuthService, useValue: authServiceMock}]
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
    const userData = {};

    service.registrarUsuario(userData).subscribe(response => {
    });
    const req = httpTestingController.expectOne(`${environment.apigateway_url}/registrar_usuario`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(userData);
  });

  it('should get complete user data', () => {
    const dummyUser = {name: 'John Doe', email: 'john@example.com'};
    service.callApiAndGetCompleteUser().subscribe(user => {
      expect(user).toEqual(dummyUser);
    });
    const req = httpTestingController.expectOne(`${environment.apigateway_url}/get_complete_user/`);
  });

  it('should get statistics', () => {
    const dummyStats = {totalUsers: 1000};
    service.callApiAndGetStatics().subscribe(stats => {
      expect(stats).toEqual(dummyStats);
    });

    // Intercept the HTTP GET request
    const req = httpTestingController.expectOne('https://apigateway.uniandes-sports.com/obtener_estadisticas/');
    expect(req.request.method).toBe('GET'); // Verify that the method of the request is GET

    // Respond with mock data
    req.flush(dummyStats);

    // Ensure no outstanding HTTP requests
    httpTestingController.verify();
  });

  it('should register a mototaller service', () => {
    const motoTallerData = {name: 'Moto Repair', location: 'Downtown'};
    const response = {success: true, id: 123};

    service.registrarMototaller(motoTallerData).subscribe(res => {
      expect(res).toEqual(response);
    });

    // Expect a POST request to the specific URL
    const req = httpTestingController.expectOne('https://apigateway.uniandes-sports.com/crear_servicio_mototaller/');
    expect(req.request.method).toBe('POST'); // Check that the request is a POST request
    expect(req.request.body).toEqual(motoTallerData); // Verify that the correct data was sent

    // Flush the request with the mock response data
    req.flush(response);

    // Ensure there are no outstanding HTTP requests
    httpTestingController.verify();
  });

  it('should request alimentation service', () => {
    const alimentacionData = {meal: 'Vegan', quantity: 100};
    const response = {confirmed: true, orderId: 456};

    service.solicitarAlimentacion(alimentacionData).subscribe(res => {
      expect(res).toEqual(response);
    });

    // Expect a POST request to the correct URL
    const req = httpTestingController.expectOne('https://apigateway.uniandes-sports.com/solicitar_alimentacion/');
    expect(req.request.method).toBe('POST'); // Verify that the request is a POST request
    expect(req.request.body).toEqual(alimentacionData); // Verify that the correct data was sent

    // Respond with mock data
    req.flush(response);

    // Ensure there are no outstanding HTTP requests
    httpTestingController.verify();
  });
});
