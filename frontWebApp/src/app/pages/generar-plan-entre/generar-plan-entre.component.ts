import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { HorizontalCardComponent } from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-generar-plan-entre',
  standalone: true,
  imports: [SidebardComponent, RouterLinkWithHref, HeaderComponent, CalendarComponent, HorizontalCardComponent],
  templateUrl: './generar-plan-entre.component.html',
  styleUrl: './generar-plan-entre.component.scss'
})
export class GenerarPlanEntreComponent {
  // hola
}
