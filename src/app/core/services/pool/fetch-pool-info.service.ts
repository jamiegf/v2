import { Injectable } from '@angular/core';
import { sub } from 'date-fns';
import { Observable, map } from 'rxjs';
import { GameEnginePoolInfo } from 'src/app/core/models/pool/pool-info/game-engine-pool-info.interface';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { MiddlewareRequestService } from 'src/app/core/services/system/middleware-request.service';
import { Logger } from 'src/app/lib/logger';
import { transformToError } from 'src/app/lib/transform-to-error';
import { environment } from 'src/environments/environment';

const DEFAULT_PLAYER_POOLS_DURATION: Duration = { months: 3 };

@Injectable({
  providedIn: 'root',
})
export class FetchPoolInfoService {
  constructor(private middlewareRequestService: MiddlewareRequestService) {}

  public fetchPublicPoolInfo$(): Observable<PoolInfo[] | undefined> {
    return this.middlewareRequestService
      .post<PoolInfoResponse>(environment.api.middleware.getPublicPoolInfo)
      .pipe(map(mapPoolInfoResponseToPoolInfo));
  }

  public fetchPlayerGeneralPoolInfo$(
    since: Date = sub(new Date(), DEFAULT_PLAYER_POOLS_DURATION),
  ): Observable<PoolInfo[] | undefined> {
    return this.middlewareRequestService
      .post<PoolInfoResponse>(environment.api.middleware.getPlayerPoolInfo, {
        type: 'home',
        since: Math.floor(since.getTime() / 1000).toString(),
      })
      .pipe(map(mapPoolInfoResponseToPoolInfo));
  }

  public fetchPlayerAccountPoolInfo$(
    since: Date = sub(new Date(), DEFAULT_PLAYER_POOLS_DURATION),
  ): Observable<PoolInfo[] | undefined> {
    return this.middlewareRequestService
      .post<PoolInfoResponse>(environment.api.middleware.getPlayerPoolInfo, {
        type: 'account',
        since: Math.floor(since.getTime() / 1000).toString(),
      })
      .pipe(map(mapPoolInfoResponseToPoolInfo));
  }
}

interface PoolInfoResponse {
  LastUpdated: string;
  Pools?: GameEnginePoolInfo[];
  TopPools: unknown;
}

const mapPoolInfoResponseToPoolInfo = (
  response: PoolInfoResponse | Error,
): PoolInfo[] | undefined => {
  if (response instanceof Error || response.Pools === undefined) {
    return undefined;
  } else {
    Logger.getLogger().debug(['pool info response', response.Pools]);
    const poolInfo = parseGameEnginePoolInfo(response.Pools);
    return poolInfo;
  }
};

const parseGameEnginePoolInfo = (
  gePoolInfo: GameEnginePoolInfo[],
): PoolInfo[] => {
  return groupPoolInfo(gePoolInfo).reduce<PoolInfo[]>((array, gePoolInfo) => {
    try {
      array.push(new PoolInfo(gePoolInfo));
    } catch (error) {
      Logger.getLogger().error(transformToError(error));
    }
    return array;
  }, []);
};

const groupPoolInfo = (
  poolInfo: GameEnginePoolInfo[],
): GameEnginePoolInfo[][] => {
  const poolInfoMap = new Map<string, GameEnginePoolInfo[]>();
  poolInfo.forEach((item) => {
    try {
      const array: GameEnginePoolInfo[] = poolInfoMap.get(item.game_id) || [];
      array.push(item);
      poolInfoMap.set(item.game_id, array);
    } catch (error) {
      Logger.getLogger().error(
        new Error(
          `poolInfo is invalid, 
            gameId: ${item.game_id || 'unknown'}, 
            gcId: ${item.gameconfiguration_id || 'unknown'}`,
          { cause: error },
        ),
      );
    }
  });
  return Array.from(poolInfoMap.values());
};
