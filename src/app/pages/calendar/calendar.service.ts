import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { TournamentService } from 'src/app/core/services/pool/tournaments.service';
import { Logger } from 'src/app/lib/logger';
import { transformToError } from 'src/app/lib/transform-to-error';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private tournamentService = inject(TournamentService);
  public calendar$: Observable<Calendar | undefined>;

  constructor(private httpClient: HttpClient) {
    this.calendar$ = this.fetchCalendar$();
  }

  private fetchCalendar$(): Observable<Calendar | undefined> {
    return this.httpClient
      .get<CalendarMonthDetails[]>('/assets/data/calendar.json')
      .pipe(
        catchError((error) => {
          Logger.getLogger().error(transformToError(error));
          return of(undefined);
        }),
        map((calendarMonths) => {
          return calendarMonths?.map<CalendarMonth>((calendarMonth) => {
            return {
              ...calendarMonth,
              events: calendarMonth.events.map<CalendarEvent>((event) =>
                this.transformDetailsToEvent(event),
              ),
            };
          });
        }),
        shareReplay(1),
      );
  }

  private transformDetailsToEvent(event: CalendarEventDetails): CalendarEvent {
    if (event.tournamentName) {
      return {
        ...event,
        tournamentPools: this.tournamentService.getPoolsByTournament$(
          event.tournamentName,
        ).pipe(map(pools => {
          if(!pools || pools.length === 0) return undefined;
          else return pools;
        })),
      };
    } else {
      return {
        ...event,
        tournamentPools: of(undefined),
      };
    }
  }
}

type Calendar = CalendarMonth[];

interface CalendarMonthDetails {
  date: string;
  headerImage: string;
  headerLink: string;
  events: CalendarEventDetails[];
}

interface CalendarEventDetails {
  active: boolean;
  dateText: string;
  link: string;
  categoryId: CategoryId;
  titleText: string;
  tournamentName: string;
}

export interface CalendarEvent extends CalendarEventDetails {
  tournamentPools: Observable<PoolInfo[] | undefined>;
}

export interface CalendarMonth extends CalendarMonthDetails {
  events: CalendarEvent[];
}
