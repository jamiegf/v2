import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameType } from 'src/app/core/models/pool/game-type.type';
import { MultipleChoiceQuestion } from 'src/app/core/models/pool/pool-details/question/question.type';

@Component({
  selector: 'mipools-front-end-multiple-choice-question[question][gameType]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss'],
})
export class MultipleChoiceQuestionComponent {
  @Input() question!: MultipleChoiceQuestion;
  @Input() gameType!: GameType;
}
