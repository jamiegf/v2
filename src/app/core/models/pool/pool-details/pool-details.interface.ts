import {
  Category,
  createCategory,
} from 'src/app/core/models/pool/category/category.type';
import {
  GameType,
  parseGameEngineGameType,
} from 'src/app/core/models/pool/game-type.type';
import { GameEnginePoolDetails } from 'src/app/core/models/pool/pool-details/game-engine-pool-details.interface';
import { parseGeQuestions } from 'src/app/core/models/pool/pool-details/question/parse-ge-questions';
import { QuestionData } from 'src/app/core/models/pool/pool-details/question/question-data.interface';
import { parseGameEngineBoolean } from 'src/app/lib/game-engine-boolean.type';
import { parseGameEngineNumber } from 'src/app/lib/game-engine-number.type';

/**
 * Interface for game engine pool details data
 * @see pool-details.class.ts
 */
export interface PoolDetails {
  readonly category: Category;
  readonly configurationDetails: Record<string, ConfigurationDetails>;
  readonly doubleUpQuestion: boolean;
  readonly eventTitle: string;
  readonly gameConfigurationIds: string[];
  readonly gameId: string;
  readonly gameType: GameType;
  readonly howToPlay: string;
  readonly questionData: QuestionData[];
  readonly scoringInfo?: string[];
  readonly coupon: boolean;
}

export interface ConfigurationDetails {
  stake: number;
  playerCount: number;
  prizes: number[];
}

/**
 * Create a PoolDetails interface from an array of pool details for a single game id.
 * @param gameEnginePoolDetails [gameConfigurationId: string, details: GameEnginePoolDetails][]
 * @returns
 */
export function convertGameEngineDetailsToInterface(
  gameEnginePoolDetails: { gcId: string; details: GameEnginePoolDetails }[],
): PoolDetails {
  if (gameEnginePoolDetails.length === 0) {
    throw new Error('No game engine pool details provided');
  }
  const doubleUpQuestion: boolean = parseGameEngineBoolean(
    gameEnginePoolDetails[0].details.stats.banker_question || false,
  );
  const scoringInfo: string[] | undefined = parseScoringInfo(
    gameEnginePoolDetails[0].details,
  );
  const howToPlay = gameEnginePoolDetails[0].details.stats.description_mobile;
  const gameConfigurationIds = gameEnginePoolDetails.map((item) => item.gcId);
  const gameId = gameEnginePoolDetails[0].details.stats.game_id;
  const gameType = parseGameEngineGameType(
    gameEnginePoolDetails[0].details.stats.type,
  );
  const eventTitle =
    gameEnginePoolDetails[0].details.stats.short_name ||
    gameEnginePoolDetails[0].details.stats.name;
  const category = createCategory(gameEnginePoolDetails[0].details.sport.id);
  const questionData = parseGeQuestions(gameEnginePoolDetails[0].details);
  const coupon = isCoupon(gameEnginePoolDetails[0].details);

  const configurationDetails: Record<string, ConfigurationDetails> = {};

  gameEnginePoolDetails.forEach((item) => {
    const details = item.details;
    if (details.stats.game_id !== gameId) {
      throw new Error(
        `Game id ${details.stats.game_id} does not match starting game id of ${gameId}`,
      );
    }
    configurationDetails[item.gcId] = parseConfigurationDetails(item.details);
  });

  return {
    category,
    configurationDetails,
    coupon,
    doubleUpQuestion,
    eventTitle,
    gameConfigurationIds,
    gameId,
    gameType,
    howToPlay,
    questionData,
    scoringInfo,
  };
}

function parseScoringInfo(
  gameEnginePoolDetails: GameEnginePoolDetails,
): string[] | undefined {
  if ('scorecomponents' in gameEnginePoolDetails) {
    return gameEnginePoolDetails.scorecomponents.map((scoreComponent) => {
      const position = scoreComponent.disciplines[0].positions[0];
      const value = position.score
        ? `${parseGameEngineNumber(position.score).toFixed(0)} points`
        : position.name;
      return `${scoreComponent.label}: ${value}`;
    });
  } else {
    return undefined;
  }
}

function isCoupon(gameEnginePoolDetails: GameEnginePoolDetails): boolean {
  return gameEnginePoolDetails.stats.name.toLowerCase().includes('coupon');
}

function parseConfigurationDetails(
  gameEnginePoolDetails: GameEnginePoolDetails,
): ConfigurationDetails {
  return {
    stake: parseGameEngineNumber(gameEnginePoolDetails.stats.stake),
    playerCount: parseGameEngineNumber(gameEnginePoolDetails.stats.num_players),
    prizes: parsePrizes(gameEnginePoolDetails),
  };
}

function parsePrizes(gameEnginePoolDetails: GameEnginePoolDetails): number[] {
  const prizes: number[] = gameEnginePoolDetails.stats?.prizes?.map((prize) =>
    parseGameEngineNumber(prize),
  );
  if (prizes.length === 0)
    prizes.push(parseGameEngineNumber(gameEnginePoolDetails.stats.prize_pool));
  return prizes;
}
