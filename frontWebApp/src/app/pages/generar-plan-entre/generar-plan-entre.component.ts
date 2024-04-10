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
  public numeroEntrenamientosSemana: number = 0;
  public objetivoDistanciaEntrenamiento: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private planEntrenamientoService: PlanEntrenamientoService
  ) {
  }

  ngOnInit() {
    this.planEntrenamientoForm = this.formBuilder.group({
      deporte: ["", [Validators.required]],
      nombre: ["", [Validators.required]],
      numeroEntrenamientosSemana: ["", [Validators.required]],
      objetivoDistanciaEntrenamiento: ["", [Validators.required]],
    })
  }

  generarPlanEntrenamiento() {
    console.log(this.imprimirDatos())
    let planEntrenamiento = new PlanEntrenamiento(1, this.deporte, this.nombre, this.numeroEntrenamientosSemana, this.objetivoDistanciaEntrenamiento)
    console.log(planEntrenamiento)
    this.planEntrenamientoService.generarPlanEntrenamiento(planEntrenamiento).subscribe((result) => {
      console.info("El plan de entrenamiento fue generado", result)
      this.planEntrenamientoForm.reset();
    })
  }

  imprimirDatos() {
    return {
      deporte: this.deporte,
      nombre: this.nombre,
      numeroEntrenamientosSemana: this.numeroEntrenamientosSemana,
      objetivoDistanciaEntrenamiento: this.objetivoDistanciaEntrenamiento
    }
  }
}
