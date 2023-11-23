import { Injectable } from '@angular/core';
import { ReplaySubject, map, of, switchMap, tap } from 'rxjs';
import { PoolDetails } from 'src/app/core/models/pool/pool-details/pool-details.interface';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { PoolDetailsService } from 'src/app/core/services/pool/pool-details.service';
import { PoolInfoService } from 'src/app/core/services/pool/pool-info.service';
import { Logger } from 'src/app/lib/logger';

// TODO rename to single pool data service
@Injectable({
  providedIn: 'root',
})
export class ActivePoolService {
  private readonly poolDataSubject$ = new ReplaySubject<PoolData | undefined>(
    1,
  );
  public readonly poolData$ = this.poolDataSubject$.asObservable();
  public readonly poolDetails$ = this.poolData$.pipe(
    map((poolData) => poolData?.poolDetails),
  );
  public readonly poolInfo$ = this.poolData$.pipe(
    map((poolData) => poolData?.poolInfo),
  );
  public readonly gameType$ = this.poolDetails$.pipe(map((pd) => pd?.gameType));
  public readonly gameId$ = this.poolDetails$.pipe(map((pd) => pd?.gameId));

  constructor(
    private poolInfoService: PoolInfoService,
    private poolDetailsService: PoolDetailsService,
  ) {}

  public setupSinglePoolData(gameId: string) {
    return this.poolInfoService.poolInfo$.pipe(
      map((poolInfo) => poolInfo?.find((pi) => pi.gameId === gameId)),
      switchMap((poolInfo) => {
        if (!poolInfo) return of(undefined);
        return this.poolDetailsService.getPoolDetails$(poolInfo).pipe(
          map((poolDetails) => {
            if (poolDetails === undefined) return undefined;
            return {
              poolDetails,
              poolInfo,
            };
          }),
        );
      }),
      tap((poolData) => {
        if (poolData) Logger.getLogger().debug(['active pool', poolData]);
        this.poolDataSubject$.next(poolData);
      }),
    );
  }
}

export interface PoolData {
  poolDetails: PoolDetails;
  poolInfo: PoolInfo;
}
