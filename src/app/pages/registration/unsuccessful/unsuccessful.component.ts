import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mipools-front-end-unsuccessful',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './unsuccessful.component.html',
  styleUrl: './unsuccessful.component.scss',
})
export class UnsuccessfulComponent {}
