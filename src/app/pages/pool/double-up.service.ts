import { Injectable } from '@angular/core';
import {
  Subject,
  combineLatest,
  combineLatestWith,
  map,
  scan,
  shareReplay,
  startWith,
  tap,
} from 'rxjs';
import { PoolDetails } from 'src/app/core/models/pool/pool-details/pool-details.interface';
import { Question } from 'src/app/core/models/pool/pool-details/question/question.type';
import {
  StorageItem,
  StorageService,
} from 'src/app/core/services/system/storage.service';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';

@Injectable({
  providedIn: 'root',
})
export class DoubleUpService {
  private selectQuestion$ = new Subject<string | undefined>();

  public selectedQuestion$ = this.selectQuestion$.pipe(
    startWith(this.loadFromStorage() || ''),
    combineLatestWith(this.activePoolService.poolDetails$),
    scan((state: string | undefined, stream) => {
      const [questionId, poolDetails] = [stream[0], stream[1]];
      if (
        poolDetails === undefined ||
        questionId === state ||
        questionId === undefined
      ) {
        state = undefined;
      } else {
        state = this.validateSelectedQuestion(questionId, poolDetails);
      }
      return state;
    }, undefined),
    tap((questionId) => {
      if (questionId) this.saveToStorage(questionId);
    }),
    shareReplay(1),
  );

  public doubleUpRequired$ = this.activePoolService.poolDetails$.pipe(
    map((pd) => pd?.doubleUpQuestion === true),
  );

  public completed$ = combineLatest([
    this.doubleUpRequired$,
    this.selectedQuestion$,
  ]).pipe(
    map((stream) => {
      if (stream[0]) return stream[1] !== undefined;
      else return true;
    }),
  );

  constructor(
    private activePoolService: ActivePoolService,
    private storageService: StorageService,
  ) {}

  /**
   * validates a question chosen for double up
   * @param questionId selected question
   * @param state double up service state
   * @returns questionId if valid, undefined if not
   */
  private validateSelectedQuestion(
    questionId: string,
    poolDetails: PoolDetails,
  ): string | undefined {
    const validQuestion = poolDetails.questionData.find(
      (questionData) => questionData.id === questionId,
    );
    return validQuestion?.id;
  }

  private saveToStorage(questionId: string): void {
    this.storageService.set(StorageItem.STORED_DOUBLE_UP, questionId);
  }

  private loadFromStorage(): string | null {
    return this.storageService.get(StorageItem.STORED_DOUBLE_UP);
  }

  public selectQuestion(question: Question): boolean {
    if (question.type === 'nearestToPin') return false;
    this.selectQuestion$.next(question.details.id);
    return true;
  }

  public clearDoubleUp(): void {
    this.selectQuestion$.next(undefined);
  }
}
