import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AlimentacionComponent} from './alimentacion.component';
import {AlimentacionService} from "./alimentacion.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {FormsModule} from "@angular/forms";
import {of} from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";

describe('AlimentacionComponent', () => {
  let component: AlimentacionComponent;
  let fixture: ComponentFixture<AlimentacionComponent>;
  let alimentacionService: AlimentacionService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlimentacionComponent, FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [AlimentacionComponent],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(AlimentacionComponent);
    component = fixture.componentInstance;
    alimentacionService = TestBed.inject(AlimentacionService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a plan correctly', () => {
    // Mock del servicio para simular la respuesta del método solicitarAlimentacion
    spyOn(alimentacionService, 'solicitarAlimentacion').and.returnValue(of({mensaje: 'Alimentación solicitada'}));

    // Llama al método que se va a probar
    component.solicitarAlimentacion();

    // Verifica que se hayan realizado las acciones esperadas
    expect(alimentacionService.solicitarAlimentacion).toHaveBeenCalled();
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
