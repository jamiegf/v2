import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from 'src/app/shared/dialogs/loading-dialog/loading-dialog.component';
import {
  SingleButtonDialogComponent,
  SingleButtonDialogData,
} from 'src/app/shared/dialogs/single-button-dialog/single-button-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);

  constructor() {}

  public openLoader() {
    return this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
      ariaLabel: 'loading',
      panelClass: 'loader-dialog',
      backdropClass: 'loader-backdrop',
    });
  }

  public async openErrorDialog(
    options: Partial<SingleButtonDialogData> = {
      body: `<span>An unknown error was encountered.<br><a class="mipools-link" href='/faqs'>Please contact support if this problem persists.</a></span>`,
      buttonText: 'Ok',
      title: 'Error',
    },
  ) {
    return this.dialog.open(SingleButtonDialogComponent, {
      data: options,
      ariaLabel: 'Error Dialog',
    });
  }

  public closeAllDialogs(): void {
    this.dialog.closeAll();
  }
}
