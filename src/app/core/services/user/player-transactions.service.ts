import { Injectable } from '@angular/core';
import { endOfMonth, format, isAfter } from 'date-fns';
import { Observable, map } from 'rxjs';
import {
  MiddlewareTransaction,
  Transaction,
} from 'src/app/core/models/transaction.class';
import { UserDataService } from 'src/app/core/models/user-data-service.class';
import { MiddlewareRequestService } from 'src/app/core/services/system/middleware-request.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerTransactionsService extends UserDataService<
  MiddlewareTransaction[],
  Transaction[] | undefined,
  TransactionRequest
> {
  public readonly transactions$: Observable<Transaction[] | undefined | null> =
    this.data$;
  public readonly totalWinnings$: Observable<string | null> = // potential share replay optimisation here
    this.transactions$.pipe(
      map((transactions) => {
        if (!transactions) return null;
        const sum = transactions.reduce((sum, transaction) => {
          if (transaction.amountType === 'cash' && transaction.amount) {
            sum += transaction.amount;
          }
          return sum;
        }, 0);
        return `£${sum.toFixed(2)}`;
      }),
    );

  constructor(
    middlewareRequestService: MiddlewareRequestService,
    userDetailsService: UserDetailsService,
  ) {
    super(
      {
        apiUrl: environment.api.middleware.playerTransactions,
        logTitle: 'playerTransactions',
      },
      middlewareRequestService,
      userDetailsService,
    );
  }

  /**
   * Fetch a players transactions
   * @param fromDate
   * @param toDate optional, default is end of month for given fromDate
   */
  public getTransactions$(fromDate: Date, toDate: Date = endOfMonth(fromDate)) {
    if (isAfter(fromDate, toDate))
      throw new Error(
        `transactions from date (${fromDate.toString()}) is after to date (${toDate.toString()})`,
      );
    this.refreshData(
      {
        startTime: format(fromDate, 'yyyy-MM-dd'),
        endTime: format(toDate, 'yyyy-MM-dd'),
      },
      true,
    );
    return this.data$;
  }

  protected override mapFunction(
    data: Partial<MiddlewareTransaction>[] | Error,
  ): Transaction[] | undefined {
    if (data instanceof Error) {
      return undefined;
    } else {
      const transactions = data.map(
        (transaction) => new Transaction(transaction),
      );
      return transactions;
    }
  }
}

interface TransactionRequest extends Record<string, string> {
  startTime: string;
  endTime: string;
}
