import { Observable, map } from 'rxjs';
import { CustomQuestionIcon } from 'src/app/core/models/pool/pool-details/question/custom-question-icon.type';
import {
  FixtureQuestionData,
  MultipleChoiceQuestionData,
  NearestToPinQuestionData,
  QuestionData,
} from 'src/app/core/models/pool/pool-details/question/question-data.interface';
import { AnswersService } from 'src/app/core/services/pool/answers.service';

abstract class QuestionShared<T extends QuestionData> {
  constructor(
    private answersService: AnswersService,
    public details: T,
  ) {}

  public answer$ = this.answersService.getAnswer$(this.details.id);
  public abstract answerLabel$: Observable<string | undefined>;
  public abstract questionIcon$: Observable<CustomQuestionIcon | undefined>;

  public setAnswer(answerId: string | undefined): void {
    this.answersService.putAnswer({
      questionId: this.details.id,
      answerId: answerId,
    });
  }
}

export class NearestToPinQuestion extends QuestionShared<NearestToPinQuestionData> {
  public readonly type = 'nearestToPin';
  public override answerLabel$: Observable<string | undefined> = this.answer$;
  public override questionIcon$: Observable<CustomQuestionIcon | undefined> =
    this.answerLabel$.pipe(
      map((answerLabel) => {
        if (!this.details.customQuestionIcon) return undefined;
        if (answerLabel) {
          return {
            icon: this.details.customQuestionIcon.defaultCompletedImageUrl,
            label: answerLabel,
          };
        } else {
          return {
            icon: this.details.customQuestionIcon.incompleteImageUrl,
            label: this.details.customQuestionIcon.label,
          };
        }
      }),
    );
}

export class MultipleChoiceQuestion extends QuestionShared<MultipleChoiceQuestionData> {
  public readonly type = 'multipleChoice';
  public override answerLabel$: Observable<string | undefined> =
    this.answer$.pipe(
      map(
        (answer) =>
          this.details.choices.find((choice) => choice.id === answer)?.label,
      ),
    );
  public override questionIcon$: Observable<CustomQuestionIcon | undefined> =
    this.answer$.pipe(
      map((answer) => {
        if (!this.details.customQuestionIcon) return undefined;
        if (answer) {
          const choice = this.details.choices.find(
            (choice) => choice.id === answer,
          );
          if (choice === undefined) {
            throw new Error('unrecognised answer ' + answer, { cause: this });
          }
          return {
            icon:
              choice.customAnswerIcon ||
              this.details.customQuestionIcon.defaultCompletedImageUrl,
            label: choice.label,
          };
        } else {
          return {
            icon: this.details.customQuestionIcon.incompleteImageUrl,
            label: this.details.customQuestionIcon.label,
          };
        }
      }),
    );
}

export class FixtureQuestion extends QuestionShared<FixtureQuestionData> {
  public readonly type = 'fixture';
  public override answerLabel$: Observable<string | undefined> =
    this.answer$.pipe(
      map((answer) => {
        if (!answer) return undefined;
        for (let i = 0; i < this.details.choices.length; i++) {
          const choice = this.details.choices[i];
          if (choice.ids[0] === answer) return choice.labels[0];
          else if (choice.ids[1] === answer) return choice.labels[1];
        }
        return undefined;
      }),
    );
  public override questionIcon$: Observable<CustomQuestionIcon | undefined> =
    this.answerLabel$.pipe(
      map((answerLabel) => {
        if (!this.details.customQuestionIcon) return undefined;
        if (answerLabel) {
          return {
            icon: this.details.customQuestionIcon.defaultCompletedImageUrl,
            label: answerLabel,
          };
        } else {
          return {
            icon: this.details.customQuestionIcon.incompleteImageUrl,
            label: this.details.customQuestionIcon.label,
          };
        }
      }),
    );
}

export function isQuestion(data: unknown): data is Question {
  return data instanceof QuestionShared;
}

export type Question =
  | NearestToPinQuestion
  | MultipleChoiceQuestion
  | FixtureQuestion;

export function createQuestionFromData(
  answersService: AnswersService,
  questionData: QuestionData,
): Question {
  switch (questionData.type) {
    case 'fixture':
      return new FixtureQuestion(answersService, questionData);
    case 'multipleChoice':
      return new MultipleChoiceQuestion(answersService, questionData);
    case 'nearestToPin':
      return new NearestToPinQuestion(answersService, questionData);
  }
}