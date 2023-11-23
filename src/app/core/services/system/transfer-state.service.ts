import { Injectable, TransferState, makeStateKey } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  constructor(protected transferState: TransferState) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public set<T>(key: TransferStateKey, value: T): void {
    return;
  }

  public get<T>(key: TransferStateKey, defaultValue: T): T {
    return this.transferState.get<T>(makeStateKey(key), defaultValue);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ServerTransferStateService extends TransferStateService {
  public override set<T>(key: TransferStateKey, value: T): void {
    this.transferState.set<T>(makeStateKey(key), value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override get<T>(key: TransferStateKey, defaultValue: T): T {
    return defaultValue;
  }
}


export type TransferStateKey =
  | 'sessionStorage'
  | 'localStorage'
  | 'userDetails';