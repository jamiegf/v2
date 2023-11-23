import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../calendar.service';
import { CategoryIconPipe } from 'src/app/core/pipes/category-icon.pipe';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'mipools-front-end-calendar-event[calendarEvent]',
  standalone: true,
  imports: [CommonModule, CategoryIconPipe],
  templateUrl: './calendar-event.component.html',
  styleUrl: './calendar-event.component.scss',
})
export class CalendarEventComponent implements OnInit {
  @Input() calendarEvent!: CalendarEvent;

  private fantasyCount$!: Observable<number | undefined>;
  private survivorCount$!: Observable<number | undefined>;
  public poolsCircleBackground$!: Observable<string | undefined>;

  ngOnInit(): void {
    this.fantasyCount$ = this.calendarEvent.tournamentPools.pipe(
      map(
        (pools) => pools?.filter((pool) => pool.gameType === 'fantasy').length,
      ),
    );
    this.survivorCount$ = this.calendarEvent.tournamentPools.pipe(
      map(
        (pools) => pools?.filter((pool) => pool.gameType === 'survivor').length,
      ),
    );
    this.poolsCircleBackground$ = combineLatest({
      fantasy: this.fantasyCount$,
      survivor: this.survivorCount$,
      total: this.calendarEvent.tournamentPools.pipe(
        map((pools) => pools?.length),
      ),
    }).pipe(
      map((stream) => {
        if (stream.fantasy === undefined || stream.survivor === undefined || stream.total === undefined){
          return undefined;
        }
        const fantasyPercentage = Math.round((stream.fantasy / stream.total * 100));
        const survivorPercentage = Math.round((stream.survivor / stream.total) * 100);
        return `conic-gradient(rgb(50, 182, 194) ${survivorPercentage}%, rgb(208, 95, 180) 0 ${fantasyPercentage + survivorPercentage}%, rgb(237, 116, 30) 0)`;
      }),
    );
  }
}
