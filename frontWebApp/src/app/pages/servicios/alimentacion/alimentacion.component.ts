import {Component, OnInit} from '@angular/core';
import {SidebardComponent} from '../../../shared/components/sidebard/sidebard.component';
import {HeaderComponent} from '../../../shared/components/header/header.component';
import {RouterLinkWithHref} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {AlimentacionService} from "./alimentacion.service";
import {Alimentacion} from "./alimentacion";


@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent, RouterLinkWithHref, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './alimentacion.component.html',
  styleUrl: './alimentacion.component.scss'
})
export class AlimentacionComponent implements OnInit {

  alimentacionForm!: FormGroup;
  public tipoAlimentacion: string = '';
  public numeroContacto: number = 0;
  public paisActual: string = '';
  public ciudadActual: string = '';
  public direccionActual: string = '';
  public mensajeExitoso: string = 'La solicitud del servicio de alimentación fue realizada con éxito!';
  public activarMensajeExitoso: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private alimentacionService: AlimentacionService
  ) {
  }

  ngOnInit() {
    this.alimentacionForm = this.formBuilder.group({
      tipoAlimentacion: ["", [Validators.required]],
      numeroContacto: [0, [Validators.required]],
      paisActual: ["", [Validators.required]],
      ciudadActual: ["", [Validators.required]],
      direccionActual: ["", [Validators.required]],
    })
  }

  solicitarAlimentacion(): void {
    console.log(this.imprimirDatos())

    let alimentacion = new Alimentacion(this.tipoAlimentacion, this.numeroContacto, this.paisActual, this.ciudadActual, this.direccionActual)
    console.log(alimentacion)

    this.alimentacionService.solicitarAlimentacion(alimentacion).subscribe((result: any) => {
      console.log('Response: ', result)
      console.info(this.mensajeExitoso, result)
      this.activarMensajeExitoso = true;
    })
  }

  imprimirDatos(): any {
    return {
      tipoAlimentacion: this.tipoAlimentacion,
      numeroContacto: this.numeroContacto,
      paisActual: this.paisActual,
      ciudadActual: this.ciudadActual,
      direccionActual: this.direccionActual
    }
  }
}
