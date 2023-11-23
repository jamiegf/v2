import { CustomQuestionIconData } from 'src/app/core/models/pool/pool-details/question/custom-question-icon.type';

export interface SharedQuestionData {
  id: string;
  label: string;
  description?: string;
  customQuestionIcon?: CustomQuestionIconData;
  locked?: boolean;
}

export interface NearestToPinQuestionData extends SharedQuestionData {
  type: 'nearestToPin';
  minimumValue: number;
  maximumValue: number;
  /**
   * Whether or not a min value answer should be treated as including all values less than it
   */
  minValueOrLess: boolean;
  /**
   * Whether or not a max value answer should be treated as including all values more than it
   */
  maxValueOrMore: boolean;
  valueInterval: number;
}

export interface MultipleChoiceQuestionData extends SharedQuestionData {
  type: 'multipleChoice';
  choices: Choice[];
}

export interface Choice {
  customAnswerIcon?: string;
  description?: string;
  id: string;
  label: string;
  meta?: string[];
  points?: number;
  teamId?: string;
  title?: string;
}

export interface FixtureQuestionData extends SharedQuestionData {
  choices: FixtureChoice[];
  type: 'fixture';
}

export interface FixtureChoice {
  ids: [string, string];
  labels: [string, string];
}

export type QuestionData =
  | NearestToPinQuestionData
  | MultipleChoiceQuestionData
  | FixtureQuestionData;
