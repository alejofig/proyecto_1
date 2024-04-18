import { Component } from '@angular/core';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { RouterLinkWithHref } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { HorizontalCardComponent } from '../../shared/components/cards/horizontal-card/horizontal-card.component';

@Component({
  selector: 'app-plan-entrenamiento',
  standalone: true,
  imports: [SidebardComponent, RouterLinkWithHref, HeaderComponent, CalendarComponent, HorizontalCardComponent],
  templateUrl: './plan-entrenamiento.component.html',
  styleUrl: './plan-entrenamiento.component.scss'
})
export class PlanEntrenamientoComponent {

}
