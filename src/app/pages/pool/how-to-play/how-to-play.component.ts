import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';

@Component({
  selector: 'mipools-front-end-how-to-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss'],
})
export class HowToPlayComponent {
  constructor(public activePoolService: ActivePoolService) {}
}
