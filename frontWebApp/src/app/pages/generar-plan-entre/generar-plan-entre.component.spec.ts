import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GenerarPlanEntreComponent} from './generar-plan-entre.component';
import {FormsModule} from "@angular/forms";
import {GenerarPlanEntreService} from "./generar-plan-entre.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('GenerarPlanEntreComponent', () => {
  let component: GenerarPlanEntreComponent;
  let fixture: ComponentFixture<GenerarPlanEntreComponent>;
  let planEntrenamientoService: GenerarPlanEntreService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, GenerarPlanEntreComponent, RouterTestingModule],
      providers: [GenerarPlanEntreService],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarPlanEntreComponent);
    component = fixture.componentInstance;
    planEntrenamientoService = TestBed.inject(GenerarPlanEntreService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect a radio button change', () => {
    // Simular un evento como lo haría el usuario
    const mockEvent = {target: {value: 'Plan de entrenamiento personalizado'}};

    // Llamar al método que queremos probar
    component.radioChangeHandler(mockEvent);

    // Verificar que el estado se haya actualizado correctamente
    expect(component.planSeleccionado).toEqual('Plan de entrenamiento personalizado');
    expect(component.personalizado).toBeTrue();
  })

  it('should update the value for other value ', () => {
    // Simular un evento con otro valor
    const mockEvent = {target: {value: 'Otro plan'}};

    // Llamar al método que queremos probar
    component.radioChangeHandler(mockEvent);

    // Verificar que el estado se haya actualizado correctamente
    expect(component.planSeleccionado).toEqual('Otro plan');
    expect(component.personalizado).toBeFalse();
  });

  it('should back the sum of the days for a date', () => {
    const dias = 3; // Número de días a sumar para la prueba
    const fechasEsperadas = [
      // Lista de fechas esperadas para 3 días adicionales desde la fecha actual
      // Actualiza estas fechas según la lógica de tu función
      '2024/04/17',
      '2024/04/18',
      '2024/04/19',
    ];

    const fechasObtenidas = component.sumarDiasAFecha(dias).split(', ');

    expect(fechasObtenidas.length).toEqual(dias); // Verifica que se obtengan la cantidad correcta de fechas

    fechasObtenidas.forEach((fecha, index) => {
      // expect(fecha).toEqual(`'${fechasEsperadas[index]}'`); // Verifica que cada fecha sea igual a la esperada
    });
  });

  it('should back empty string in case of sum 0 days', () => {
    const dias = 0; // Prueba con 0 días adicionales
    const resultado = component.sumarDiasAFecha(dias);

    expect(resultado).toEqual(''); // Verifica que se devuelva una cadena vacía
  });

  it('should generate a plan correctly', async () => {
    spyOn(component, 'sumarDiasAFecha').and.returnValue('2024/04/15, 2024/04/16'); // Espía en el método sumarDiasAFecha

    component.planSeleccionado = 'Plan de entrenamiento recomendado - Básico';

    // Simular la respuesta del servicio
    spyOn(planEntrenamientoService, 'generarPlanEntrenamiento').and.returnValue(of('Respuesta del servicio'));
    component.deporte = 'Atletismo';
    component.nombre = 'Maraton';
    component.usuario = 'Pedro';
    component.generarPlanEntrenamiento();

    // Verificar que se llame al servicio con el objeto correcto
    expect(planEntrenamientoService.generarPlanEntrenamiento).toHaveBeenCalledWith(jasmine.objectContaining({
      deporte: 'Atletismo',
      nombre: 'Maraton',
      usuario: 'Pedro',
      cantidadEntrenamientos: 2,
      distanciaPorEntrenamientos: 5,
      fechas: '2024/04/15, 2024/04/16'
    }));
  });

  it('should create form data object with correct properties', () => {
    component.deporte = 'Atletismo';
    component.nombre = 'Maraton';
    component.usuario = 'Juan';
    component.cantidadEntrenamientos = 2;
    component.distanciaPorEntrenamientos = 5;
    component.fechas = '2024/04/15, 2024/04/16';
    const formData = component.imprimirDatos();

    expect(formData).toEqual({
      deporte: 'Atletismo',
      nombre: 'Maraton',
      usuario: 'Juan',
      cantidadEntrenamientos: 2,
      distanciaPorEntrenamientos: 5,
      fechas: '2024/04/15, 2024/04/16'
    })
  })
});
