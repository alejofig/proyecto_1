import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebardComponent } from '../../shared/components/sidebard/sidebard.component';
import { HorizontalCardComponent } from '../../shared/components/cards/horizontal-card/horizontal-card.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';


@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [HeaderComponent, SidebardComponent, HorizontalCardComponent, CalendarComponent],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent {

}
