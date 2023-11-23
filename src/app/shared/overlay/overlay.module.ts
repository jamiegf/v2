import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DrawerComponent } from 'src/app/shared/overlay/components/drawer/drawer.component';
import { OverlayComponent } from 'src/app/shared/overlay/overlay.component';
import { TransactionsComponent } from 'src/app/shared/transactions/transactions.component';

@NgModule({
  declarations: [OverlayComponent, DrawerComponent],
  imports: [CommonModule, TransactionsComponent],
  exports: [OverlayComponent],
})
export class OverlayModule {}
