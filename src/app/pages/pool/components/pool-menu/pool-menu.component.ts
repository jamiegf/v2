import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterHistoryService } from 'src/app/core/services/system/router-history.service';
import { WindowService } from 'src/app/core/services/system/window.service';
import { PoolFoldOutCardComponent } from 'src/app/pages/pool/components/pool-fold-out-card/pool-fold-out-card.component';
import { PoolDropDownMenuComponent } from 'src/app/pages/pool/components/pool-menu/pool-drop-down-menu/pool-drop-down-menu.component';
import { ExitButtonComponent } from 'src/app/shared/input/buttons/exit-button/exit-button.component';
import { ToggleComponent } from 'src/app/shared/toggle/toggle.component';

const slideInOut = trigger('slideInOut', [
  state(
    'open',
    style({
      transform: 'translateX(0)',
    })
  ),
  state(
    'close',
    style({
      transform: 'translateX(400px)',
    })
  ),
  transition('open => close', [animate('0.3s ease-out')]),
  transition('close => open', [animate('0.3s ease-in')]),
]);

@Component({
  selector: 'mipools-front-end-pool-menu',
  standalone: true,
  imports: [
    CommonModule,
    PoolDropDownMenuComponent,
    PoolFoldOutCardComponent,
    ExitButtonComponent,
    ToggleComponent,
  ],
  templateUrl: './pool-menu.component.html',
  styleUrls: ['./pool-menu.component.scss'],
  animations: [slideInOut]
})
export class PoolMenuComponent {
  constructor(
    private routerHistoryService: RouterHistoryService,
    private windowService: WindowService,
  ) {}
  public displayCard = true;

  public readonly foldOutInitialState =
    this.windowService.innerWidth !== 0 && this.windowService.innerWidth >= 680;

  public exit(): void {
    this.routerHistoryService.back({ route: ['lobby'] });
  }
}
