import { CommonModule } from '@angular/common';
import { Component, Type, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PoolDetailsComponent } from 'src/app/pages/pool/qa/pool-details/pool-details.component';
import { ScoringInfoComponent } from 'src/app/pages/pool/qa/scoring-info/scoring-info.component';
import { CouponComponent } from 'src/app/pages/pool/qa/views/coupon/coupon.component';
import { QuestionListComponent } from 'src/app/pages/pool/qa/views/question-list/question-list.component';
import { QuestionStepperComponent } from 'src/app/pages/pool/qa/views/question-stepper/question-stepper.component';
import { QuestionService } from 'src/app/pages/pool/question.service';
import { ExitButtonComponent } from 'src/app/shared/input/buttons/exit-button/exit-button.component';
import { ToggleComponent } from 'src/app/shared/toggle/toggle.component';

@Component({
  selector: 'mipools-front-end-qa',
  standalone: true,
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss'],
  imports: [
    CommonModule,
    PoolDetailsComponent,
    ExitButtonComponent,
    ToggleComponent,
    ScoringInfoComponent,
  ],
})
export class QaComponent {
  public readonly questionViewComponent$: Observable<Type<unknown>> = inject(
    QuestionService,
  ).questionView$.pipe(
    map((view) => {
      switch (view) {
        case 'list':
          return QuestionListComponent;
        case 'stepper':
          return QuestionStepperComponent;
        case 'coupon':
          return CouponComponent;
      }
    }),
  );
}
