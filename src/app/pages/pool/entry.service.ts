import { Injectable } from '@angular/core';
import {
  Observable,
  Subject,
  combineLatestWith,
  distinctUntilChanged,
  map,
  merge,
  of,
  scan,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { convertGeAmountToText } from 'src/app/core/pipes/convert-ge-amount-to-text.pipe';
import {
  Balance,
  BalanceService,
} from 'src/app/core/services/user/balance.service';
import { assertUnreachable } from 'src/app/lib/assert-unreachable';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';

//TODO this service is quite inefficient, wrote this whole flow in a couple hours, revisit if problems
@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private readonly INITIAL_STATE: () => EntryState = () => {
    return {
      configurations: [],
      disableCanJoinWithPoints: false,
      displayCanJoinWithPoints: false,
      selectedConfigurations: [],
      selectedPaymentMethod: 'cash',
    };
  };
  private selectPaymentMethod$ = new Subject<'cash' | 'points'>();
  private selectConfiguration$ = new Subject<number>();

  public readonly state$ = merge(
    this.selectConfiguration$.pipe(
      map((selectedConfig): ['selectedConfig', typeof selectedConfig] => [
        'selectedConfig',
        selectedConfig,
      ]),
    ),
    this.selectPaymentMethod$.pipe(
      map((paymentMethod): ['paymentMethod', typeof paymentMethod] => [
        'paymentMethod',
        paymentMethod,
      ]),
    ),
    this.activePoolService.poolInfo$.pipe(
      map((poolInfo): ['poolInfo', typeof poolInfo] => ['poolInfo', poolInfo]),
    ),
  ).pipe(
    scan((state: EntryState, stream) => {
      switch (stream[0]) {
        case 'paymentMethod':
          state.selectedPaymentMethod = stream[1];
          break;
        case 'poolInfo':
          state = stream[1]
            ? this.setupPoolInfo(stream[1])
            : this.INITIAL_STATE();
          break;
        case 'selectedConfig':
          state.configurations[stream[1]].selected =
            !state.configurations[stream[1]].selected;
          break;
        default:
          throw assertUnreachable(stream[0]);
      }
      return state;
    }, this.INITIAL_STATE()),
    shareReplay(1),
  );

  private totalValue$ = this.state$.pipe(
    map((state) => {
      const total = state.configurations.reduce<number | undefined>(
        (sum, config) => {
          if (config.selected) {
            sum = (sum || 0) + config.details.fee;
          }
          return sum;
        },
        undefined,
      );
      return total;
    }),
    shareReplay(1),
  );

  public displayPointsPaymentMethod$: Observable<boolean> = this.state$.pipe(
    map((state) => {
      return (
        state.configurations.find(
          (config) => config.details.canJoinWithPoints,
        ) !== undefined
      );
    }),
  );

  public configurations$ = this.state$.pipe(
    map((state) => state.configurations),
  );

  public disablePointsPaymentMethod$: Observable<boolean> = this.state$.pipe(
    map((state) => {
      for (let i = 0; i < state.configurations.length; i++) {
        if (
          state.configurations[i].selected &&
          !state.configurations[i].details.canJoinWithPoints
        ) {
          return true;
        }
      }
      return false;
    }),
    distinctUntilChanged(),
    tap((disabled) => {
      if (disabled) this.selectPaymentMethod$.next('cash');
    }),
  );

  public selectedPaymentMethod$ = this.state$.pipe(
    map((state) => state.selectedPaymentMethod),
    shareReplay(1),
  );

  public total$ = this.totalValue$.pipe(
    combineLatestWith(this.selectedPaymentMethod$),
    map((stream) => {
      const [total, paymentMethod] = [stream[0], stream[1]];
      if (total !== undefined) {
        return convertGeAmountToText(total, {
          isPoints: paymentMethod === 'points',
          showFreeText: true,
        });
      } else {
        return undefined;
      }
    }),
  );

  public entryCompletionState$: Observable<EntryCompletionState> =
    this.totalValue$.pipe(
      switchMap((total): Observable<EntryCompletionState> => {
        if (total === undefined) return of('noSelectedEntries');
        return this.balanceService.getBalance().pipe(
          combineLatestWith(this.selectedPaymentMethod$),
          map((stream): EntryCompletionState => {
            const [balance, paymentMethod] = [stream[0], stream[1]];
            if (balance === undefined) {
              return 'notLoggedIn';
            } else if (
              this.hasSufficientBalance(balance, total, paymentMethod)
            ) {
              return 'complete';
            } else {
              return 'insufficientBalance';
            }
          }),
        );
      }),
      shareReplay(1),
    );

  public complete$ = this.entryCompletionState$.pipe(
    map((state) => state === 'complete'),
  );

  constructor(
    private activePoolService: ActivePoolService,
    private balanceService: BalanceService,
  ) {}

  public selectPaymentMethod(method: 'cash' | 'points'): void {
    this.selectPaymentMethod$.next(method);
  }

  public selectConfiguration(index: number): void {
    this.selectConfiguration$.next(index);
  }

  public showLoginPopup(): void {
    alert('not implemented yet, please go back to lobby and login'); // TODO
  }

  private setupPoolInfo(poolInfo: PoolInfo): EntryState {
    const configurations = this.parseConfigurations(poolInfo);
    return {
      configurations,
      selectedPaymentMethod: 'cash',
    };
  }

  private hasSufficientBalance(
    balance: Balance,
    amount: number,
    paymentMethod: 'cash' | 'points',
  ): boolean {
    if (paymentMethod === 'cash') {
      return balance.cash !== undefined && balance.cash > amount;
    } else {
      return balance.points !== undefined && balance.points > amount * 100;
    }
  }

  private parseConfigurations(
    poolInfo: PoolInfo,
  ): { details: ConfigurationDetails; selected: boolean }[] {
    return poolInfo.gameConfigurationIds
      .reduce<{ details: ConfigurationDetails; selected: boolean }[]>(
        (array, id) => {
          const config = poolInfo.configurationInfo[id];
          array.push({
            details: {
              canJoinWithPoints: config.stakeType === 'pointsOrCash',
              fee: config.entryFee,
              id: id,
              payoutInPoints: config.payoutType === 'points',
              players: config.seats.length,
              prize: config.prize,
            },
            selected: false,
          });
          return array;
        },
        [],
      )
      .sort((a, b) => parseInt(a.details.id) - parseInt(b.details.id));
  }
}

interface EntryState {
  readonly configurations: {
    readonly details: ConfigurationDetails;
    selected: boolean;
  }[];
  selectedPaymentMethod: 'cash' | 'points';
}

export type EntryCompletionState =
  | 'noSelectedEntries'
  | 'insufficientBalance'
  | 'notLoggedIn'
  | 'complete';

export interface ConfigurationDetails {
  canJoinWithPoints: boolean;
  fee: number;
  id: string;
  payoutInPoints: boolean;
  players: number;
  prize: number;
}
