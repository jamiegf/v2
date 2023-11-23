import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SingleButtonDialogComponent } from 'src/app/shared/dialogs/single-button-dialog/single-button-dialog.component';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'mipools-front-end-loading-dialog',
  standalone: true,
  imports: [CommonModule, LoadingComponent, MatDialogContent],
  template: `
    <div mat-dialog-content>
      <mipools-front-end-loading></mipools-front-end-loading>
    </div>
  `,
  styles: ``,
})
export class LoadingDialogComponent {
  constructor(public ref: MatDialogRef<SingleButtonDialogComponent>) {}
}
