import { Injectable } from '@angular/core';
import { Observable, filter, fromEvent, of, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyListenerService {
  public keyEvent$ = fromEvent<KeyboardEvent>(window, 'keyup').pipe(share());

  public escapeKeyEvent$ = this.keyEvent$.pipe(
    filter((event) => event.key === 'Escape'),
  );
}

@Injectable({
  providedIn: 'root',
})
export class ServerKeyListenerService {
  public keyEvent$: Observable<KeyboardEvent> = of();
  public escapeKeyEvent$ = this.keyEvent$.pipe(
    filter((event) => event.key === 'Escape'),
  );
}
