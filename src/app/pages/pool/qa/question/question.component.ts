import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameType } from 'src/app/core/models/pool/game-type.type';
import { Question } from 'src/app/core/models/pool/pool-details/question/question.type';
import { FixtureQuestionComponent } from 'src/app/pages/pool/qa/question/fixture-question/fixture-question.component';
import { LockedQuestionComponent } from 'src/app/pages/pool/qa/question/locked-question/locked-question.component';
import { MultipleChoiceQuestionComponent } from 'src/app/pages/pool/qa/question/multiple-choice-question/multiple-choice-question.component';
import { NearestToPinQuestionComponent } from 'src/app/pages/pool/qa/question/nearest-to-pin-question/nearest-to-pin-question.component';

@Component({
  selector: 'mipools-front-end-question[question][gameType]',
  standalone: true,
  imports: [
    CommonModule,
    MultipleChoiceQuestionComponent,
    NearestToPinQuestionComponent,
    FixtureQuestionComponent,
    LockedQuestionComponent,
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent {
  @Input() question!: Question;
  @Input() gameType!: GameType;
}
