import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PoolControlsComponent } from 'src/app/pages/pool/components/pool-controls/pool-controls.component';
import { PoolFlowControlService } from 'src/app/pages/pool/components/pool-controls/pool-flow-control.service';
import { PoolMenuComponent } from 'src/app/pages/pool/components/pool-menu/pool-menu.component';

@Component({
  selector: 'mipools-front-end-pool',
  standalone: true,
  imports: [
    CommonModule,
    PoolControlsComponent,
    PoolMenuComponent,
    RouterModule,
  ],
  template: ` <style>
      .pool {
        width: 100vw;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }

      .menu {
        width: 100vw;
      }

      .content {
        width: 100vw;
        max-width: 800px;
        flex-grow: 1;
      }

      mipools-front-end-pool-controls {
        position: sticky;
        bottom: 0;
        height: 10vh;
        width: 90%;
        background-color: black;
      }
    </style>
    <div class="pool">
      <mipools-front-end-pool-menu
        class="menu"
        *ngIf="poolFlowControlService.displayMenu$ | async"
      ></mipools-front-end-pool-menu>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
      <mipools-front-end-pool-controls></mipools-front-end-pool-controls>
    </div>`,
  styles: [],
})
export class PoolComponent {
  constructor(public poolFlowControlService: PoolFlowControlService) {}
}
