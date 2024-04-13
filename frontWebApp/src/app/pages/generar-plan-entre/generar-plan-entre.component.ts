import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {CalendarComponent} from '../../shared/components/calendar/calendar.component';
import {HorizontalCardComponent} from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import {SidebardComponent} from '../../shared/components/sidebard/sidebard.component';
import {RouterLinkWithHref} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {PlanEntrenamiento} from './plan-entrenamiento';
import {PlanEntrenamientoService} from './plan-entrenamiento.service';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-generar-plan-entre',
  standalone: true,
  imports: [SidebardComponent, RouterLinkWithHref, HeaderComponent, CalendarComponent, HorizontalCardComponent, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './generar-plan-entre.component.html',
  styleUrl: './generar-plan-entre.component.scss'
})
export class GenerarPlanEntreComponent implements OnInit {

  planEntrenamientoForm!: FormGroup;
  public deporte: string = '';
  public nombre: string = '';
  public usuario: string = '';
  public cantidadEntrenamientos: number = 0;
  public distanciaPorEntrenamientos: number = 0;
  public fechas: string = '';
  public personalizado: boolean = false;
  public planSeleccionado: string = '';
  public planes: any = ['Plan de entrenamiento recomendado - Básico', 'Plan de entrenamiento recomendado - Avanzado', 'Plan de entrenamiento personalizado']

  constructor(
    private formBuilder: FormBuilder,
    private planEntrenamientoService: PlanEntrenamientoService
  ) {
  }

  radioChangeHandler(event: any) {
    this.planSeleccionado = event.target.value;
    this.personalizado = this.planSeleccionado == 'Plan de entrenamiento personalizado';
  }

  ngOnInit() {
    this.planEntrenamientoForm = this.formBuilder.group({
      deporte: ["", [Validators.required]],
      nombre: ["", [Validators.required]],
      cantidadEntrenamientos: ["", [Validators.required]],
      distanciaPorEntrenamientos: ["", [Validators.required]],
      fechas: ["", [Validators.required]]
    })
  }

  generarPlanEntrenamiento() {
    console.log(this.imprimirDatos())

    if (this.planSeleccionado != 'Plan de entrenamiento personalizado' && this.planSeleccionado == 'Plan de entrenamiento recomendado - Básico') {
      this.cantidadEntrenamientos = 2;
      this.distanciaPorEntrenamientos = 5;
      this.fechas = this.sumarDiasAFecha(this.cantidadEntrenamientos);
    } else if (this.planSeleccionado != 'Plan de entrenamiento personalizado' && this.planSeleccionado == 'Plan de entrenamiento recomendado - Avanzado') {
      this.cantidadEntrenamientos = 5;
      this.distanciaPorEntrenamientos = 15;
      this.fechas = this.sumarDiasAFecha(this.cantidadEntrenamientos);
    } else if (this.planSeleccionado == 'Plan de entrenamiento personalizado') {
      this.fechas = this.sumarDiasAFecha(this.cantidadEntrenamientos);
    }

    this.usuario = 'Pedro'; // OJO: Usuario quemado

    let planEntrenamiento = new PlanEntrenamiento(this.deporte, this.nombre, this.usuario, this.cantidadEntrenamientos, this.distanciaPorEntrenamientos, this.fechas)
    console.log(planEntrenamiento)

    this.planEntrenamientoService.generarPlanEntrenamiento(planEntrenamiento).subscribe((result: any) => {
      console.info("El plan de entrenamiento fue generado con éxito", result)
      this.planEntrenamientoForm.reset();
    })
  }

  sumarDiasAFecha(dias: number): string {
    const fechaBase = new Date();
    let fechasString = '';
    for (let i = 1; i <= dias; i++) {
      const fechaSumada = new Date(fechaBase);
      fechaSumada.setDate(fechaSumada.getDate() + i);
      const anio = fechaSumada.getFullYear();
      const mes = String(fechaSumada.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaSumada.getDate()).padStart(2, '0');
      const fechaString = `${anio}/${mes}/${dia}`;
      fechasString += "'" + fechaString + "', ";
    }

    return fechasString.trim().slice(0, -1);
  }

  imprimirDatos() {
    return {
      deporte: this.deporte,
      nombre: this.nombre,
      usuario: this.usuario,
      cantidadEntrenamientos: this.cantidadEntrenamientos,
      distanciaPorEntrenamientos: this.distanciaPorEntrenamientos,
      fechas: this.fechas
    }
  }
}
