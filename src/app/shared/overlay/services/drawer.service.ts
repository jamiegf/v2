import { Injectable } from '@angular/core';
import { OverlayAction } from 'src/app/shared/overlay/overlay.service';
import { OverlayComponentService } from 'src/app/shared/overlay/services/overlay-component.service';

@Injectable({
  providedIn: 'root',
})
export class DrawerService extends OverlayComponentService<
  'drawer',
  DrawerContentType
> {
  protected override mapStateToOverlayAction(
    state: DrawerContentType | undefined,
  ): OverlayAction<'drawer'> {
    switch (state) {
      case 'transactions':
        return {
          command: 'create',
          component: 'drawer',
        };
      default:
        return {
          command: 'clear',
          component: 'drawer',
        };
    }
  }
}
type DrawerContentType = 'transactions';
