import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { format, startOfMonth, sub } from 'date-fns';
import {
  Observable,
  Subject,
  combineLatestWith,
  map,
  of,
  shareReplay,
  startWith,
  takeUntil,
} from 'rxjs';
import { BalanceService } from 'src/app/core/services/user/balance.service';
import { PlayerTransactionsService } from 'src/app/core/services/user/player-transactions.service';
import { ExitButtonComponent } from 'src/app/shared/input/buttons/exit-button/exit-button.component';
import { DropDownMenuComponent } from 'src/app/shared/input/drop-down-menu/drop-down-menu.component';
import { ExitableComponent } from 'src/app/shared/interfaces/exitable/exitable.component';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { TransactionComponent } from 'src/app/shared/transactions/transaction/transaction.component';

const DATES_AVAILABLE_COUNT = 5;

@Component({
  selector: 'mipools-front-end-transactions',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    DropDownMenuComponent,
    ReactiveFormsModule,
    ExitButtonComponent,
    TransactionComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent
  extends ExitableComponent
  implements OnDestroy
{
  private readonly destroy$ = new Subject<void>();
  private readonly currentDateIndex$ = new Subject<number>();

  private readonly dates$: Observable<Date[]> = of(
    this.getAvailableDates(),
  ).pipe(shareReplay(1));

  public readonly currentDate$ = this.currentDateIndex$.pipe(
    startWith(DATES_AVAILABLE_COUNT),
    combineLatestWith(this.dates$),
    map(([index, dates]) => {
      const date = dates.at(index);
      if (date !== undefined) return date;
      else throw new Error(`No date for index ${index}`);
    }),
    shareReplay(1),
  );

  public readonly availableDateOptions$ = this.dates$.pipe(
    map((dates) => {
      return dates.map((date) => format(date, 'MMMM,yyyy'));
    }),
  );

  public readonly points$ = this.balanceService
    .getBalance()
    .pipe(map((balance) => balance?.points));

  constructor(
    public balanceService: BalanceService,
    public playerTransactionsService: PlayerTransactionsService,
  ) {
    super();
    this.currentDate$.pipe(takeUntil(this.destroy$)).subscribe((date) => {
      this.playerTransactionsService.getTransactions$(date);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public set currentDateIndex(index: number) {
    this.currentDateIndex$.next(index);
  }

  private getAvailableDates(): Date[] {
    const dates: Date[] = [];
    dates[DATES_AVAILABLE_COUNT] = startOfMonth(new Date());

    for (let i = DATES_AVAILABLE_COUNT - 1; i >= 0; i--) {
      dates[i] = sub(dates[i + 1], { months: 1 });
    }
    return dates;
  }
}
