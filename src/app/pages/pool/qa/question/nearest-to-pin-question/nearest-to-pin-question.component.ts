import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { GameType } from 'src/app/core/models/pool/game-type.type';
import { NearestToPinQuestion } from 'src/app/core/models/pool/pool-details/question/question.type';
import { ParseNumberPipe } from 'src/app/core/pipes/parse-number.pipe';

@Component({
  selector: 'mipools-front-end-nearest-to-pin-question[gameType][question]',
  standalone: true,
  imports: [CommonModule, ParseNumberPipe, MatSliderModule],
  templateUrl: './nearest-to-pin-question.component.html',
  styleUrls: ['./nearest-to-pin-question.component.scss'],
})
export class NearestToPinQuestionComponent {
  @Input() question!: NearestToPinQuestion;
  @Input() gameType!: GameType;

  public parseInt = parseInt;

  public inputValid = true;

  public setAnswer(value: number | undefined): void {
    this.question.setAnswer(value?.toString());
    this.inputValid = true;
  }

  public handleInputEvent(event: Event): void {
    if (
      event.target &&
      'value' in event.target &&
      typeof event.target.value === 'string'
    ) {
      const validatedValue = this.validateValue(event.target.value);
      if (validatedValue) this.setAnswer(validatedValue);
      else this.inputValid = false;
    }
  }

  /**
   * checks value against question constraint, WARNING step check only worls
   * up to a certain accuracy point (thanks floating point JS) but should be fine for mipools
   * @param value
   * @returns
   */
  private validateValue(value: string): number | undefined {
    const num = parseFloat(value);

    if (isNaN(num)) {
      return undefined;
    }
    if (num < this.question.details.minimumValue) {
      return this.question.details.minimumValue;
    }
    if (num > this.question.details.maximumValue) {
      return this.question.details.maximumValue;
    }
    const intervalTestValue =
      (num - this.question.details.minimumValue) /
      this.question.details.valueInterval;
    if (
      Math.round(intervalTestValue * 1000) / 1000 !==
      Math.round(intervalTestValue)
    ) {
      return undefined;
    }
    return num;
  }
}
