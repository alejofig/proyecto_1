import {Component, OnInit} from '@angular/core';
import {SidebardComponent} from '../../../shared/components/sidebard/sidebard.component';
import {HeaderComponent} from '../../../shared/components/header/header.component';
import {RouterLinkWithHref} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {Alimentacion} from "./alimentacion";
import {ApiGatewayBackendService} from "../../../apigateway-backend.service";
import {AlimentacionService} from "./alimentacion.service";

@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent, RouterLinkWithHref, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './alimentacion.component.html',
  styleUrl: './alimentacion.component.scss'
})
export class AlimentacionComponent implements OnInit {

  alimentacionForm!: FormGroup;
  public proveedor: string = '';
  public proposito: string = '';
  public tipoAlimentacion: string = '';
  public modoRecibir: string = '';
  public numeroContacto: number = 0;
  public direccionActual: string = '';
  public ciudadActual: string = '';
  public paisActual: string = '';
  public mensaje: string = '';
  public mensajeError: string = 'Todos los campos son obligatorios, por favor ingrese los campos faltantes.'
  public mensajeVirtual: string = 'El servicio se ha generado con éxito y se muestra a continuación:';
  public mensajeDomicilio: string = 'Su orden ha sido recibida con éxito, en breve el proveedor lo contactará para ultimar detalles del domicilio!'
  public mostrarVirtualNutricion: boolean = false;
  public mostrarVirtualMuscular: boolean = false;
  public activarMensajeExitoso: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiGatewayBackendService: ApiGatewayBackendService,
    private alimentacionService: AlimentacionService
  ) {
  }

  ngOnInit() {
    this.alimentacionForm = this.formBuilder.group({
      proveedor: ["", [Validators.required]],
      proposito: ["", [Validators.required]],
      tipoAlimentacion: ["", [Validators.required]],
      modoRecibir: ["", [Validators.required]],
      numeroContacto: ["", [Validators.required]],
      direccionActual: ["", [Validators.required]],
      ciudadActual: ["", [Validators.required]],
      paisActual: ["", [Validators.required]]
    })
  }

  validarFormulario() {
    if (!this.proveedor || !this.proposito || !this.tipoAlimentacion || !this.modoRecibir || !this.numeroContacto || !this.direccionActual || !this.ciudadActual || !this.paisActual) {
      this.activarMensajeExitoso = true;
      this.mensaje = this.mensajeError;
      return false;
    }

    this.solicitarAlimentacion();
    return true;
  }

  solicitarAlimentacion(): void {
    this.mensaje = '';
    if (this.modoRecibir == 'virtual') {
      this.activarMensajeExitoso = true;
      if (this.proposito == 'nutricion') {
        this.mostrarVirtualMuscular = false;
        this.mostrarVirtualNutricion = true;
        this.mensaje = this.mensajeVirtual;
      } else if (this.proposito == 'muscular') {
        this.mostrarVirtualNutricion = false;
        this.mostrarVirtualMuscular = true;
        this.mensaje = this.mensajeVirtual;
      }
    } else if (this.modoRecibir == 'domicilio') {
      this.mostrarVirtualNutricion = false;
      this.mostrarVirtualMuscular = false;
      this.activarMensajeExitoso = true;
      this.mensaje = this.mensajeDomicilio;
    }
    console.log(this.imprimirDatos())

    let alimentacion = new Alimentacion(this.proveedor, this.proposito, this.tipoAlimentacion, this.modoRecibir, this.numeroContacto, this.direccionActual, this.ciudadActual, this.paisActual)
    console.log(alimentacion)

    this.apiGatewayBackendService.solicitarAlimentacion(alimentacion).subscribe((result: any) => {
      console.log('Response: ', result)
      console.info(this.mensajeDomicilio, result)
      this.activarMensajeExitoso = true;
    })
  }

  imprimirDatos(): any {
    return {
      proveedor: this.proveedor,
      proposito: this.proposito,
      tipoAlimentacion: this.tipoAlimentacion,
      modoRecibir: this.modoRecibir,
      numeroContacto: this.numeroContacto,
      direccionActual: this.direccionActual,
      ciudadActual: this.ciudadActual,
      paisActual: this.paisActual
    }
  }
}
