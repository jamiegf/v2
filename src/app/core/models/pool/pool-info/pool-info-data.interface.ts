import {
  Category,
  createCategory,
} from 'src/app/core/models/pool/category/category.type';
import {
  GameType,
  parseGameEngineGameType,
} from 'src/app/core/models/pool/game-type.type';
import { GameEnginePoolInfo } from 'src/app/core/models/pool/pool-info/game-engine-pool-info.interface';
import { Seat } from 'src/app/core/models/pool/pool-info/seat.interface';
import { PoolStatus } from 'src/app/core/models/pool/pool-status.type';
import { parseGameEngineBoolean } from 'src/app/lib/game-engine-boolean.type';
import { parseGameEngineNumber } from 'src/app/lib/game-engine-number.type';

/**
 * Serializable internal data for PoolInfo
 * @see pool-info.class.ts
 */
export interface PoolInfoData {
  readonly category: Category;
  readonly closeDate: string;
  readonly configurationInfo: Record<string, ConfigurationSpecificInfo>;
  readonly endDate: string;
  readonly eventTitle: string;
  readonly gameConfigurationIds: string[];
  readonly gameId: string;
  readonly gameType: GameType;
  readonly statusMap: StatusMap;
  readonly playerCount: number;
  readonly tournament: string | null;
}

export type StatusMap = { [key in PoolStatus]: boolean };

export interface ConfigurationSpecificInfo {
  seats: Seat[];
  entryFee: number;
  stakeType: 'cash' | 'pointsOrCash';
  payoutType: 'cash' | 'points';
  prize: number;
}

/**
 * Creates a new instance of PoolInfo
 * @param gameEnginePoolInfo all pool info objects for a pool grouped by status
 * @throws can throw an error if the gameEnginePoolInfo is malformed or missing data
 */
export function convertGameEngineInfoToInterface(
  gameEnginePoolInfo: GameEnginePoolInfo[],
): PoolInfoData {
  if (gameEnginePoolInfo.length < 1) {
    throw new Error('no game engine pool info provided', {
      cause: gameEnginePoolInfo,
    });
  }
  const category = createCategory(gameEnginePoolInfo[0].game_sport_id);
  const closeDate = gameEnginePoolInfo[0].game_close_time;
  const endDate = gameEnginePoolInfo[0].game_end_time;
  const eventTitle = gameEnginePoolInfo[0].game_event;
  const gameId = gameEnginePoolInfo[0].game_id;
  const gameType = parseGameEngineGameType(gameEnginePoolInfo[0].game_type);
  const tournament = gameEnginePoolInfo[0].tournament || null;

  const configurationInfo: Record<string, ConfigurationSpecificInfo> = {};
  const gameConfigurationIdSet = new Set<string>();
  const statusSet = new Set<PoolStatus>();
  const statusMap: StatusMap = {
    available: false,
    in_progress: false,
    open: false,
    settled: false,
  };
  let playerCount = 0;

  gameEnginePoolInfo.forEach((item) => {
    configurationInfo[item.gameconfiguration_id] = parseConfigInfo(
      item,
      configurationInfo[item.gameconfiguration_id],
    );
    statusMap[item.status] = true;
    gameConfigurationIdSet.add(item.gameconfiguration_id);
    statusSet.add(item.status);
    playerCount = Math.max(playerCount, parsePlayerCount(item));
  });
  const gameConfigurationIds = Array.from(gameConfigurationIdSet.values());

  const poolInfo: PoolInfoData = {
    category,
    closeDate,
    configurationInfo: configurationInfo,
    endDate,
    eventTitle,
    gameConfigurationIds,
    gameId,
    gameType,
    statusMap,
    playerCount,
    tournament,
  };

  validatePoolInfo(poolInfo);

  return poolInfo;
}

function parsePlayerCount(gePoolInfo: GameEnginePoolInfo): number {
  if (gePoolInfo['num_players']) {
    return parseGameEngineNumber(gePoolInfo['num_players']);
  } else if (gePoolInfo['seats_taken']) {
    return parseGameEngineNumber(gePoolInfo['seats_taken']);
  } else if (gePoolInfo['seats']) {
    return gePoolInfo['seats'].reduce<number>((max, seat) => {
      return Math.max(max, parseGameEngineNumber(seat.seats_taken));
    }, 0);
  } else {
    return 0;
  }
}

function parseConfigInfo(
  gePoolInfo: GameEnginePoolInfo,
  existing: ConfigurationSpecificInfo | undefined,
): ConfigurationSpecificInfo {
  return {
    seats: gePoolInfo.seats || existing?.seats || [],
    entryFee: parseEntryFee(gePoolInfo),
    payoutType: parsePayoutType(gePoolInfo),
    prize: parsePrizeValue(gePoolInfo),
    stakeType: parseStakeType(gePoolInfo),
  };
}

function parseStakeType(
  gePoolInfo: GameEnginePoolInfo,
): 'cash' | 'pointsOrCash' {
  return parseGameEngineBoolean(gePoolInfo.gameconfiguration_allow_points_stake)
    ? 'pointsOrCash'
    : 'cash';
}

function parsePayoutType(gePoolInfo: GameEnginePoolInfo): 'cash' | 'points' {
  return parseGameEngineBoolean(gePoolInfo.pay_prizes_in_points)
    ? 'points'
    : 'cash';
}
function parseEntryFee(gePoolInfo: GameEnginePoolInfo): number {
  return parseGameEngineNumber(gePoolInfo.gameconfiguration_stake);
}

function parsePrizeValue(gePoolInfo: GameEnginePoolInfo): number {
  let prize = 0;
  if (gePoolInfo.prize_pool) {
    prize = Math.max(prize, parseGameEngineNumber(gePoolInfo.prize_pool));
  } else if (gePoolInfo.tables) {
    prize = Math.max(
      prize,
      parseGameEngineNumber(gePoolInfo.tables[0].prize_pool),
    );
  } else if (gePoolInfo.gameconfiguration_minimum_prize_pool) {
    prize = Math.max(
      prize,
      parseGameEngineNumber(gePoolInfo.gameconfiguration_minimum_prize_pool),
    );
  } else {
    throw new Error('No prize value available');
  }
  return prize;
}

/**
 * validates that all fields of a pool info are complete, will throw an error if any are undefined.
 * Want to make this more intelligent but have to balance with performance.
 * @param poolInfo
 * @throws error if any fields are undefined
 */
export function validatePoolInfo(poolInfo: PoolInfoData): void {
  Object.entries(poolInfo).forEach((entry) => {
    if (entry[1] === undefined) {
      throw new Error(`${entry[0]} is undefined`, { cause: poolInfo });
    }
  });
}
