import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, scan, startWith } from 'rxjs';
import { AuthenticatorRedirectService } from 'src/app/core/services/system/authenticator-redirect.service';
import { BalanceService } from 'src/app/core/services/user/balance.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';

@Component({
  selector: 'mipools-front-end-user-chip',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-chip.component.html',
  styleUrls: ['./user-chip.component.scss'],
})
export class UserChipComponent {
  public readonly toggleDropdown$: Subject<void> = new Subject();
  public readonly showDropdown$ = this.toggleDropdown$.pipe(
    scan((state) => !state, false),
    startWith(false),
  );
  public readonly balance$ = this.balanceService.getBalance();

  constructor(
    private balanceService: BalanceService,
    public authenticatorRedirectService: AuthenticatorRedirectService,
    public userDetailsService: UserDetailsService,
  ) {}
}
