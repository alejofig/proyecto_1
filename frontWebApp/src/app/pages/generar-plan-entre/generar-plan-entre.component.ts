import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { HorizontalCardComponent } from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { RouterLinkWithHref } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import { PlanEntrenamiento } from './plan-entrenamiento';
import { PlanEntrenamientoService } from './plan-entrenamiento.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

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
    if (this.planSeleccionado == 'Plan de entrenamiento personalizado') {
      this.personalizado = true;
    } else {
      this.personalizado = false;
    }
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
      this.fechas = '2024-04-15, 2024-04-16';
    } else if (this.planSeleccionado != 'Plan de entrenamiento personalizado' && this.planSeleccionado == 'Plan de entrenamiento recomendado - Avanzado') {
      this.cantidadEntrenamientos = 5;
      this.distanciaPorEntrenamientos = 15;
      this.fechas = '2024-04-15, 2024-04-16, 2024-04-17, 2024-04-18, 2024-04-19';
    }

    // const fecha = new Date();
    // let cas = fecha.setDate(fecha.getDate() + 1).toLocaleString();
    // console.log('cam: ' + cam);

    // const newDate = this.addDays(fecha, this.cantidadEntrenamientos);
    // console.log('cat: ' + newDate);

    // let fechasTemp = fecha.toLocaleDateString('en-US');
    // for (let i = 1; i < this.cantidadEntrenamientos; i++) {
    //   fechasTemp = fechasTemp + ', ' + fecha.setDate(fecha.getDate() + i);
    // }
    // console.log(fechasTemp);

    let planEntrenamiento = new PlanEntrenamiento(1, this.deporte, this.nombre, this.cantidadEntrenamientos, this.distanciaPorEntrenamientos, this.fechas)
    console.log(planEntrenamiento)

    this.planEntrenamientoService.generarPlanEntrenamiento(planEntrenamiento).subscribe((result: any) => {
      console.info("El plan de entrenamiento fue generado con éxito", result)
      this.planEntrenamientoForm.reset();
    })
  }

  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  }

  imprimirDatos() {
    return {
      deporte: this.deporte,
      nombre: this.nombre,
      cantidadEntrenamientos: this.cantidadEntrenamientos,
      distanciaPorEntrenamientos: this.distanciaPorEntrenamientos,
      fechas: this.fechas
    }
  }
}
