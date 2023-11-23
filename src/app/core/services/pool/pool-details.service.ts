import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, shareReplay, tap } from 'rxjs';
import { GameEnginePoolDetails } from 'src/app/core/models/pool/pool-details/game-engine-pool-details.interface';
import {
  PoolDetails,
  convertGameEngineDetailsToInterface,
} from 'src/app/core/models/pool/pool-details/pool-details.interface';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { MiddlewareRequestService } from 'src/app/core/services/system/middleware-request.service';
import { Logger } from 'src/app/lib/logger';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PoolDetailsService {
  constructor(private middlewareRequestService: MiddlewareRequestService) {}

  public getPoolDetails$(
    poolInfo: PoolInfo,
  ): Observable<PoolDetails | undefined> {
    return combineLatest(
      poolInfo.gameConfigurationIds.map((gcId) =>
        this.fetchPoolDetails(poolInfo.gameId, gcId),
      ),
    ).pipe(
      map((gameEnginePoolDetails) => {
        const detailsArray = gameEnginePoolDetails.reduce<
          { gcId: string; details: GameEnginePoolDetails }[]
        >((array, details, index) => {
          if (!(details instanceof Error)) {
            array.push({
              gcId: poolInfo.gameConfigurationIds[index],
              details: details,
            });
          }
          return array;
        }, []);
        return convertGameEngineDetailsToInterface(detailsArray);
      }),
      tap((details) =>
        Logger.getLogger().debug(['Parsed pool details', details]),
      ),
      shareReplay(1),
    );
  }

  private fetchPoolDetails(
    gameId: string,
    gcId: string,
  ): Observable<GameEnginePoolDetails | Error> {
    return this.middlewareRequestService
      .post<GameEnginePoolDetails>(environment.api.middleware.getPoolDetails, {
        game_id: gameId,
        gameconfiguration_id: gcId,
      })
      .pipe(
        tap((details) =>
          Logger.getLogger().debug([
            `game engine pool details ${gcId}:`,
            details,
          ]),
        ),
      );
  }
}
