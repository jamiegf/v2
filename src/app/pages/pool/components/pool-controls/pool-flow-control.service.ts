import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { DoubleUpService } from 'src/app/pages/pool/double-up.service';
import { EnterPoolService } from 'src/app/pages/pool/enter-pool.service';
import {
  EntryCompletionState,
  EntryService,
} from 'src/app/pages/pool/entry.service';
import { QuestionService } from 'src/app/pages/pool/question.service';

@Injectable({
  providedIn: 'root',
})
export class PoolFlowControlService {
  private readonly HOW_TO_PLAY_STATE: ActionState = {
    text: 'Back to QA',
    type: 'link',
    url: './qa',
  };

  private readonly QA_COMPLETED_STATE: ActionState = {
    text: 'Summary',
    type: 'link',
    url: './summary',
  };

  private readonly QA_IN_PROGRESS_STATE: ActionState = {
    text: 'Next',
    type: 'button',
    action: () => {
      this.questionService.nextQuestion();
    },
    ariaLabel: 'Next question',
  };

  private readonly SUMMARY_IN_PROGRESS_STATE: ActionState = {
    disabled: true,
    text: 'Proceed to Payment',
    type: 'button',
    action: () => {
      return;
    },
    ariaLabel: 'Complete all question components to proceed to payment.',
  };

  private readonly SUMMARY_COMPLETE_STATE: ActionState = {
    text: 'Proceed to Payment',
    type: 'link',
    url: './payment',
  };

  private readonly QA_STATE_TO_ACTION_STATE: { [key in QaState]: ActionState } =
    {
      completed: this.QA_COMPLETED_STATE,
      inProgress: this.QA_IN_PROGRESS_STATE,
    };

  private readonly PAYMENT_STATES: {
    [key in EntryCompletionState]: ActionState;
  } = {
    complete: {
      type: 'link',
      text: 'Enter Pool',
      url: './result',
    },
    insufficientBalance: {
      // TODO once deposit is set up this will need a redirect as well probably? might be able to use router history
      type: 'link',
      text: 'Top Up Balance',
      url: './deposit',
    },
    noSelectedEntries: {
      disabled: true,
      text: 'Enter Pool',
      type: 'button',
      action: () => {
        return;
      },
      ariaLabel: 'Please select a configuration to enter before joining.',
    },
    notLoggedIn: {
      text: 'Log In',
      type: 'button',
      action: () => {
        this.entryService.showLoginPopup();
      },
      ariaLabel: 'Login to enter pool',
    },
  };

  private readonly qaState$: Observable<QaState> =
    this.questionService.questionView$.pipe(
      switchMap((view): Observable<QaState> => {
        switch (view) {
          case 'list':
            return of('completed');
          case 'coupon':
            return of('completed');
          case 'stepper':
            return combineLatest({
              index: this.questionService.currentQuestionIndex$,
              last: this.questionService.lastQuestionIndex$,
              count: this.questionService.questionCount$,
            }).pipe(
              map((stream) => {
                if (stream.index === stream.last) return 'completed';
                else if (stream.index + 1 === stream.count) return 'completed';
                else return 'inProgress';
              }),
            );
        }
      }),
      shareReplay(1),
    );

  private readonly qaActionState$ = this.qaState$.pipe(
    map((state) => this.QA_STATE_TO_ACTION_STATE[state]),
  );

  private readonly summaryActionState$ = combineLatest([
    this.questionService.completed$,
    this.doubleUpService.completed$,
  ]).pipe(
    map((stream) => {
      if (stream.every((val) => val)) {
        return this.SUMMARY_COMPLETE_STATE;
      } else {
        return this.SUMMARY_IN_PROGRESS_STATE;
      }
    }),
  );

  private navigationEndUrl$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map((event) => event.url),
    startWith(this.router.url),
    distinctUntilChanged(),
  );

  private poolRoute$: Observable<PoolRoute> = this.navigationEndUrl$.pipe(
    map((url) => {
      const path = url.split('?')[0];
      const route = path.split('/').at(-1) || '';
      if (route in PoolRoute) {
        return PoolRoute[route as keyof typeof PoolRoute];
      } else {
        throw new Error(`unrecognised route: ${route}`, { cause: PoolRoute });
      }
    }),
    shareReplay(1),
  );

  private paymentActionState$: Observable<ActionState> =
    this.entryService.entryCompletionState$.pipe(
      map((state) => this.PAYMENT_STATES[state]),
    );

  public displayHowToPlay$: Observable<boolean> = this.poolRoute$.pipe(
    map((route) => {
      return route !== 'howToPlay' && route !== 'result';
    }),
  );

  public actionState$: Observable<ActionState | undefined> =
    this.poolRoute$.pipe(
      switchMap((route) => {
        switch (route) {
          case 'howToPlay':
            return of(this.HOW_TO_PLAY_STATE);
          case 'qa':
            return this.qaActionState$;
          case 'summary':
            return this.summaryActionState$;
          case 'payment':
            return this.paymentActionState$;
          case 'result':
            return of(undefined);
        }
      }),
    );

  public displayMenu$ = this.poolRoute$.pipe(
    map((route) => {
      return route !== 'result';
    }),
    distinctUntilChanged(),
  );

  public backButtonAction$: Observable<BackButtonAction> = this.poolRoute$.pipe(
    switchMap((route): Observable<BackButtonAction> => {
      switch (route) {
        case 'howToPlay':
          return of(undefined);
        case 'qa':
          return combineLatest({
            index: this.questionService.currentQuestionIndex$,
            view: this.questionService.questionView$,
          }).pipe(
            map((stream) => {
              if (stream.view === 'stepper' && stream.index !== 0) {
                return {
                  type: 'button',
                  action: () => this.questionService.previousQuestion(),
                };
              } else {
                return undefined;
              }
            }),
          );
        case 'summary':
          return of({ type: 'link', url: './qa' });
        case 'payment':
          return of({ type: 'link', url: './summary' });
        default:
          return of(undefined);
      }
    }),
  );

  constructor(
    private doubleUpService: DoubleUpService,
    private enterPoolService: EnterPoolService,
    private entryService: EntryService,
    private questionService: QuestionService,
    private router: Router,
  ) {}
}

type BackButtonAction =
  | undefined
  | { type: 'button'; action: () => void }
  | { type: 'link'; url: string };

const PoolRoute = {
  'how-to-play': 'howToPlay',
  payment: 'payment',
  qa: 'qa',
  summary: 'summary',
  result: 'result',
} as const;

type ActionState =
  | {
      text: string;
      ariaLabel: string;
      type: 'button';
      action: () => void;
      disabled?: boolean;
    }
  | {
      text: string;
      type: 'link';
      url: string;
    };

type PoolRoute = (typeof PoolRoute)[keyof typeof PoolRoute];

type QaState = 'inProgress' | 'completed';
