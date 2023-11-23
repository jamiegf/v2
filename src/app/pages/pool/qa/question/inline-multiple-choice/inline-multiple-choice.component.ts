import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameType } from 'src/app/core/models/pool/game-type.type';
import { MultipleChoiceQuestion } from 'src/app/core/models/pool/pool-details/question/question.type';

@Component({
  selector: 'mipools-front-end-inline-multiple-choice[question][gameType]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inline-multiple-choice.component.html',
  styleUrl: './inline-multiple-choice.component.scss',
})
export class InlineMultipleChoiceComponent {
  @Input() question!: MultipleChoiceQuestion;
  @Input() gameType!: GameType;
}
