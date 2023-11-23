import { GameEngineNumber } from 'src/app/lib/game-engine-number.type';
/**
 * Overview of a group of entries for a pool
 */
export interface Table {
  id: string;
  prize_pool: GameEngineNumber;
  prize_pool_net: GameEngineNumber;
}
