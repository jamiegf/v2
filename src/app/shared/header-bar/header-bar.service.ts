import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map, shareReplay, switchMap } from 'rxjs';
import { ConfigService } from 'src/app/core/services/system/config.service';
import { Logger } from 'src/app/lib/logger';

@Injectable({
  providedIn: 'root',
})
export class HeaderBarService {
  private routeRegularExpressions$ = this.configService.config.pipe(
    map((config) => {
      return config.routesThatDisableHeaderBar.reduce<RegExp[]>((arr, curr) => {
        try {
          arr.push(new RegExp(curr));
        } catch (error) {
          Logger.getLogger().error(
            new Error(`Error with regex ${curr}`, { cause: config }),
          );
        }
        return arr;
      }, []);
    }),
    shareReplay(1),
  );

  public displayHeader: Observable<boolean> = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    switchMap((event) => {
      return this.routeRegularExpressions$.pipe(
        map((regexes) => {
          for (let i = 0; i < regexes.length; i++) {
            if (regexes[i].test(event.url)) return false;
          }
          return true;
        }),
      );
    }),
    shareReplay(1),
  );

  constructor(
    private configService: ConfigService,
    private router: Router,
  ) {}
}
