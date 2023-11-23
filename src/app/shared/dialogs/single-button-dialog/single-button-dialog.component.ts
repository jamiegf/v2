import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'mipools-front-end-single-button-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatDialogModule,
  ],
  viewProviders: [],
  template: `
    <div class="close-container">
      <button class="close-button" mat-dialog-close>X</button>
    </div>
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content [innerHTML]="data.body"></div>
    <div class="actions" mat-dialog-actions>
      <button mat-dialog-close>{{ data.buttonText }}</button>
    </div>
  `,
  styles: `
  .close-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem;
  }
  .actions {
    justify-content: center;
  }`,
})
export class SingleButtonDialogComponent {
  constructor(
    public ref: MatDialogRef<SingleButtonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SingleButtonDialogData,
  ) {}
}

export interface SingleButtonDialogData {
  title: string;
  body: string;
  buttonText: string;
}
