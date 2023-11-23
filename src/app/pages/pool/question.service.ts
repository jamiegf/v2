import { Injectable } from '@angular/core';
import {
  Observable,
  ReplaySubject,
  Subject,
  combineLatest,
  map,
  merge,
  of,
  scan,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { PoolDetails } from 'src/app/core/models/pool/pool-details/pool-details.interface';
import { QuestionData } from 'src/app/core/models/pool/pool-details/question/question-data.interface';
import {
  Question,
  createQuestionFromData,
} from 'src/app/core/models/pool/pool-details/question/question.type';
import { AnswersService } from 'src/app/core/services/pool/answers.service';
import { QueryParamStateService } from 'src/app/core/services/system/query-param-state.service';
import { Logger } from 'src/app/lib/logger';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly setQuestionView$ = new Subject<QuestionView>();
  private readonly setQuestion$ = new Subject<SetQuestion>();
  private readonly poolDetails$ = new ReplaySubject<PoolDetails | undefined>(1);

  public readonly questions$ = this.poolDetails$.pipe(
    map(
      (poolDetails) =>
        poolDetails?.questionData.map((question) => {
          return createQuestionFromData(this.answerService, question);
        }),
    ),
    tap((questions) => Logger.getLogger().debug(['questions:', questions])),
    shareReplay(1),
  );

  public readonly questionView$ = merge(
    this.poolDetails$,
    this.setQuestionView$,
  ).pipe(
    scan((questionView: QuestionView, stream) => {
      if (typeof stream === 'string') {
        questionView = stream;
      } else if (stream !== undefined) {
        questionView = this.getInitialQuestionView(stream);
      } else {
        questionView = 'stepper';
      }
      return questionView;
    }, 'stepper'),
    shareReplay(1),
  );

  public readonly currentQuestionIndex$ = merge(
    this.questions$,
    this.setQuestion$,
  ).pipe(
    scan((questionIndex: number, stream) => {
      if (stream === 'next') {
        questionIndex += 1;
      } else if (stream === 'previous') {
        questionIndex -= 1;
      } else if (typeof stream === 'number') {
        questionIndex = stream;
      } else {
        questionIndex = this.getInitialQuestionNumber(stream);
      }
      return questionIndex;
    }, 0),
    shareReplay(1),
  );

  public readonly listViewIndex$: Observable<number | undefined> = merge(
    this.setQuestion$,
    this.questionView$,
  ).pipe(
    scan((state: undefined | number, stream) => {
      if (stream === 'next' && state) {
        state += 1;
      } else if (stream === 'previous' && state) {
        state -= 1;
      } else if (typeof stream === 'number') {
        if (state === stream) state = undefined;
        else state = stream;
      } else {
        state = undefined;
      }
      return state;
    }, undefined),
  );

  public readonly currentQuestionNumber$ = this.currentQuestionIndex$.pipe(
    map((index) => (index !== undefined ? index + 1 : undefined)),
    tap((index) => {
      if (index !== undefined) {
        this.queryParamStateService.setQueryParam('question', index.toString());
      }
    }),
  );

  public readonly questionCount$ = this.questions$.pipe(
    map((questions) => questions?.length),
  );

  public readonly lastQuestionIndex$ = this.questions$.pipe(
    map((questions) => {
      if (questions === undefined) return -1;
      for (let i = questions?.length - 1; i >= 0; i--) {
        if (!questions[i].details.locked) return i;
      }
      return 0;
    }),
  );

  public readonly completed$ = this.questions$.pipe(
    switchMap((questions) => {
      if (questions === undefined) return of(false);
      questions = questions.filter((question) => !question.details.locked);
      return combineLatest(questions.map((question) => question.answer$)).pipe(
        map((answers) => answers.every((answer) => answer !== undefined)),
      );
    }),
    shareReplay(1),
  );

  public readonly actionButtonState$: Observable<ActionButtonState> =
    combineLatest({
      questionView: this.questionView$,
      currentIndex: this.currentQuestionIndex$,
      poolDetails: this.poolDetails$,
    }).pipe(
      map((stream) => {
        if (!stream.poolDetails) return 'next';
        if (stream.poolDetails.gameType === 'survivor') return 'complete';
        switch (stream.questionView) {
          case 'stepper':
            if (
              this.isLastQuestion(
                stream.currentIndex,
                stream.poolDetails.questionData,
              )
            ) {
              return 'complete';
            } else {
              return 'next';
            }
          case 'list':
            return 'complete';
          case 'coupon':
            return 'complete';
        }
      }),
      shareReplay(1),
    );

  public currentQuestion$ = combineLatest({
    questions: this.questions$,
    currentIndex: this.currentQuestionIndex$,
  }).pipe(
    map((stream) => stream.questions?.at(stream.currentIndex)),
    shareReplay(1),
  );

  public readonly completedQuestionAndAnswerIds$ = this.questions$.pipe(
    switchMap((rawQuestions) => {
      const questions = rawQuestions?.filter(
        (question) => !question.details.locked,
      );
      if (!questions) return of(undefined);
      return combineLatest(questions.map((question) => question.answer$)).pipe(
        map((answers) => {
          if (answers.every((answer) => answer !== undefined)) {
            return [
              questions.map((question) => question.details.id),
              answers,
            ] as [string[], string[]];
          } else {
            return undefined;
          }
        }),
      );
    }),
  );

  /**
   * counts forward from index to determine if index is last unlocked question
   * @param index index to check
   * @param questions questions to check against
   * @returns boolean
   */
  private isLastQuestion(index: number, questions: QuestionData[]): boolean {
    if (questions[index].locked) return false;
    for (let i = index + 1; i < questions.length; i++) {
      if (!questions[i].locked) {
        return false;
      }
    }
    return true;
  }

  constructor(
    private answerService: AnswersService,
    private queryParamStateService: QueryParamStateService,
  ) {}

  /**
   * Returns question view type based on pool details params, should be used to display custom QA screens
   * @param poolDetails
   */
  private getInitialQuestionView(poolDetails: PoolDetails): QuestionView {
    if (poolDetails.coupon) return 'coupon';
    else return 'stepper';
  }

  private getInitialQuestionNumber(questions: Question[] | undefined): number {
    if (!questions) return 0;
    const queryIndex = this.queryParamStateService.getQueryParam('question');
    if (queryIndex) {
      const parsedQueryIndex = this.parseQueryIndex(queryIndex, questions);
      if (parsedQueryIndex) return parsedQueryIndex;
    }
    const index = questions.findIndex((question) => !question.details.locked);
    return Math.max(index, 0);
  }

  private parseQueryIndex(
    queryIndex: string,
    questions: Question[],
  ): number | undefined {
    const index = parseInt(queryIndex);
    if (isNaN(index)) return undefined;
    else if (index < 1 || index > questions.length) return undefined;
    else return index - 1;
  }

  public setQuestionView(questionView: QuestionView): void {
    this.setQuestionView$.next(questionView);
  }

  public setQuestionIndex(questionIndex: number): void {
    this.setQuestion$.next(questionIndex);
  }

  public nextQuestion(): void {
    this.setQuestion$.next('next');
  }

  public previousQuestion(): void {
    this.setQuestion$.next('previous');
  }

  public setCurrentPool(poolDetails: PoolDetails | undefined): void {
    this.poolDetails$.next(poolDetails);
  }

  public clearQuestions(): void {
    this.questions$.pipe(take(1)).subscribe((questions) => {
      questions?.forEach((question) => question.setAnswer(undefined));
    });
  }
}
export type QuestionView = 'list' | 'stepper' | 'coupon';
export type SetQuestion = number | 'next' | 'previous';
export type ActionButtonState = 'next' | 'complete';
