import { Injectable } from '@angular/core';
import { Subject, map, merge, scan } from 'rxjs';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';

@Injectable({
  providedIn: 'root',
})
export class ScoringInfoService {
  private toggleScoreInfo$ = new Subject<null>();

  public scoringInfo$ = this.activePoolService.poolDetails$.pipe(
    map((pd) => pd?.scoringInfo),
  );

  public showScoreInfo$ = merge(this.toggleScoreInfo$, this.scoringInfo$).pipe(
    scan(
      (state: scoringInfoState, stream) => {
        if (stream === null) {
          state.display = !state.display;
        } else {
          state.scoreInfo = stream;
        }
        if (state.scoreInfo === undefined) state.display = false;
        return state;
      },
      { scoreInfo: undefined, display: false },
    ),
    map((state) => state.display),
  );

  constructor(private activePoolService: ActivePoolService) {}

  public toggleScoreInfo(): void {
    this.toggleScoreInfo$.next(null);
  }
}

interface scoringInfoState {
  scoreInfo: string[] | undefined;
  display: boolean;
}
