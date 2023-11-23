import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BalanceService } from 'src/app/core/services/user/balance.service';
import { PlayerStatsService } from 'src/app/core/services/user/player-stats.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { DrawerService } from 'src/app/shared/overlay/services/drawer.service';

@Component({
  selector: 'mipools-front-end-account',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  public balance$ = this.balanceService.getBalance();
  public stats$ = this.playerStatsService.getStats();

  constructor(
    private drawerService: DrawerService,
    public balanceService: BalanceService,
    public playerStatsService: PlayerStatsService,
    public userDetailsService: UserDetailsService,
  ) {}

  public showTransactions(): void {
    this.drawerService.setDrawerContent('transactions');
  }

}
