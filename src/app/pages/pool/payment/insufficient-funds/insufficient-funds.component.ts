import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mipools-front-end-insufficient-funds',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './insufficient-funds.component.html',
  styleUrls: ['./insufficient-funds.component.scss'],
})
export class InsufficientFundsComponent {
  @Input() balanceType!: string;
}
