import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';
import { GameEngineGameType } from 'src/app/core/models/pool/game-type.type';
import { PoolStatus } from 'src/app/core/models/pool/pool-status.type';
import { GameEngineBoolean } from 'src/app/lib/game-engine-boolean.type';
import { GameEngineNumber as GE_GameEngineNumber } from 'src/app/lib/game-engine-number.type';

export interface GameEnginePoolDetailsShared {
  errors: unknown[];
  success: GameEngineBoolean;
  num_seats: GE_GameEngineNumber;
  stats: GE_PoolStats;
  entered: GameEngineBoolean;
  type: unknown;
  challenge: unknown;
  sport: GE_Sport;
}

export interface GE_PoolStats {
  prize_pool: GE_GameEngineNumber;
  prize_pool_net: GE_GameEngineNumber;
  betting_widget: unknown;
  num_players: GE_GameEngineNumber;
  stake: GE_GameEngineNumber;
  max_entries: GE_GameEngineNumber;
  game_id: string;
  name: string;
  short_name: string;
  type: GameEngineGameType;
  data_linked: unknown;
  non_runner_rule: unknown;
  perms: unknown;
  mobile_perms: unknown;
  description: string;
  description_mobile: string;
  description_plain: string;
  state: PoolStatus;
  banker_question: GameEngineBoolean;
  banker_name: string;
  banker_nearest_wins: GameEngineBoolean;
  /**
   * can be empty
   */
  prizes: string[];
  /**
   * time stamp
   */
  close_time: GE_GameEngineNumber;
  time_left: GE_GameEngineNumber;
  title_yes_no?: unknown;
  title_multiple_choice?: unknown;
  title_nearest_to_pin?: unknown;
  choice_type?: string;
}

export interface GE_Sport {
  id: CategoryId;
  name: string;
  fixture_name_order: GE_Fixture_Choice_Order;
  fixture_name_separator: string;
}

export type GE_Fixture_Choice_Order = 'home_away' | 'away_home';

export interface GE_PredictorPoolDetails extends GameEnginePoolDetailsShared {
  questions: GE_PredictorQuestion[];
}

export interface GE_QuestionShared {
  question_id: string;
  label: string;
  description: string;
}

export interface GE_MultipleChoiceQuestion extends GE_QuestionShared {
  type: 'multiple_choice';
  num_points: string;
  options: GE_MultipleChoiceOptions;
}

export interface GE_MultipleChoiceOptions {
  label: string;
  choices: GE_MultipleChoice[];
}

export interface GE_MultipleChoice {
  value: string;
  label: string;
  score: GE_GameEngineNumber;
  score_factor: GE_GameEngineNumber;
}

export interface GE_NearestPinQuestion extends GE_QuestionShared {
  type: 'nearest_to_pin_range';
  points: string;
  options: GE_NearestToPinOptions;
}

export interface GE_NearestToPinOptions {
  min_value: GE_GameEngineNumber;
  min_value_or_less: GameEngineBoolean;
  max_value: GE_GameEngineNumber;
  max_value_or_more: GameEngineBoolean;
  step: GE_GameEngineNumber;
  score: unknown;
}

export interface GE_YesNoQuestion extends GE_QuestionShared {
  type: 'yes_no';
  options: {
    yes_label: string;
    yes_score: GE_GameEngineNumber;
    no_label: string;
    no_score: GE_GameEngineNumber;
  };
  num_points: string;
  no_score_factor: GE_GameEngineNumber;
  yes_score_factor: GE_GameEngineNumber;
}

type GE_PredictorQuestion =
  | GE_MultipleChoiceQuestion
  | GE_NearestPinQuestion
  | GE_YesNoQuestion;

export interface GE_SurvivorPoolDetails extends GameEnginePoolDetailsShared {
  choicelabels: Record<string, string>;
  weeks: GE_Week[];
  teams: string[];
  /**
   * Relates to ids in {@link weeks}
   */
  choices?: {
    this_week: {
      id: string;
    };
    next_week: {
      id: string;
    };
  };
}

export interface GE_WeekShared {
  id: string;
  name: string;
  /**
   * YYYY-MM-DD
   */
  start: string;
  /**
   * YYYY-MM-DD
   */
  end: string;
}

export interface GE_WeekFixtures extends GE_WeekShared {
  fixtures: {
    home_team_id: string;
    away_team_id: string;
  }[];
}

export interface GE_WeekChoices extends GE_WeekShared {
  choices: string[];
}

type GE_Week = GE_WeekFixtures | GE_WeekChoices;

export interface GE_FantasyPoolDetails extends GameEnginePoolDetailsShared {
  disciplines: GE_Discipline[];
  scorecomponents: GE_ScoreComponent[];
}

export interface GE_Discipline {
  discipline_id: string;
  label: string;
  /**
   * Use {@link GE_FantasyChoice.team_id} to verify
   */
  one_participant_per_team?: GameEngineBoolean;
  /**
   * Use {@link GE_FantasyChoice.team_id} to verify
   */
  num_participants_per_team?: GE_GameEngineNumber; // cricket
  /**
   * Have to string check {@link GE_FantasyChoice.label}
   */
  unique_participant_choices?: GameEngineBoolean; // cricket
  positions: GE_Position[];
}

export interface GE_Position {
  position_id: string;
  label: string;
  type: unknown;
  /**
   * Meta data, not always present.
   */
  race?: GE_Race;
  choices: GE_FantasyChoice[];
}

export interface GE_Race {
  name: string;
  title: string;
  distance: string;
  going: string;
  course: string;
  meeting: string;
  date: string;
  start: string;
  type: string;
  number: GE_GameEngineNumber;
}

export interface GE_FantasyChoice {
  score_factor: GE_GameEngineNumber;
  value: string;
  label: string;
  img_ref?: string;
  horse_age?: string;
  horse_weight?: string;
  horse_rating?: string;
  team_id?: string | null;
}

export interface GE_ScoreComponent {
  label: string;
  disciplines: GE_ScoreComponentDiscipline[];
}

export interface GE_ScoreComponentDiscipline {
  id: string;
  positions: GE_ScoreComponentPosition[];
}

export interface GE_ScoreComponentPosition {
  id: string;
  score?: GE_GameEngineNumber;
  name?: string;
}

export type GameEnginePoolDetails =
  | GE_PredictorPoolDetails
  | GE_SurvivorPoolDetails
  | GE_FantasyPoolDetails;
