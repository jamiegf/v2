import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { PoolFlowControlService } from 'src/app/pages/pool/components/pool-controls/pool-flow-control.service';
import { QuestionService } from 'src/app/pages/pool/question.service';

@Component({
  selector: 'mipools-front-end-pool-controls',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pool-controls.component.html',
  styleUrls: ['./pool-controls.component.scss'],
})
export class PoolControlsComponent {
  constructor(
    public activePoolService: ActivePoolService,
    public questionService: QuestionService,
    public poolFlowControlService: PoolFlowControlService,
  ) {}
}
