import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {CalendarComponent} from '../../shared/components/calendar/calendar.component';
import {HorizontalCardComponent} from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import {SidebardComponent} from '../../shared/components/sidebard/sidebard.component';
import {RouterLinkWithHref} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PlanEntrenamiento} from './plan-entrenamiento';
import {PlanEntrenamientoService} from './plan-entrenamiento.service';

@Component({
  selector: 'app-generar-plan-entre',
  standalone: true,
  imports: [SidebardComponent, RouterLinkWithHref, HeaderComponent, CalendarComponent, HorizontalCardComponent],
  templateUrl: './generar-plan-entre.component.html',
  styleUrl: './generar-plan-entre.component.scss'
})
export class GenerarPlanEntreComponent implements OnInit {

  planEntrenamientoForm!: FormGroup;

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

  generarPlanEntrenamiento(planEntrenamiento: PlanEntrenamiento) {
    planEntrenamiento = new PlanEntrenamiento(
      1,
      "atletismo",
      "juan",
      1,
      1)
    this.planEntrenamientoService.generarPlanEntrenamiento(planEntrenamiento).subscribe((result) => {
      console.info("El plan de entrenamiento fue generado", result)
      this.planEntrenamientoForm.reset();
    })
  }
}
