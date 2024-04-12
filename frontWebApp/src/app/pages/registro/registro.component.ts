import { Component } from '@angular/core';
import { Route, RouterLinkWithHref } from '@angular/router';
import { HeaderInicioComponent } from '../../shared/components/header-inicio/header-inicio.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../servicios/auth.service';
import { ApiGatewayBackendService } from '../../apigateway-backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    RouterLinkWithHref,
    HeaderInicioComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    HttpClientModule,

  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  public password: string = '';
  public username: string = '';
  public lastname: string = '';
  public tipo_id: string = '';
  public identificacion: string = '';
  public email: string = '';
  public edad: number = 0;
  public peso: number = 0;
  public altura: number = 0;
  public genero: string = '';
  public pais_nacimiento:  string = '';
  public ciudad_nacimiento:  string = '';
  public pais_residencia:  string = '';
  public ciudad_residencia:  string = '';
  public antiguedad_residencia:  string = '';
  public formValid: boolean = false;
  public errorMessage: string = '';
  public nuevoDeporte: string = '';
  public tipo_plan: string = 'GRATUITO';
  public deportes: string[] = [];
  public emailExistsError: boolean = false;
  registroExitoso: boolean = false;
  constructor(
     private router: Router,
     private http: HttpClient,
     private authService: AuthService,
     private backendService: ApiGatewayBackendService) {}

  validarPassword() {
    let errorMessage = '';

    if (this.password.length < 8) {
      errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/(?=.*\d)/.test(this.password)) {
      errorMessage = 'La contraseña debe contener al menos un número.';
    } else if (!/(?=.*[a-z])/.test(this.password)) {
      errorMessage =
        'La contraseña debe contener al menos una letra minúscula.';
    } else if (!/(?=.*[A-Z])/.test(this.password)) {
      errorMessage =
        'La contraseña debe contener al menos una letra mayúscula.';
    } else if (!/(?=.*[@#$%^&*!])/.test(this.password)) {
      errorMessage =
        'La contraseña debe contener al menos un carácter especial.';
    }

    return errorMessage;
  }
  async validarFormulario(): Promise<boolean> {
    if (!this.username) {
      alert('Por favor ingresa tu nombre.');
      return false;
    } else if (!this.lastname) {
      alert('Por favor ingresa tu apellido.');
      return false;
    } else if (!this.tipo_id) {
      alert('Por favor selecciona un tipo de identificación.');
      return false;
    } else if (!this.identificacion) {
      alert('Por favor ingresa tu número de identificación.');
      return false;
    } else if (!this.edad || isNaN(this.edad)) {
      alert('Por favor ingresa una edad válida.');
      return false;
    } else if (!['Masculino', 'Femenino', 'Otro'].includes(this.genero)) {
      alert('Por favor selecciona un género válido.');
      return false;
    } else if (!this.peso || isNaN(this.peso)) {
      alert('Por favor ingresa un peso válido.');
      return false;
    } else if (!this.altura || isNaN(this.altura)) {
      alert('Por favor ingresa una altura válida.');
      return false;
    }
    const passwordErrorMessage = this.validarPassword();
    if (passwordErrorMessage) {
        alert(passwordErrorMessage);
        return false;
    }
    if (await this.checkIfEmailExists(this.email)){
      return false;
    }else{
      console.log(this.create_form_data())
      this.backendService.registrar_usuario(this.create_form_data()).subscribe((response: any) => {
        console.log('Response:', response);
      });
      this.registroExitoso = true;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
      return true;
    }
  }

  public agregarDeporte(): void {
    if (this.nuevoDeporte.trim() !== '') {
        this.deportes.push(this.nuevoDeporte);
        this.nuevoDeporte = '';
    }
}

public quitarDeporte(deporte: string): void {
    const indice = this.deportes.indexOf(deporte);
    if (indice !== -1) {
        this.deportes.splice(indice, 1);
    }
}

public async checkIfEmailExists(email: string): Promise<boolean> {
  console.log('Verificando si el correo electrónico ya está registrado.');
  console.log('Email:', this.email);
  try {
    const emailExists = await this.authService.checkIfEmailExists(email);
    if (emailExists) {
      alert('El correo electrónico ya está registrado.');
      return true;
    }
    return false; // Add this line to return an empty string
  } catch (error) {
    console.error('Error al verificar el correo electrónico:', error);
    return false; // Add this line to return an empty string
  }

}
public registerUser(): void {
this.backendService.registrar_usuario(this.create_form_data()).subscribe((response: any) => {
  console.log('Response:', response);
});
}

public create_form_data(): any {
    return {
      password: this.password,
      nombre: this.username,
      apellido: this.lastname,
      username: this.email,
      tipo_documentacion: this.tipo_id,
      numero_identificacion: this.identificacion,
      email: this.email,
      edad: this.edad,
      peso: this.peso,
      altura: this.altura,
      genero: this.genero,
      pais_nacimiento: this.pais_nacimiento,
      ciudad_nacimiento: this.ciudad_nacimiento,
      pais_residencia: this.pais_residencia,
      ciudad_residencia: this.ciudad_residencia,
      antiguedad_residencia: this.antiguedad_residencia,
      tipo_plan: "GRATUITO",
      deportes: this.deportes,
    };
  }
}
