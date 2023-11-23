import { Injectable } from '@angular/core';

/**
 * SSR guard for set timeout functions. On server side no timeout is set to prevent blocking.
 */
@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  public setTimeout(
    callback: () => void,
    ms?: number,
  ): string | number | NodeJS.Timeout | undefined {
    return setTimeout(callback, ms);
  }

  public clearTimeout(timeoutId: string | number | NodeJS.Timeout | undefined) {
    clearTimeout(timeoutId);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ServerTimeoutService extends TimeoutService {
  public override setTimeout(
    _callback: () => void,
    _ms?: number,
  ): string | number | NodeJS.Timeout | undefined {
    return undefined;
  }

  public override clearTimeout(
    _timeoutId: string | number | NodeJS.Timeout | undefined,
  ) {
    return;
  }
}
