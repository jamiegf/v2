import { Injectable } from '@angular/core';
import { Observable, combineLatest, lastValueFrom, map, take } from 'rxjs';
import { MiddlewareRequestService } from 'src/app/core/services/system/middleware-request.service';
import { Logger } from 'src/app/lib/logger';
import { transformToError } from 'src/app/lib/transform-to-error';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { DoubleUpService } from 'src/app/pages/pool/double-up.service';
import { EntryService } from 'src/app/pages/pool/entry.service';
import { QuestionService } from 'src/app/pages/pool/question.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnterPoolService {
  constructor(
    private activePoolService: ActivePoolService,
    private questionService: QuestionService,
    private doubleUpService: DoubleUpService,
    private entryService: EntryService,
    private middlewareRequestService: MiddlewareRequestService,
  ) {}

  public async enterPool() {
    const requests = await this.createRequests();
    if (requests instanceof Error) {
      Logger.getLogger().error(requests);
      return undefined;
    }
    const results: EnterPoolResult[] = [];
    for (const request of requests) {
      results.push(await this.makeEnterPoolRequest(request));
    }
    this.resetState(results);
    return results;
  }

  private async createRequests(): Promise<Error | EnterPoolRequest[]> {
    try {
      const currentState = await lastValueFrom(
        combineLatest({
          completedQuestionAndAnswerIds:
            this.questionService.completedQuestionAndAnswerIds$,
          paymentMethod: this.entryService.selectedPaymentMethod$,
          selectedConfigurations: this.entryService.configurations$.pipe(
            map((configs) => configs.filter((config) => config.selected)),
          ),
          doubleUpQuestion: this.doubleUpService.selectedQuestion$,
          poolDetails: this.activePoolService.poolDetails$,
        }).pipe(take(1)),
      );
      const [completedQuestionAndAnswerIds, poolDetails] = [
        currentState.completedQuestionAndAnswerIds,
        currentState.poolDetails,
      ];

      if (!poolDetails || !completedQuestionAndAnswerIds) {
        return new Error('no pool currently active', {
          cause: { poolDetails },
        });
      }

      if (
        poolDetails.doubleUpQuestion &&
        currentState.doubleUpQuestion === undefined
      ) {
        return new Error('Double question is required', {
          cause: { doubleUpQuestion: currentState.doubleUpQuestion },
        });
      }

      if (currentState.selectedConfigurations.length === 0) {
        return new Error('No currently selected entry configurations', {
          cause: { entries: currentState.selectedConfigurations },
        });
      }

      return currentState.selectedConfigurations.map<EnterPoolRequest>(
        (config) => {
          const shared: SharedEnterPoolRequestData = {
            enterWithPoints: currentState.paymentMethod === 'points',
            gameId: poolDetails.gameId,
            gameConfigurationId: config.details.id,
            joinPJ: false, // TODO
          };
          if (
            poolDetails.gameType === 'predictor' ||
            poolDetails.gameType === 'fantasy'
          ) {
            return {
              ...shared,
              answerIds: completedQuestionAndAnswerIds[1],
              doubleUpQuestion: currentState.doubleUpQuestion,
              questionIds: completedQuestionAndAnswerIds[0],
            };
          } else if (poolDetails.gameType === 'survivor') {
            return {
              ...shared,
              answer: completedQuestionAndAnswerIds[1][0],
            };
          } else {
            throw new Error('unrecognised game type');
          }
        },
      );
    } catch (error) {
      return transformToError(error);
    }
  }

  private resetState(enterPoolResults: EnterPoolResult[]): void {
    let allSuccessful = true;
    enterPoolResults.forEach((result, index) => {
      if ('seatId' in result) {
        this.entryService.selectConfiguration(index);
      } else {
        allSuccessful = false;
      }
    });

    if (allSuccessful) {
      this.questionService.clearQuestions();
      this.doubleUpService.clearDoubleUp();
    }
  }

  private async makeEnterPoolRequest(requestData: EnterPoolRequest) {
    if ('answer' in requestData) {
      return await lastValueFrom(this.enterSurvivorPool(requestData));
    } else if ('answerIds' in requestData) {
      return await lastValueFrom(this.enterFantasyOrPredictorPool(requestData));
    } else {
      throw new Error('Unrecognised pool request');
    }
  }

  private enterSurvivorPool(
    requestData: EnterSurvivorPoolRequest,
  ): Observable<EnterPoolResult> {
    return this.middlewareRequestService
      .post<EnterPoolResponse>(environment.api.middleware.enterPoolSurvivor, {
        game_id: requestData.gameId,
        gameconfiguration_id: requestData.gameConfigurationId,
        join_progressive_jackpot: requestData.joinPJ ? '1' : '0',
        enter_with_points: requestData.enterWithPoints ? '1' : '0',
        answer: requestData.answer,
      })
      .pipe(
        map((response) => {
          if (response instanceof Error) {
            return {
              gameId: requestData.gameId,
              gameConfigurationId: requestData.gameConfigurationId,
              error: response.message,
            };
          } else {
            return {
              gameId: response.game_id,
              gameConfigurationId: response.gameconfiguration_id,
              seatId: response.seat_id,
            };
          }
        }),
      );
  }

  private enterFantasyOrPredictorPool(
    requestData: EnterFantasyOrPredictorPoolRequest,
  ): Observable<EnterPoolResult> {
    return this.middlewareRequestService
      .post<EnterPoolResponse>(environment.api.middleware.enterPool, {
        game_id: requestData.gameId,
        gameconfiguration_id: requestData.gameConfigurationId,
        join_progressive_jackpot: requestData.joinPJ ? '1' : '0',
        enter_with_points: requestData.enterWithPoints ? '1' : '0',
        banker_id: requestData.doubleUpQuestion || '',
        answerQ: requestData.questionIds.toString(),
        answerR: requestData.answerIds.toString(),
      })
      .pipe(
        map((response) => {
          if (response instanceof Error) {
            return {
              gameId: requestData.gameId,
              gameConfigurationId: requestData.gameConfigurationId,
              error: response.message,
            };
          } else {
            return {
              gameId: response.game_id,
              gameConfigurationId: response.gameconfiguration_id,
              seatId: response.seat_id,
            };
          }
        }),
      );
  }
}

interface SharedEnterPoolRequestData {
  gameId: string;
  gameConfigurationId: string;
  enterWithPoints: boolean;
  joinPJ: boolean;
}

interface EnterSurvivorPoolRequest extends SharedEnterPoolRequestData {
  answer: string;
}

interface EnterFantasyOrPredictorPoolRequest
  extends SharedEnterPoolRequestData {
  doubleUpQuestion?: string;
  answerIds: string[];
  questionIds: string[];
}

type EnterPoolRequest =
  | EnterFantasyOrPredictorPoolRequest
  | EnterSurvivorPoolRequest;

interface EnterPoolResponse {
  errors: unknown[];
  success: boolean;
  game_id: string;
  gameconfiguration_id: string;
  seat_id: string;
  duration: number;
}

type EnterPoolResultShared = {
  gameId: string;
  gameConfigurationId: string;
};

export type SuccessfulEnterPoolResult = EnterPoolResultShared & {
  seatId: string;
};

export type FailedEnterPoolResult = EnterPoolResultShared & {
  error: string;
};
export type EnterPoolResult = SuccessfulEnterPoolResult | FailedEnterPoolResult;
