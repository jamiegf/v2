import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GameType } from 'src/app/core/models/pool/game-type.type';
import { FormatDatePipe } from 'src/app/core/pipes/format-date.pipe';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { ScoringInfoService } from 'src/app/pages/pool/qa/scoring-info.service';
import {
  QuestionService,
  QuestionView,
} from 'src/app/pages/pool/question.service';

@Component({
  selector: 'mipools-front-end-pool-details',
  standalone: true,
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './pool-details.component.html',
  styleUrls: ['./pool-details.component.scss'],
})
export class PoolDetailsComponent {
  constructor(
    public activePoolService: ActivePoolService,
    public questionService: QuestionService,
    public scoringInfoService: ScoringInfoService,
  ) {}

  public poolHeaderData$ = this.activePoolService.poolData$.pipe(
    map((poolData): PoolHeaderData | undefined => {
      if (!poolData) return undefined;
      return {
        closeDate: poolData.poolInfo.closeDate,
        endDate: poolData.poolInfo.endDate,
        gameType: poolData.poolDetails.gameType,
        title: poolData.poolInfo.eventTitle,
      };
    }),
  );

  public questionViewToggleOption$: Observable<
    QuestionViewToggleOption | undefined
  > = this.questionService.questionView$.pipe(
    map((questionView) => {
      switch (questionView) {
        case 'list':
          return {
            value: 'stepper',
            text: 'show step view',
          };
        case 'stepper':
          return {
            value: 'list',
            text: 'show list view',
          };
        default:
          return undefined;
      }
    }),
  );
}

interface QuestionViewToggleOption {
  value: QuestionView;
  text: string;
}

export interface PoolHeaderData {
  closeDate: Date;
  endDate: Date;
  gameType: GameType;
  title: string;
}
