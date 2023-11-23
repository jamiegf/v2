export const GameEngineGameType = {
  fantasy: 'fantasy_league',
  predictor: 'pool',
  survivor: 'last_man_standing',
} as const;

export type GameEngineGameType =
  (typeof GameEngineGameType)[keyof typeof GameEngineGameType];

export type GameType = 'fantasy' | 'survivor' | 'predictor';

const gameEngineGameTypeToInternal: { [key in GameEngineGameType]: GameType } =
  {
    fantasy_league: 'fantasy',
    last_man_standing: 'survivor',
    pool: 'predictor',
  };

export function parseGameEngineGameType(type: GameEngineGameType) {
  return gameEngineGameTypeToInternal[type];
}
