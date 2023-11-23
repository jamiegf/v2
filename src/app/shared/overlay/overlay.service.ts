import { Injectable } from '@angular/core';
import { Observable, Subject, map, merge, scan } from 'rxjs';
import { KeyListenerService } from 'src/app/core/services/system/key-listener.service';
import { assertUnreachable } from 'src/app/lib/assert-unreachable';
import { DrawerService } from 'src/app/shared/overlay/services/drawer.service';

@Injectable({
  providedIn: 'root',
})
export abstract class OverlayService {
  private closeClickEvent$ = new Subject<void>();

  private exitEvent: Observable<ExitEventOption> = merge(
    this.keyListenerService.escapeKeyEvent$.pipe(
      map((): ExitEventOption => 'disableEscapeExit'),
    ),
    this.closeClickEvent$.pipe(
      map((): ExitEventOption => 'disableBackdropClickExit'),
    ),
  );

  public readonly overlayState$ = merge(
    this.drawerService.overlayActionEvent$.pipe(
      map((action): ['actionEvent', OverlayAction<OverlayComponentType>] => [
        'actionEvent',
        action,
      ]),
    ),
    this.exitEvent.pipe(
      map((exitEventOption): ['exitEvent', ExitEventOption] => [
        'exitEvent',
        exitEventOption,
      ]),
    ),
  ).pipe(
    scan((state: OverlayState, stream) => {
      switch (stream[0]) {
        case 'actionEvent':
          state = this.handleOverlayAction(state, stream[1]);
          break;
        case 'exitEvent':
          state = this.handleExitEvent(state, stream[1]);
          break;
        default:
          throw assertUnreachable(stream[0]);
      }
      return state;
    }, {}),
  );

  public showBackdrop$: Observable<boolean> = this.overlayState$.pipe(
    map((overlayState) => {
      for (const key in overlayState) {
        if (
          overlayState[key as keyof OverlayState]?.disableBackdropDim === false
        ) {
          return true;
        }
      }
      return false;
    }),
  );

  constructor(
    private drawerService: DrawerService,
    private keyListenerService: KeyListenerService,
  ) {}

  private convertPartialOptionsToFull(
    options?: Partial<OverlayComponentStateOptions>,
  ): OverlayComponentStateOptions {
    return {
      disableBackdropClickExit: options?.disableBackdropClickExit || false,
      disableBackdropDim: options?.disableBackdropDim || false,
      disableEscapeExit: options?.disableEscapeExit || false,
    };
  }

  public triggerCloseClickEvent(): void {
    this.closeClickEvent$.next();
  }

  private handleExitEvent(
    state: OverlayState,
    overlayExitEventOption: ExitEventOption,
  ): OverlayState {
    for (const key in state) {
      const stateKey = key as keyof OverlayState;
      if (state[stateKey]?.[overlayExitEventOption] === false) {
        state[stateKey] = undefined;
      }
    }
    return state;
  }

  private handleOverlayAction(
    state: OverlayState,
    action: OverlayAction<OverlayComponentType>,
  ): OverlayState {
    if (action.command === 'clear') {
      state[action.component] = undefined;
    } else if (action.command === 'create') {
      state[action.component] = this.convertPartialOptionsToFull(
        action.options,
      );
    }
    return state;
  }
}

interface OverlayComponentExitOptions {
  disableBackdropClickExit: boolean;
  disableEscapeExit: boolean; // TODO
}

interface OverlayComponentStateOptions extends OverlayComponentExitOptions {
  disableBackdropDim: boolean;
}

type ExitEventOption = keyof OverlayComponentExitOptions;

export type OverlayComponentType = 'drawer' | 'dialog';

export type OverlayStateItem = {
  item: OverlayComponentType;
  options: OverlayComponentStateOptions;
};

export type OverlayAction<T extends OverlayComponentType> =
  | {
      command: 'clear';
      component: T;
    }
  | {
      command: 'create';
      component: T;
      options?: Partial<OverlayComponentStateOptions>;
    };
type OverlayState = Partial<
  Record<OverlayComponentType, OverlayComponentStateOptions>
>;
