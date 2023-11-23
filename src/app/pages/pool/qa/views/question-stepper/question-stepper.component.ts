import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { QuestionComponent } from 'src/app/pages/pool/qa/question/question.component';
import { CustomStepIconComponent } from 'src/app/pages/pool/qa/views/question-stepper/custom-step-icon/custom-step-icon.component';
import { QuestionService } from 'src/app/pages/pool/question.service';

@Component({
  selector: 'mipools-front-end-question-stepper',
  standalone: true,
  imports: [CommonModule, QuestionComponent, CustomStepIconComponent],
  templateUrl: './question-stepper.component.html',
  styleUrls: ['./question-stepper.component.scss'],
})
export class QuestionStepperComponent {
  constructor(
    public activePoolService: ActivePoolService,
    public questionService: QuestionService,
  ) {}
}
