import {Component, OnInit} from '@angular/core';
import {SidebardComponent} from '../../../shared/components/sidebard/sidebard.component';
import {HeaderComponent} from '../../../shared/components/header/header.component';
import {RouterLinkWithHref} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {EntrenadorService} from "./entrenador.service";
import {Entrenador} from "./entrenador";

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
  public mensajeExitoso: string = 'La sesión virtual con el proveedor seleccionado ha sido agendada con éxito!';
  public activarMensajeExitoso: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
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

  solicitarSesionEntrenador(): void {
    this.activarMensajeExitoso = true;
    console.log(this.imprimirDatos())

    let entrenador = new Entrenador(this.proveedor, this.tipoEntrenamiento, this.fechaSesion, this.horaSesion, this.comentarios)
    console.log(entrenador)

    this.entrenadorService.solicitarSesionEntrenador(entrenador).subscribe((result: any) => {
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
