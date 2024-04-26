import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EntrenadorComponent} from './entrenador.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {FormsModule} from "@angular/forms";
import {of} from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";
import {AuthModule} from '@auth0/auth0-angular';
import {ApiGatewayBackendService} from "../../../apigateway-backend.service";
import {TranslateModule} from '@ngx-translate/core';

describe('EntrenadorComponent', () => {
  let component: EntrenadorComponent;
  let fixture: ComponentFixture<EntrenadorComponent>;
  let apiGatewayBackendService: ApiGatewayBackendService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModule.forRoot({
        domain: 'domain',
        clientId: 'clientId'
      }), EntrenadorComponent, FormsModule, HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(EntrenadorComponent);
    component = fixture.componentInstance;
    apiGatewayBackendService = TestBed.inject(ApiGatewayBackendService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a plan correctly', () => {
    // Mock del servicio para simular la respuesta del método solicitarSesionEntrenador
    spyOn(apiGatewayBackendService, 'crear_sesion_entrenador').and.returnValue(of({mensaje: 'Sesión de entrenador solicitada'}));

    // Llama al método que se va a probar
    component.solicitarSesionEntrenador();

    // Verifica que se hayan realizado las acciones esperadas
    expect(apiGatewayBackendService.crear_sesion_entrenador).toHaveBeenCalled();
    expect(component.activarMensajeExitoso).toBeTrue();
  });

  it('should create form data object with correct properties', () => {
    component.proveedor = 'AlejoFit';
    component.tipoEntrenamiento = 'Grupal';
    component.fechaSesion = '2024-04-15';
    component.horaSesion = '08:30';
    component.comentarios = 'Comentarios';
    const formData = component.imprimirDatos();

    expect(formData).toEqual({
      proveedor: 'AlejoFit',
      tipoEntrenamiento: 'Grupal',
      fechaSesion: '2024-04-15',
      horaSesion: '08:30',
      comentarios: 'Comentarios'
    })
  })
});
