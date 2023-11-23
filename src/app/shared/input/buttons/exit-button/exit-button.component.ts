import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExitableComponent } from 'src/app/shared/interfaces/exitable/exitable.component';

@Component({
  selector: 'mipools-front-end-exit-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit-button.component.html',
  styleUrls: ['./exit-button.component.scss'],
})
export class ExitButtonComponent extends ExitableComponent {}
