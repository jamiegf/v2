import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';
import {
  GE_FantasyChoice,
  GE_FantasyPoolDetails,
  GE_Fixture_Choice_Order,
  GE_MultipleChoice,
  GE_MultipleChoiceQuestion,
  GE_NearestPinQuestion,
  GE_Position,
  GE_PredictorPoolDetails,
  GE_Race,
  GE_SurvivorPoolDetails,
  GE_WeekChoices,
  GE_WeekFixtures,
  GE_YesNoQuestion,
  GameEnginePoolDetails,
} from 'src/app/core/models/pool/pool-details/game-engine-pool-details.interface';
import {
  CustomQuestionIconData,
  getPositionCustomIcon,
} from 'src/app/core/models/pool/pool-details/question/custom-question-icon.type';
import {
  Choice,
  FixtureChoice,
  MultipleChoiceQuestionData,
  NearestToPinQuestionData,
  QuestionData,
} from 'src/app/core/models/pool/pool-details/question/question-data.interface';
import { parseGameEngineBoolean } from 'src/app/lib/game-engine-boolean.type';
import { parseGameEngineNumber } from 'src/app/lib/game-engine-number.type';

export function parseGeQuestions(
  gameEnginePoolDetails: GameEnginePoolDetails,
): QuestionData[] {
  if ('questions' in gameEnginePoolDetails) {
    return parsePredictorQuestions(gameEnginePoolDetails);
  } else if ('weeks' in gameEnginePoolDetails) {
    return parseSurvivorQuestions(gameEnginePoolDetails);
  } else if ('disciplines' in gameEnginePoolDetails) {
    return parseFantasyQuestions(gameEnginePoolDetails);
  } else {
    throw new Error(
      `Pool details is lacking data required to generate questions`,
      { cause: gameEnginePoolDetails },
    );
  }
}

export function parsePredictorQuestions(
  predictorPoolDetails: GE_PredictorPoolDetails,
): QuestionData[] {
  return predictorPoolDetails.questions.map<QuestionData>((question) => {
    if (question.type === 'multiple_choice') {
      return parseMultipleChoicePredictorQuestion(question);
    } else if (question.type === 'nearest_to_pin_range') {
      return parseNearestPin(question);
    } else if (question.type === 'yes_no') {
      return parseYesNo(question);
    } else {
      throw new Error('Question type not recognised', { cause: question });
    }
  });
}

function parseYesNo(
  yesNoQuestion: GE_YesNoQuestion,
): MultipleChoiceQuestionData {
  return {
    id: yesNoQuestion.question_id,
    choices: [
      {
        id: '0',
        label: yesNoQuestion.options.no_label,
        points:
          parseGameEngineNumber(yesNoQuestion.no_score_factor) *
          parseGameEngineNumber(yesNoQuestion.options.no_score),
      },
      {
        id: '1',
        label: yesNoQuestion.options.yes_label,
        points:
          parseGameEngineNumber(yesNoQuestion.yes_score_factor) *
          parseGameEngineNumber(yesNoQuestion.options.yes_score),
      },
    ],
    label: yesNoQuestion.label,
    type: 'multipleChoice',
  };
}

function parseMultipleChoicePredictorQuestion(
  multipleChoiceQuestion: GE_MultipleChoiceQuestion,
): MultipleChoiceQuestionData {
  return {
    choices: parsePredictorMultipleChoices(
      multipleChoiceQuestion.options.choices,
    ),
    description:
      multipleChoiceQuestion.description ||
      multipleChoiceQuestion.options.label,
    id: multipleChoiceQuestion.question_id,
    label: multipleChoiceQuestion.label,
    type: 'multipleChoice',
  };
}

function parsePredictorMultipleChoices(choices: GE_MultipleChoice[]): Choice[] {
  return choices.map<Choice>((choice) => {
    return {
      id: choice.value,
      label: choice.label,
      points: parseGameEngineNumber(choice.score),
    };
  });
}

function parseNearestPin(
  nearestPinQuestion: GE_NearestPinQuestion,
): NearestToPinQuestionData {
  return {
    description: nearestPinQuestion.points || nearestPinQuestion.description,
    id: nearestPinQuestion.question_id,
    label: nearestPinQuestion.label,
    maximumValue: parseGameEngineNumber(nearestPinQuestion.options.max_value),
    maxValueOrMore: parseGameEngineBoolean(
      nearestPinQuestion.options.max_value_or_more,
    ),
    minimumValue: parseGameEngineNumber(nearestPinQuestion.options.min_value),
    minValueOrLess: parseGameEngineBoolean(
      nearestPinQuestion.options.min_value_or_less,
    ),
    type: 'nearestToPin',
    valueInterval: parseGameEngineNumber(nearestPinQuestion.options.step),
  };
}

export function parseFantasyQuestions(
  fantasyPoolDetails: GE_FantasyPoolDetails,
): QuestionData[] {
  if (fantasyPoolDetails.sport.id === CategoryId.racing) {
    return parseRacePoolQuestions(fantasyPoolDetails);
  } else {
    return fantasyPoolDetails.disciplines[0].positions.map(
      (position, index) => {
        return parseGenericFantasyQuestion(
          position,
          getPositionCustomIcon(position, index),
        );
      },
    );
  }
}

function parseGenericFantasyQuestion(
  position: GE_Position,
  customQuestionIcon?: CustomQuestionIconData,
): MultipleChoiceQuestionData {
  return {
    choices: parseFantasyChoices(position.choices),
    customQuestionIcon,
    id: position.position_id,
    label: position.label,
    type: 'multipleChoice',
  };
}

function parseFantasyChoices(choices: GE_FantasyChoice[]): Choice[] {
  return choices.map<Choice>((choice) => {
    return {
      id: choice.value,
      label: choice.label,
      teamId: choice.team_id || undefined,
    };
  });
}

function parseRacePoolQuestions(
  racePoolDetails: GE_FantasyPoolDetails,
): MultipleChoiceQuestionData[] {
  return racePoolDetails.disciplines[0].positions.map<MultipleChoiceQuestionData>(
    (position, index) => {
      return {
        choices: parseRaceFantasyChoices(position.choices, position.race),
        customQuestionIcon: {
          incompleteImageUrl:
            'https://media.miomni.com/uploads/RacingSilks-Outline-Icon.png',
          defaultCompletedImageUrl:
            'https://media.miomni.com/uploads/RacingSilks-Outline-Icon.png',
          label: `Race ${index + 1}`,
        },
        description: 'Pick one as your winning horse from the selections below',
        id: position.position_id,
        label: position.label,
        type: 'multipleChoice',
      };
    },
  );
}

function parseRaceFantasyChoices(
  choices: GE_FantasyChoice[],
  race: GE_Race | undefined,
): Choice[] {
  return choices.map<Choice>((choice) => {
    const meta = race ? parseRaceMeta(race) : undefined;
    return {
      ...parseRaceChoiceDetails(choice),
      customAnswerIcon: choice.img_ref,
      id: choice.value,
      meta: meta,
      teamId: choice.team_id || undefined,
    };
  });
}

function parseRaceChoiceDetails(
  choice: GE_FantasyChoice,
): Pick<Choice, 'description' | 'label' | 'title'> {
  let label = choice.label;
  let description, title: string | undefined;
  const runnerDetailsRegex = /^(\d+)\.(.*)\((.*),(.*)\)$/;
  const regexResult = runnerDetailsRegex.exec(label);
  if (regexResult) {
    label = regexResult[2];
    title = regexResult[1];
    description = `Jockey: ${regexResult[3]} / Trainer: ${regexResult[4]}`;
  }

  return {
    description,
    label,
    title,
  };
}

function parseRaceMeta(race: GE_Race): string[] {
  return [
    `Type: ${race.type}`,
    `Course ${race.course}`,
    `Race Number ${race.number}`,
    `Start time ${race.start}`,
  ];
}

export function parseSurvivorQuestions(
  survivorPoolDetails: GE_SurvivorPoolDetails,
): QuestionData[] {
  const choiceLabels = parseGameEngineChoiceLabels(
    survivorPoolDetails.choicelabels,
  );
  const currentWeekId = survivorPoolDetails.choices?.this_week.id;
  return survivorPoolDetails.weeks.map<QuestionData>((week) => {
    if ('fixtures' in week) {
      return {
        choices: parseFixtures(
          week,
          survivorPoolDetails.sport.fixture_name_order,
          choiceLabels,
        ),
        id: week.id,
        label: week.name,
        locked: currentWeekId !== week.id,
        type: 'fixture',
      };
    } else if ('choices' in week) {
      return {
        choices: parseSurvivorChoices(week, choiceLabels),
        id: week.id,
        label: week.name,
        locked: currentWeekId !== week.id,
        type: 'multipleChoice',
      };
    } else {
      throw new Error(`unrecognised survivor week question type`, {
        cause: week,
      });
    }
  });
}

function parseGameEngineChoiceLabels(
  gameEngineChoiceLabels: Record<string, string>,
): Record<string, string> {
  const choiceLabels: Record<string, string> = {};
  Object.entries(gameEngineChoiceLabels).forEach((choiceLabel) => {
    const id = choiceLabel[0].split('_')[1];
    choiceLabels[id] = choiceLabel[1];
  });
  return choiceLabels;
}

function parseFixtures(
  week: GE_WeekFixtures,
  choiceOrder: GE_Fixture_Choice_Order,
  choiceLabels: Record<string, string>,
): FixtureChoice[] {
  return week.fixtures.map<FixtureChoice>((fixture) => {
    if (choiceOrder === 'away_home') {
      return {
        ids: [fixture.away_team_id, fixture.home_team_id],
        labels: [
          choiceLabels[fixture.away_team_id],
          choiceLabels[fixture.home_team_id],
        ],
      };
    } else if (choiceOrder === 'home_away') {
      return {
        ids: [fixture.home_team_id, fixture.away_team_id],
        labels: [
          choiceLabels[fixture.home_team_id],
          choiceLabels[fixture.away_team_id],
        ],
      };
    } else {
      throw new Error(`Choice order ${choiceOrder} not recognised`, {
        cause: { choiceOrder: choiceOrder, week: week },
      });
    }
  });
}

function parseSurvivorChoices(
  week: GE_WeekChoices,
  choiceLabels: Record<string, string>,
): Choice[] {
  return week.choices.map<Choice>((choice) => {
    return {
      id: choice,
      label: choiceLabels[choice],
    };
  });
}
