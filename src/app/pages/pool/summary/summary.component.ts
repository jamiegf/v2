import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoubleUpService } from 'src/app/pages/pool/double-up.service';
import { QuestionService } from 'src/app/pages/pool/question.service';
import { ActivePoolService } from '../active-pool.service';

@Component({
  selector: 'mipools-front-end-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public activePoolService: ActivePoolService,
    public doubleUpService: DoubleUpService,
    public questionService: QuestionService,
  ) {}

  public goToEditQuestion(index: number): void {
    this.questionService.setQuestionIndex(index);
    this.router.navigate(['../', 'qa'], { relativeTo: this.activatedRoute });
  }
}
