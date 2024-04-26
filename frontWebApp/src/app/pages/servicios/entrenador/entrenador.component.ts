import {Component, OnInit} from '@angular/core';
import {SidebardComponent} from '../../../shared/components/sidebard/sidebard.component';
import {HeaderComponent} from '../../../shared/components/header/header.component';
import {RouterLinkWithHref} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {Entrenador} from "./entrenador";
import {ApiGatewayBackendService} from "../../../apigateway-backend.service";
import {EntrenadorService} from "./entrenador.service";

@Component({
  selector: 'app-entrenador',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent, RouterLinkWithHref, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './entrenador.component.html',
  styleUrl: './entrenador.component.scss'
})
export class EntrenadorComponent implements OnInit {

  entrenadorForm!: FormGroup;
  public proveedor: string = '';
  public tipoEntrenamiento: string = '';
  public fechaSesion: string = '';
  public horaSesion: string = '';
  public comentarios: string = '';
  public mensaje: string = '';
  public mensajeError: string = 'Todos los campos son obligatorios, por favor ingrese los campos faltantes.'
  public mensajeExitoso: string = 'La sesión virtual con el proveedor seleccionado ha sido agendada con éxito!';
  public activarMensajeExitoso: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiGatewayBackendService: ApiGatewayBackendService,
    private entrenadorService: EntrenadorService
  ) {
  }

  ngOnInit() {
    this.entrenadorForm = this.formBuilder.group({
      proveedor: ["", [Validators.required]],
      tipoEntrenamiento: ["", [Validators.required]],
      fechaSesion: ["", [Validators.required]],
      horaSesion: ["", [Validators.required]],
      comentarios: ["", [Validators.required]]
    })
  }

  validarFormulario() {
    if (!this.proveedor || !this.tipoEntrenamiento || !this.fechaSesion || !this.horaSesion || !this.comentarios) {
      this.activarMensajeExitoso = true;
      this.mensaje = this.mensajeError;
      return false;
    }

    this.solicitarSesionEntrenador();
    return true;
  }

  solicitarSesionEntrenador(): void {
    this.activarMensajeExitoso = true;
    this.mensaje = this.mensajeExitoso;
    console.log(this.imprimirDatos())

    let entrenador = new Entrenador(this.proveedor, this.tipoEntrenamiento, this.fechaSesion, this.horaSesion, this.comentarios)
    console.log(entrenador)

    this.entrenadorService.crear_sesion_entrenador(entrenador).subscribe((result: any) => {
      console.log('Response: ', result)
      console.info(this.mensajeExitoso, result)
      this.activarMensajeExitoso = true;
    })
  }

  imprimirDatos(): any {
    return {
      proveedor: this.proveedor,
      tipoEntrenamiento: this.tipoEntrenamiento,
      fechaSesion: this.fechaSesion,
      horaSesion: this.horaSesion,
      comentarios: this.comentarios
    }
  }
}
