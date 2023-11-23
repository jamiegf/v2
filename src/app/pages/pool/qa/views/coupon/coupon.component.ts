import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { MultipleChoiceQuestion } from 'src/app/core/models/pool/pool-details/question/question.type';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { InlineMultipleChoiceComponent } from 'src/app/pages/pool/qa/question/inline-multiple-choice/inline-multiple-choice.component';
import { QuestionService } from 'src/app/pages/pool/question.service';

@Component({
  selector: 'mipools-front-end-coupon',
  standalone: true,
  imports: [CommonModule, InlineMultipleChoiceComponent],
  templateUrl: './coupon.component.html',
  styleUrl: './coupon.component.scss',
})
export class CouponComponent {
  public gameType$ = inject(ActivePoolService).gameType$;
  public questions$ = inject(QuestionService).questions$.pipe(
    map((questions) => {
      if (questions === undefined) return undefined;
      return Object.entries(
        questions.reduce<Record<string, MultipleChoiceQuestion[]>>(
          (questionMap, question) => {
            if (
              question.type === 'multipleChoice' &&
              question.details.description !== undefined
            ) {
              const array = questionMap[question.details.description] || [];
              array.push(question);
              questionMap[question.details.description] = array;
            } else {
              throw new Error(
                'Coupon questions must be multiple choice and have a description',
                { cause: question },
              );
            }
            return questionMap;
          },
          {},
        ),
      );
    }),
  );
}
