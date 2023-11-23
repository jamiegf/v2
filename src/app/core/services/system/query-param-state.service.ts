import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/core/services/system/history.service';
import { WindowService } from 'src/app/core/services/system/window.service';

@Injectable({
  providedIn: 'root',
})
export class QueryParamStateService {
  constructor(
    private history: HistoryService,
    private route: ActivatedRoute,
    private window: WindowService,
  ) {}

  public getQueryParam(key: string): string | null {
    return this.route.snapshot.queryParamMap.get(key);
  }

  public getQueryParams(keys: string[]): Record<string, string | null> {
    return keys.reduce<Record<string, string | null>>((map, key) => {
      map[key] = this.route.snapshot.queryParamMap.get(key);
      return map;
    }, {});
  }

  public setQueryParam(key: string, value: string): void {
    const url = this.window.url;
    const params: URLSearchParams = new URLSearchParams(url.searchParams);
    params.set(key, value);
    const newUrl = new URL(`?${params}`, url);
    this.history.replaceState(newUrl);
  }
}
