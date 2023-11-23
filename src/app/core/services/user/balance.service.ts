import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserDataService } from 'src/app/core/models/user-data-service.class';
import { MiddlewareRequestService } from 'src/app/core/services/system/middleware-request.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BalanceService extends UserDataService<BalanceItem[], Balance> {
  constructor(
    middlewareRequestService: MiddlewareRequestService,
    userDetailsService: UserDetailsService,
  ) {
    super(
      {
        apiUrl: environment.api.middleware.balance,
        logTitle: 'balance',
      },
      middlewareRequestService,
      userDetailsService,
    );
  }

  /**
   * triggers a balance refresh and returns an observable with the result
   * @returns balance observable
   */
  public getBalance(): Observable<undefined | Balance> {
    this.refreshData();
    return this.data$.pipe(
      map((balance): undefined | Balance => {
        if (!balance) return undefined;
        return {
          cash: balance.cash,
          points: balance.points,
          netDeposit: balance.netDeposit,
        };
      }),
    );
  }

  protected override mapFunction(data: BalanceItem[] | Error): Balance | Error {
    if (data instanceof Error) return data;
    return {
      cash: this.getBalanceItemFromResponse(0, data),
      points: this.getBalanceItemFromResponse(1, data),
      netDeposit: this.getBalanceItemFromResponse(3, data),
    };
  }

  protected override differ(
    currentData: Balance | undefined | null,
    incomingData: Balance | undefined | null,
  ): boolean {
    if (currentData && incomingData) {
      for (const key in incomingData) {
        if (
          incomingData[key as keyof Balance] !==
          currentData[key as keyof Balance]
        ) {
          return true;
        }
      }
      return false;
    } else if (currentData === incomingData) {
      return false;
    } else {
      return true;
    }
  }

  private getBalanceItemFromResponse(
    id: number,
    balanceItems: BalanceItem[],
  ): number | undefined {
    return balanceItems.find((item) => item.PointsTypeID === id)?.Amount;
  }
}

interface BalanceItem {
  PointsTypeID: number;
  Description: string;
  Amount: number;
}

export interface Balance {
  cash: number | undefined;
  points: number | undefined;
  netDeposit: number | undefined;
}
