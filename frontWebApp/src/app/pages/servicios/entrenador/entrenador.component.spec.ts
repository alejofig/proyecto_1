import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EntrenadorComponent} from './entrenador.component';
import {EntrenadorService} from "./entrenador.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {FormsModule} from "@angular/forms";
import {of} from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";
import { AuthModule } from '@auth0/auth0-angular';

describe('EntrenadorComponent', () => {
  let component: EntrenadorComponent;
  let fixture: ComponentFixture<EntrenadorComponent>;
  let entrenadorService: EntrenadorService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrenadorComponent, FormsModule, HttpClientTestingModule, RouterTestingModule,AuthModule.forRoot({
        domain: 'domain',
        clientId: 'clientId'
      })],
      providers: [EntrenadorComponent],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(EntrenadorComponent);
    component = fixture.componentInstance;
    entrenadorService = TestBed.inject(EntrenadorService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a plan correctly', () => {
    // Mock del servicio para simular la respuesta del método solicitarSesionEntrenador
    spyOn(entrenadorService, 'solicitarSesionEntrenador').and.returnValue(of({mensaje: 'Sesión de entrenador solicitada'}));

    // Llama al método que se va a probar
    component.solicitarSesionEntrenador();

    // Verifica que se hayan realizado las acciones esperadas
    expect(entrenadorService.solicitarSesionEntrenador).toHaveBeenCalled();
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
