import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameType } from 'src/app/core/models/pool/game-type.type';
import { FixtureQuestion } from 'src/app/core/models/pool/pool-details/question/question.type';

@Component({
  selector: 'mipools-front-end-fixture-question[question][gameType]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixture-question.component.html',
  styleUrls: ['./fixture-question.component.scss'],
})
export class FixtureQuestionComponent {
  @Input() question!: FixtureQuestion;
  @Input() gameType!: GameType;
}
