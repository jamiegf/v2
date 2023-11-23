import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { Logger } from 'src/app/lib/logger';
import { transformToError } from 'src/app/lib/transform-to-error';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly DEFAULT_CONFIG: Config = {
    poolDetailsTimeToLiveMs: 60000,
    routesThatDisableHeaderBar: [],
  };

  public readonly config: Observable<Config> = this.http
    .get<Config | undefined>(environment.configUrl)
    .pipe(
      catchError((error) => {
        Logger.getLogger().error(transformToError(error));
        return of(undefined);
      }),
      map((config) => {
        if (config && config instanceof Object) {
          return {
            ...this.DEFAULT_CONFIG,
            ...config,
          };
        } else {
          return this.DEFAULT_CONFIG;
        }
      }),
      tap((config) => Logger.getLogger().debug([`config:`, config])),
      shareReplay(1),
    );

  constructor(private http: HttpClient) {}
}

export interface Config {
  poolDetailsTimeToLiveMs: number;
  /**
   * String representation of regular expressions
   */
  routesThatDisableHeaderBar: string[];
}
