import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConvertGeAmountToTextPipe } from 'src/app/core/pipes/convert-ge-amount-to-text.pipe';
import { BalanceService } from 'src/app/core/services/user/balance.service';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { EntryService } from 'src/app/pages/pool/entry.service';
import { InsufficientFundsComponent } from 'src/app/pages/pool/payment/insufficient-funds/insufficient-funds.component';

@Component({
  selector: 'mipools-front-end-payment',
  standalone: true,
  imports: [
    CommonModule,
    ConvertGeAmountToTextPipe,
    InsufficientFundsComponent,
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  public balance$ = this.balanceService.getBalance();
  constructor(
    private balanceService: BalanceService,
    public activePoolService: ActivePoolService,
    public entryService: EntryService,
  ) {}
}
