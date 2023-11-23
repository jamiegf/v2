import { Observable, ReplaySubject, Subject, map } from 'rxjs';
import {
  OverlayAction,
  OverlayComponentType,
} from 'src/app/shared/overlay/overlay.service';

export abstract class OverlayComponentService<
  T extends OverlayComponentType,
  K extends string,
> {
  private readonly overlayComponentEvent$: Subject<K | undefined> =
    new ReplaySubject(1);

  public readonly componentState$ = this.overlayComponentEvent$.asObservable();

  public overlayActionEvent$: Observable<OverlayAction<T>> =
    this.overlayComponentEvent$.pipe(
      map((state) => this.mapStateToOverlayAction(state)),
    );

  public setDrawerContent(type: K): void {
    this.overlayComponentEvent$.next(type);
  }

  public clearDrawerContent(): void {
    this.overlayComponentEvent$.next(undefined);
  }

  protected abstract mapStateToOverlayAction(
    state: K | undefined,
  ): OverlayAction<T>;
}
