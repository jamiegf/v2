import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';

export const CategoryUrl = {
  [CategoryId.football]: 'football',
  [CategoryId.nfl]: 'nfl',
  [CategoryId.golf]: 'golf',
  [CategoryId.racing]: 'racing',
  [CategoryId.currentAffairs]: 'current-affairs',
  [CategoryId.special]: 'special',
  [CategoryId.rugbyUnion]: 'rugby-union',
  [CategoryId.ufc]: 'ufc',
  [CategoryId.cricket]: 'cricket',
  [CategoryId.motorSport]: 'motor-sport',
  [CategoryId.snooker]: 'snooker',
  [CategoryId.tennis]: 'tennis',
  [CategoryId.poker]: 'poker',
  [CategoryId.boxing]: 'boxing',
  [CategoryId.cycling]: 'cycling',
  [CategoryId.darts]: 'darts',
  [CategoryId.baseball]: 'baseball',
  [CategoryId.rugbyLeague]: 'rugby-league',
  [CategoryId.basketball]: 'basketball',
  [CategoryId.tv]: 'tv',
  [CategoryId.chess]: 'chess',
  [CategoryId.greyhounds]: 'greyhounds',
  [CategoryId.entertainment]: 'entertainment',
  [CategoryId.eSports]: 'esports',
  [CategoryId.athletics]: 'athletics',
} as const;

export type CategoryUrl = (typeof CategoryUrl)[keyof typeof CategoryUrl];

const CategoryUrlMap: { [key in CategoryUrl]: CategoryId } = {
  football: CategoryId.football,
  nfl: CategoryId.nfl,
  golf: CategoryId.golf,
  racing: CategoryId.racing,
  'current-affairs': CategoryId.currentAffairs,
  special: CategoryId.special,
  'rugby-union': CategoryId.rugbyUnion,
  ufc: CategoryId.ufc,
  cricket: CategoryId.cricket,
  'motor-sport': CategoryId.motorSport,
  snooker: CategoryId.snooker,
  tennis: CategoryId.tennis,
  poker: CategoryId.poker,
  boxing: CategoryId.boxing,
  cycling: CategoryId.cycling,
  darts: CategoryId.darts,
  baseball: CategoryId.baseball,
  'rugby-league': CategoryId.rugbyLeague,
  basketball: CategoryId.basketball,
  tv: CategoryId.tv,
  chess: CategoryId.chess,
  greyhounds: CategoryId.greyhounds,
  entertainment: CategoryId.entertainment,
  esports: CategoryId.eSports,
  athletics: CategoryId.athletics,
} as const;

export function CategoryUrlToCategoryId(url: string): CategoryId | undefined {
  return CategoryUrlMap[url as keyof typeof CategoryUrlMap];
}

