import { GameEngineBoolean } from 'src/app/lib/game-engine-boolean.type';
import { GameEngineNumber } from 'src/app/lib/game-engine-number.type';
/**
 * A set of entry details for a pool
 */
export interface Seat {
  in_bj: GameEngineBoolean;
  in_pj: GameEngineBoolean;
  joined: string;
  opponent: unknown;
  /**
   * null if pool is open
   */
  prize: null | GameEngineNumber;
  /**
   * null if pool is open
   */
  rank: null | GameEngineNumber;
  /**
   * should be true if the player needs to make a choice in a survivor pool. Not well understood mechanically so be cautious when using.
   */
  require_choice: null | GameEngineBoolean;
  seat_id: string;
  seats_taken: GameEngineNumber;
}
