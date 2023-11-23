import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { QuestionComponent } from 'src/app/pages/pool/qa/question/question.component';
import { QuestionService } from 'src/app/pages/pool/question.service';

@Component({
  selector: 'mipools-front-end-question-list',
  standalone: true,
  imports: [CommonModule, QuestionComponent],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent {
  constructor(
    public activePoolService: ActivePoolService,
    public questionService: QuestionService,
  ) {}
}
