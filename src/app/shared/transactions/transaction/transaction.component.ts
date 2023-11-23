import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Transaction } from 'src/app/core/models/transaction.class';

@Component({
  selector: 'mipools-front-end-transaction[transaction]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  @Input() transaction!: Transaction;
}
