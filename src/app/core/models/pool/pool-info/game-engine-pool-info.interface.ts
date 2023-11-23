import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';
import { GameEngineGameType } from 'src/app/core/models/pool/game-type.type';
import { Seat } from 'src/app/core/models/pool/pool-info/seat.interface';
import { Table } from 'src/app/core/models/pool/pool-info/table.interface';
import { PoolStatus } from 'src/app/core/models/pool/pool-status.type';
import { GameEngineBoolean } from 'src/app/lib/game-engine-boolean.type';
import { GameEngineNumber } from 'src/app/lib/game-engine-number.type';

/**
 * The data received from the game engine on a get all pools call.
 * This data is unreliable at best, do not assume values will be available, be prepared to catch exceptions on use.
 * Furthermore some items have been left as unknown as they are currently unused pending further investigation on their behaviour.
 */
export interface GameEnginePoolInfo {
  allow_invitations: GameEngineBoolean;
  answers_editable: GameEngineBoolean;
  betradar_id: unknown;
  betting_widget: GameEngineBoolean;
  big_jackpot_fee: unknown;
  big_jackpot_prize: unknown;
  big_jackpot: GameEngineBoolean;
  challenges_enabled: GameEngineBoolean;
  daily_featured: GameEngineBoolean;
  date_settled: null | string;
  feescale: unknown;
  fixtures: unknown;
  game_big_jackpot_fee: unknown;
  game_close_time: string;
  game_current_gameweek_id: unknown;
  game_data_linked: GameEngineBoolean;
  game_end_score: unknown;
  game_end_time: string;
  game_event_url: string;
  game_event: string;
  game_id: string;
  game_last_updated_scores: unknown;
  game_mailinglist_id: unknown;
  game_open_time: string;
  game_sport_id: CategoryId;
  game_started: GameEngineBoolean;
  game_title_include_week_type: GameEngineBoolean;
  game_title_week_type: unknown;
  game_type: GameEngineGameType;
  gameconfiguration_additional_prize_pool: GameEngineNumber;
  gameconfiguration_allow_points_stake: GameEngineBoolean;
  gameconfiguration_id: string;
  gameconfiguration_ipools_fee_percent: GameEngineNumber;
  gameconfiguration_max_players: null | GameEngineNumber;
  gameconfiguration_min_players: GameEngineNumber;
  gameconfiguration_minimum_prize_pool: GameEngineNumber;
  gameconfiguration_open_pool: unknown;
  gameconfiguration_sort_order: unknown;
  gameconfiguration_stake_points: unknown;
  gameconfiguration_stake: GameEngineNumber;
  gameconfiguration_type: unknown;
  has_stats: GameEngineBoolean;
  highlight_backcolor: unknown;
  highlight_forecolor: unknown;
  highlight_textcolor: unknown;
  highlighted: unknown;
  main_featured: GameEngineBoolean;
  no_choices: unknown;
  /**
   * Only present when status === 'available'
   */
  num_player_seats: null | GameEngineNumber;
  /**
   * Only present when status === 'settled'
   */
  num_players: null | GameEngineNumber;
  own_pool: unknown;
  pay_prizes_in_points: GameEngineBoolean;
  private: unknown;
  /**
   * seems to be null if table isn't
   */
  prize_pool_net: null | GameEngineNumber;
  /**
   * seems to be null if table isn't
   */
  prize_pool: null | GameEngineNumber;
  /**
   * should only be present if rollover is true
   */
  prizefundtransfer: null | GameEngineNumber;
  progressive_jackpot: GameEngineBoolean;
  rollover: GameEngineBoolean;
  seat_id: string;
  /**
   * only present if settled
   */
  seat_prize: null | GameEngineNumber;
  /**
   * only present if settled
   */
  seat_rank: null | GameEngineNumber;
  /**
   * only present if settled
   */
  seat_score: null | GameEngineNumber;
  /**
   * only present if available
   */
  seats_taken: null | GameEngineNumber;
  /**
   * not present if available, a players seats in the pool
   */
  seats: null | Seat[];
  sport_name: string;
  status: PoolStatus;
  /**
   * present if available
   */
  table_id: null | string;
  /**
   * present if available
   */
  table_ids: null | string;
  /**
   * present if anyone has joined game
   */
  tables: null | Table[];
  time_left: unknown;
  tournament?: string | null;
}
