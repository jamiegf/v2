import { assertUnreachable } from 'src/app/lib/assert-unreachable';

export type GameEngineBoolean = null | '0' | '1' | 0 | 1 | true | false;

export function parseGameEngineBoolean(geBoolean: GameEngineBoolean): boolean {
  switch (geBoolean) {
    case null:
      return false;
    case '0':
      return false;
    case 0:
      return false;
    case false:
      return false;
    case '1':
      return true;
    case 1:
      return true;
    case true:
      return true;
    default:
      assertUnreachable(geBoolean);
      throw new Error(`${geBoolean} is not a valid boolean representation`);
  }
}
