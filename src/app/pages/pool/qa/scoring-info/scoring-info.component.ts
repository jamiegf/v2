import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScoringInfoService } from 'src/app/pages/pool/qa/scoring-info.service';
import { ExitButtonComponent } from 'src/app/shared/input/buttons/exit-button/exit-button.component';

@Component({
  selector: 'mipools-front-end-scoring-info',
  standalone: true,
  imports: [CommonModule, ExitButtonComponent],
  templateUrl: './scoring-info.component.html',
  styleUrls: ['./scoring-info.component.scss'],
})
export class ScoringInfoComponent {
  constructor(public scoringInfoService: ScoringInfoService) {}
}
