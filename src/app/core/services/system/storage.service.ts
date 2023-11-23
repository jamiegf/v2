import { Injectable } from '@angular/core';
import { TransferStateService } from 'src/app/core/services/system/transfer-state.service';
import { assertUnreachable } from 'src/app/lib/assert-unreachable';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  protected sessionStorage: Storage;
  protected localStorage: Storage;

  constructor(protected transferStateService: TransferStateService) {
    [this.sessionStorage, this.localStorage] = this.getStorageObjects();
    const storedSession = transferStateService.get(
      'sessionStorage',
      {} as Record<string, string>,
    );
    const storedLocal = transferStateService.get(
      'localStorage',
      {} as Record<string, string>,
    );
    Object.keys(storedSession).forEach((key) => {
      this.sessionStorage.setItem(key, storedSession[key]);
    });
    Object.keys(storedLocal).forEach((key) => {
      this.localStorage.setItem(key, storedLocal[key]);
    });
  }

  public clearSession(): void {
    this.sessionStorage.clear();
  }

  public clearLocal(): void {
    this.localStorage.clear();
  }

  public clear(): void {
    this.clearSession();
    this.clearLocal();
  }

  public set(item: StorageItem, value: string): boolean {
    if (!this.isAllowedToStore(item)) return false;
    if (item.localStorage) {
      this.localStorage.setItem(item.key, value);
    } else {
      this.sessionStorage.setItem(item.key, value);
    }
    return true;
  }

  public get(item: StorageItem): string | null {
    if (item.localStorage) return this.localStorage.getItem(item.key);
    else return this.sessionStorage.getItem(item.key);
  }

  public remove(item: StorageItem): void {
    if (item.localStorage) {
      this.localStorage.removeItem(item.key);
    } else {
      this.sessionStorage.removeItem(item.key);
    }
  }

  public isAllowedToStore(item: StorageItem): boolean {
    switch (item.type) {
      case 'FUNCTIONAL':
        return true;
      default:
        throw assertUnreachable(item.type);
    }
  }

  protected getStorageObjects(): [Storage, Storage] {
    return [sessionStorage, localStorage];
  }
}

@Injectable({
  providedIn: 'root',
})
export class ServerStorageService extends StorageService {
  protected override sessionStorage: ServerStorage = new ServerStorage();
  protected override localStorage: ServerStorage = new ServerStorage();

  public override set(item: StorageItem, value: string): boolean {
    const couldSet = super.set(item, value);
    if (couldSet) {
      this.storeState();
    }
    return couldSet;
  }

  public override remove(item: StorageItem): void {
    super.remove(item);
    this.storeState();
  }

  public override clear(): void {
    super.clear();
    this.storeState();
  }

  private storeState(): void {
    this.transferStateService.set('sessionStorage', this.sessionStorage.items);
    this.transferStateService.set('localStorage', this.localStorage.items);
  }

  protected override getStorageObjects(): [Storage, Storage] {
    return [new ServerStorage(), new ServerStorage()];
  }
}
class ServerStorage implements Storage {
  private _storage: Record<string, string> = {};
  public get length() {
    return Object.keys(this._storage).length;
  }

  clear(): void {
    this._storage = {};
  }
  getItem(key: string): string | null {
    return this._storage[key] || null;
  }
  key(index: number): string | null {
    return Object.keys(this._storage)[index] || null;
  }
  removeItem(key: string): void {
    delete this._storage[key];
  }
  setItem(key: string, value: string): void {
    this._storage[key] = value;
  }

  get items(): Record<string, string> {
    return structuredClone(this._storage);
  }
}

export const StorageItem = {
  ALLOW_MARKETING: {
    key: 'allowMarketing',
    type: 'FUNCTIONAL',
    localStorage: true,
  },
  ALLOW_PERFORMANCE: {
    key: 'allowPerformance',
    type: 'FUNCTIONAL',
    localStorage: true,
  },
  ALLOW_PREFERENCE: {
    key: 'allowPreference',
    type: 'FUNCTIONAL',
    localStorage: true,
  },
  USED_TOKEN: {
    key: 'usedToken',
    type: 'FUNCTIONAL',
    localStorage: true,
  },
  STORED_ANSWERS: {
    key: 'storedAnswers',
    type: 'FUNCTIONAL',
    localStorage: true,
  },
  STORED_DOUBLE_UP: {
    key: 'storedDoubleUp',
    type: 'FUNCTIONAL',
    localStorage: true,
  },
} as const;

export type StorageItem = (typeof StorageItem)[keyof typeof StorageItem];
