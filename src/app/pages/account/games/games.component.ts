import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import {
  BehaviorSubject,
  Observable,
  map,
  share,
  shareReplay,
  tap,
} from 'rxjs';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { PoolStatus } from 'src/app/core/models/pool/pool-status.type';
import { FetchPoolInfoService } from 'src/app/core/services/pool/fetch-pool-info.service';
import { QueryParamStateService } from 'src/app/core/services/system/query-param-state.service';
import { PoolCardContainerComponent } from 'src/app/shared/pool-card-container/pool-card-container.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mipools-front-end-games',
  standalone: true,
  imports: [CommonModule, PoolCardContainerComponent, RouterModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
})
export class GamesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly queryParamStateService = inject(QueryParamStateService);

  private fetchPoolInfoService = inject(FetchPoolInfoService);
  private readonly allPools$ = this.fetchPoolInfoService
    .fetchPlayerAccountPoolInfo$()
    .pipe(
      map((pools) => pools || []),
      share(),
    );

  public readonly livePools$: Observable<PoolInfo[]> = this.allPools$.pipe(
    map((pools) =>
      pools
        .filter((pool) => pool.statusMap[PoolStatus.live])
        .sort((a, b) => a.closeDate.getTime() - b.closeDate.getTime()),
    ),
    shareReplay(1),
  );

  public readonly upcomingPools$: Observable<PoolInfo[]> = this.allPools$.pipe(
    map((pools) =>
      pools
        .filter((pool) => pool.statusMap[PoolStatus.upcoming])
        .sort((a, b) => a.closeDate.getTime() - b.closeDate.getTime()),
    ),
    shareReplay(1),
  );

  public readonly completedPools$: Observable<[string, PoolInfo[]][]> =
    this.allPools$.pipe(
      map((pools) => {
        pools = pools.sort(
          (a, b) => b.closeDate.getTime() - a.closeDate.getTime(),
        );
        return Object.entries(
          pools?.reduce<Record<string, PoolInfo[]>>(
            (completedPoolsMap, pool) => {
              if (pool.statusMap[PoolStatus.completed]) {
                const month = format(pool.closeDate, 'LLLL');
                const poolArray = completedPoolsMap[month] || [];
                poolArray.push(pool);
                completedPoolsMap[month] = poolArray;
              }
              return completedPoolsMap;
            },
            {},
          ),
        );
      }),
      shareReplay(1),
    );

  private readonly _selectedStatus$ = new BehaviorSubject<AccountStatus>(
    this.getStartingStatus(),
  );

  public selectedStatus$ = this._selectedStatus$.pipe(
    tap((status) => {
      this.queryParamStateService.setQueryParam('status', status);
    }),
  );

  public title$ = this.selectedStatus$.pipe(
    map((status) => {
      switch (status) {
        case 'in_progress':
          return 'live';
        case 'open':
          return 'upcoming';
        case 'settled':
          return 'completed';
      }
    }),
  );

  private getStartingStatus(): AccountStatus {
    const status = this.queryParamStateService.getQueryParam('status');
    if (
      status &&
      (status === PoolStatus.upcoming ||
        status === PoolStatus.live ||
        status === PoolStatus.completed)
    ) {
      return status;
    } else {
      return PoolStatus.live;
    }
  }

  public setStatus(status: AccountStatus): void {
    this._selectedStatus$.next(status);
  }
}

type AccountStatus = Omit<typeof PoolStatus, 'available'>[keyof Omit<
  typeof PoolStatus,
  'available'
>];