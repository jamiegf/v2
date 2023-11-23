import { Injectable, inject } from '@angular/core';
import { PoolInfoService } from './pool-info.service';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private poolInfoService = inject(PoolInfoService);

  constructor() {}

  public getPoolsByTournament$(tournament: string) {
    return this.poolInfoService.poolInfo$.pipe(
      map((poolInfo) => poolInfo?.filter((pi) => pi.tournament === tournament)),
      shareReplay(1),
    );
  }
}
