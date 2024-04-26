import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AlimentacionComponent} from './alimentacion.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {FormsModule} from "@angular/forms";
import {of} from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";
import {AuthModule} from "@auth0/auth0-angular";
import {ApiGatewayBackendService} from "../../../apigateway-backend.service";
import {TranslateModule} from '@ngx-translate/core';
import {AlimentacionService} from "./alimentacion.service";

describe('AlimentacionComponent', () => {
  let component: AlimentacionComponent;
  let fixture: ComponentFixture<AlimentacionComponent>;
  let alimentacionService: AlimentacionService;
  let apiGatewayBackendService: ApiGatewayBackendService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModule.forRoot({
        domain: 'domain',
        clientId: 'clientId'
      }), AlimentacionComponent, FormsModule, HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [AlimentacionComponent],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(AlimentacionComponent);
    component = fixture.componentInstance;
    alimentacionService = TestBed.inject(AlimentacionService);
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
    // Mock del servicio para simular la respuesta del método solicitarAlimentacion
    spyOn(alimentacionService, 'crear_servicio_alimentacion').and.returnValue(of({mensaje: 'Alimentación solicitada'}));

    // Llama al método que se va a probar
    component.solicitarAlimentacion();

    // Verifica que se hayan realizado las acciones esperadas
    expect(alimentacionService.crear_servicio_alimentacion).toHaveBeenCalled();
    expect(component.activarMensajeExitoso).toBeTrue(); // Verifica que el mensaje de éxito se haya activado
  });

  it('should create form data object with correct properties', () => {
    component.proveedor = 'Cocina Fit';
    component.proposito = 'nutricion'
    component.tipoAlimentacion = 'Proteina';
    component.modoRecibir = 'virtual';
    component.numeroContacto = 3124567890;
    component.direccionActual = 'Calle Falsa 123';
    component.ciudadActual = 'Lima';
    component.paisActual = 'Peru';
    const formData = component.imprimirDatos();

    expect(formData).toEqual({
      proveedor: 'Cocina Fit',
      proposito: 'nutricion',
      tipoAlimentacion: 'Proteina',
      modoRecibir: 'virtual',
      numeroContacto: 3124567890,
      direccionActual: 'Calle Falsa 123',
      ciudadActual: 'Lima',
      paisActual: 'Peru'
    })
  })
});
