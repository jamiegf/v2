import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from './calendar.service';
import { RouterModule } from '@angular/router';
import { CalendarEventComponent } from './calendar-event/calendar-event.component';
import { FormatStringDatePipe } from 'src/app/core/pipes/format-string-date.pipe';

@Component({
  selector: 'mipools-front-end-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, CalendarEventComponent, FormatStringDatePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  public calendarService = inject(CalendarService);

  goToEvent() {
    alert("Open Event");
  }

  goToTournament() {
    alert("Open Tournament");
  }

}
