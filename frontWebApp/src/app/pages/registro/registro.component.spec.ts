import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService as InternalAuthService } from '../servicios/auth.service';
import { ApiGatewayBackendService } from '../../apigateway-backend.service';
import { of } from 'rxjs';
import { AuthModule, AuthService } from '@auth0/auth0-angular';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let internalAuthService: InternalAuthService;
  let apigatewayBackendService: ApiGatewayBackendService;
  let httpTestingController: HttpTestingController;
  let backendService: ApiGatewayBackendService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, AuthModule.forRoot({
        domain: 'domain',
        clientId: 'clientId'
      })],
      providers: [InternalAuthService, ApiGatewayBackendService,AuthService],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    internalAuthService = TestBed.inject(InternalAuthService);
    apigatewayBackendService= TestBed.inject(ApiGatewayBackendService);
    httpTestingController = TestBed.inject(HttpTestingController);
    backendService = TestBed.inject(ApiGatewayBackendService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate password correctly', () => {
    component.password = 'Password123@';
    const errorMessage = component.validarPassword();
    expect(errorMessage).toBe('');
  });

  it('should validate password correctly', () => {
    component.password = '12';
    const errorMessage = component.validarPassword();
    expect(errorMessage).toBe('La contraseña debe tener al menos 8 caracteres.');
  });

  it('should validate password correctly', () => {
    component.password = '12345678';
    const errorMessage = component.validarPassword();
    expect(errorMessage).toBe('La contraseña debe contener al menos una letra minúscula.');
  });
  it('should validate password correctly', () => {
    component.password = '1234567a';
    const errorMessage = component.validarPassword();
    expect(errorMessage).toBe('La contraseña debe contener al menos una letra mayúscula.');
  });


  it('should validate form correctly', async () => {
    component.password = 'Password123@';
    component.username = 'John';
    component.lastname = 'Doe';
    component.tipo_id = 'PASAPORTE';
    component.identificacion = '1234567890';
    component.email = 'john@example.com';
    component.edad = 30;
    component.peso = 70;
    component.altura = 180;
    component.genero = 'Masculino';
    component.pais_nacimiento = 'USA';
    component.ciudad_nacimiento = 'New York';
    component.pais_residencia = 'USA';
    component.ciudad_residencia = 'New York';
    component.antiguedad_residencia = '5 años';
    component.deportes = ['Natación'];

    spyOn(internalAuthService, 'checkIfEmailExists').and.returnValue(Promise.resolve(false));
    spyOn(apigatewayBackendService, 'registrarUsuario').and.returnValue(of(false));
    const result = await component.validarFormulario();
    expect(result).toBe(true);
  });

  it('should check if email exists', async () => {
    spyOn(internalAuthService, 'checkIfEmailExists').and.returnValue(Promise.resolve(false));
    await component.checkIfEmailExists('john@example.com');
    expect(internalAuthService.checkIfEmailExists).toHaveBeenCalledWith('john@example.com');
  });

  it('should check if email exists', async () => {
    spyOn(internalAuthService, 'checkIfEmailExists').and.returnValue(Promise.resolve(true));
    await component.checkIfEmailExists('john@example.com');
    expect(internalAuthService.checkIfEmailExists).toHaveBeenCalledWith('john@example.com');
  });

  it('should display alert when username is not provided', async () => {
    spyOn(window, 'alert');
    component.password = 'Password123@';
    component.username = '';
        component.lastname = 'Doe';
    const result = await component.validarFormulario();

    expect(result).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Por favor ingresa tu nombre.');
});

it('should display alert when username is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = '';
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('Por favor ingresa tu apellido.');
});


it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.identificacion = '';
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('Por favor selecciona un tipo de identificación.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  const result = await component.validarFormulario();
  expect(window.alert).toHaveBeenCalledWith('Por favor ingresa tu número de identificación.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('Por favor ingresa una edad válida.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  component.edad = 30;
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('Por favor selecciona un género válido.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  component.edad = 30;
  component.genero = 'Masculino';
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('Por favor ingresa un peso válido.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  component.edad = 30;
  component.genero = 'Masculino';
  component.peso = 70;
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('Por favor ingresa una altura válida.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  component.edad = 30;
  component.genero = 'Masculino';
  component.peso = 70;
  component.altura = 180;
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('La contraseña debe tener al menos 8 caracteres.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  component.edad = 30;
  component.genero = 'Masculino';
  component.peso = 70;
  component.altura = 180;
  component.password = '1234568910';
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('La contraseña debe contener al menos una letra minúscula.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  component.edad = 30;
  component.genero = 'Masculino';
  component.peso = 70;
  component.altura = 180;
  component.password = 'abnbhsksp';
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('La contraseña debe contener al menos un número.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  component.edad = 30;
  component.genero = 'Masculino';
  component.peso = 70;
  component.altura = 180;
  component.password = 'a1nbhsksp';
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('La contraseña debe contener al menos una letra mayúscula.');
});

it('should display alert when identificacion is not provided', async () => {
  spyOn(window, 'alert');
  component.username = 'JOE';
  component.lastname = 'nuevo';
  component.tipo_id = 'CEDULA DE CIUDADANIA';
  component.identificacion = '1034567890';
  component.edad = 30;
  component.genero = 'Masculino';
  component.peso = 70;
  component.altura = 180;
  component.password = 'a1nbhsksAp';
  const result = await component.validarFormulario();
  expect(result).toBe(false);
  expect(window.alert).toHaveBeenCalledWith('La contraseña debe contener al menos un carácter especial.');
});

it('should create form data object with correct properties', () => {
  component.password = 'password123';
  component.username = 'John';
  component.lastname = 'Doe';
  component.email = 'john@example.com';
  component.tipo_id = 'PASAPORTE';
  component.identificacion = '1234567890';
  component.edad = 30;
  component.peso = 70;
  component.altura = 180;
  component.genero = 'Masculino';
  component.pais_nacimiento = 'USA';
  component.ciudad_nacimiento = 'New York';
  component.pais_residencia = 'USA';
  component.ciudad_residencia = 'New York';
  component.antiguedad_residencia = '5 años';
  component.deportes = [];
  const formData = component.create_form_data();

  expect(formData).toEqual({
    password: 'password123',
    nombre: 'John',
    apellido: 'Doe',
    username: 'john@example.com',
    tipo_documentacion: 'PASAPORTE',
    numero_identificacion: '1234567890',
    email: 'john@example.com',
    edad: 30,
    peso: 70,
    altura: 180,
    genero: 'Masculino',
    pais_nacimiento: 'USA',
    ciudad_nacimiento: 'New York',
    pais_residencia: 'USA',
    ciudad_residencia: 'New York',
    antiguedad_residencia: '5 años',
    deportes: [],
    tipo_plan:"GRATUITO"});
});

it('should add sport to deportes array', () => {
  component.nuevoDeporte = 'Natación';

  component.agregarDeporte();

  expect(component.deportes).toEqual(['Natación']);
});

it('should remove sport from deportes array', () => {
  component.deportes = ['Natación', 'Running', 'Cycling'];

  component.quitarDeporte('Running');

  expect(component.deportes).toEqual(['Natación', 'Cycling']);
});


});


