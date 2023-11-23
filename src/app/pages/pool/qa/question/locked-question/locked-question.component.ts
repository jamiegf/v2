import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameType } from 'src/app/core/models/pool/game-type.type';

@Component({
  selector: 'mipools-front-end-locked-question[gameType]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locked-question.component.html',
  styleUrls: ['./locked-question.component.scss'],
})
export class LockedQuestionComponent {
  @Input() gameType!: GameType;
}
