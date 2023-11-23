import { Category } from 'src/app/core/models/pool/category/category.type';
import { GameType } from 'src/app/core/models/pool/game-type.type';
import { GameEnginePoolInfo } from 'src/app/core/models/pool/pool-info/game-engine-pool-info.interface';
import {
  ConfigurationSpecificInfo,
  PoolInfoData,
  StatusMap,
  convertGameEngineInfoToInterface,
} from 'src/app/core/models/pool/pool-info/pool-info-data.interface';
import { Seat } from 'src/app/core/models/pool/pool-info/seat.interface';
import { parseGameEngineDate } from 'src/app/lib/parse-game-engine-date';

/**
 * Interface class for game engine pool info
 */
export class PoolInfo {
  private readonly info: PoolInfoData;
  // Cache
  private _entryFeeDescription: EntryFeeDescription | undefined = undefined;
  private _canJoinWithPoints: boolean | undefined = undefined;
  private _prizeDescription: string | undefined = undefined;

  public readonly closeDate: Date;
  public readonly endDate: Date;
  public readonly seats: readonly Seat[];

  /**
   * Creates a new instance of PoolInfo
   * @param info {GameEnginePoolInfo[] | PoolInfoData} provide an existing poolInfoData object or an array of data from the game engine
   * @throws can throw an error if the gameEnginePoolInfo is malformed or missing data
   */
  constructor(info: GameEnginePoolInfo[] | PoolInfoData) {
    if (isGameEnginePoolInfo(info)) {
      this.info = convertGameEngineInfoToInterface(info);
    } else {
      this.info = info;
    }
    this.closeDate = parseGameEngineDate(this.info.closeDate);
    this.endDate = parseGameEngineDate(this.info.endDate);
    this.seats = this.parseSeats(this.info);
  }

  private parseSeats(info: PoolInfoData): Seat[] {
    const seatsMap = Object.values(info.configurationInfo).reduce<
      Map<string, Seat>
    >((seats, config) => {
      config.seats.forEach((seat) => {
        seats.set(seat.seat_id, seat);
      });
      return seats;
    }, new Map<string, Seat>());
    return Array.from(seatsMap.values());
  }

  private sortEntryFees(info: PoolInfoData): number[] {
    return Object.values(info.configurationInfo)
      .map((config) => config.entryFee)
      .sort((a, b) => {
        return a - b;
      });
  }

  private parseEntryFeeDescription(
    poolInfo: PoolInfoData,
  ): EntryFeeDescription {
    const entryFeesSorted = this.sortEntryFees(poolInfo);
    let [entryFeeCash, entryFeePoints]: EntryFeeDescription = ['', ''];
    const min = entryFeesSorted[0];
    if (min === 0) {
      entryFeeCash = 'FREE';
      entryFeePoints = 'FREE';
    } else {
      entryFeeCash = `£${entryFeesSorted[0]}`;
      entryFeePoints = `${entryFeesSorted[0] * 100}pts`;
    }
    const max = entryFeesSorted.at(-1);
    if (max && max > entryFeesSorted[0]) {
      entryFeeCash += ` - £${max}`;
      entryFeePoints += ` - ${max * 100}pts`;
    }

    if (!this.canJoinWithPoints || entryFeeCash === entryFeePoints) {
      entryFeePoints = null;
    }

    return [entryFeeCash, entryFeePoints];
  }
  private parseJoinWithPoints(poolInfo: PoolInfoData): boolean {
    const configs = Object.values(poolInfo.configurationInfo);
    for (let i = 0; i < configs.length; i++) {
      if (configs[i].stakeType === 'pointsOrCash') return true;
    }
    return false;
  }

  private parsePrizeDescription(poolInfo: PoolInfoData): string {
    const configs = Object.entries(poolInfo.configurationInfo);
    configs.sort((a, b) => a[1].prize - b[1].prize);
    const min = configs[0][1];
    const max = configs.at(-1)?.[1];
    let prize = this.parseConfigPrizeDescription(min);
    if (max && (max.prize !== min.prize || max.payoutType !== min.payoutType)) {
      prize += ` - ` + this.parseConfigPrizeDescription(max);
    }
    return prize;
  }

  private parseConfigPrizeDescription(
    configInfo: ConfigurationSpecificInfo,
  ): string {
    if (configInfo.payoutType === 'cash') {
      return `£${configInfo.prize}`;
    } else {
      return `${configInfo.prize * 100}`;
    }
  }

  public get entryFeeDescription(): EntryFeeDescription {
    if (!this._entryFeeDescription) {
      this._entryFeeDescription = this.parseEntryFeeDescription(this.info);
    }
    return this._entryFeeDescription;
  }

  public get prizeDescription(): string {
    if (!this._prizeDescription) {
      this._prizeDescription = this.parsePrizeDescription(this.info);
    }
    return this._prizeDescription;
  }

  public get canJoinWithPoints(): boolean {
    if (this._canJoinWithPoints === undefined) {
      this._canJoinWithPoints = this.parseJoinWithPoints(this.info);
    }
    return this._canJoinWithPoints;
  }

  public get statusMap(): StatusMap {
    return this.info.statusMap;
  }

  public get category(): Category {
    return this.info.category;
  }

  public get gameType(): GameType {
    return this.info.gameType;
  }

  public get eventTitle(): string {
    return this.info.eventTitle;
  }

  public get gameId(): string {
    return this.info.gameId;
  }

  public get gameConfigurationIds(): string[] {
    return this.info.gameConfigurationIds;
  }

  public get configurationInfo(): Record<string, ConfigurationSpecificInfo> {
    return this.info.configurationInfo;
  }

  public get tournament(): string | null {
    return this.info.tournament;
  }
}

function isGameEnginePoolInfo(
  data: GameEnginePoolInfo[] | PoolInfoData,
): data is GameEnginePoolInfo[] {
  return data instanceof Array;
}

type EntryFeeDescription = [string, string | null];
