import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';

export const CategoryIcon: { readonly [key in CategoryId]: string } = {
  [CategoryId.football]: 'https://media.miomni.com/uploads/football_icon.png',
  [CategoryId.nfl]: 'https://media.miomni.com/uploads/nfl_icon.png',
  [CategoryId.golf]: 'https://media.miomni.com/uploads/golf_icon.png',
  [CategoryId.racing]: 'https://media.miomni.com/uploads/racing_icon.png',
  [CategoryId.currentAffairs]:
    'https://media.miomni.com/uploads/politics_icon.png',
  [CategoryId.special]: 'https://media.miomni.com/uploads/special_icon.png',
  [CategoryId.rugbyUnion]:
    'https://media.miomni.com/uploads/rugby_union_icon.png',
  [CategoryId.ufc]: 'https://media.miomni.com/uploads/ufc_icon.png',
  [CategoryId.cricket]: 'https://media.miomni.com/uploads/cricket_icon.png',
  [CategoryId.motorSport]:
    'https://media.miomni.com/uploads/motor-sport_icon.png',
  [CategoryId.snooker]: 'https://media.miomni.com/uploads/snooker_icon.png',
  [CategoryId.tennis]: 'https://media.miomni.com/uploads/tennis_icon.png',
  [CategoryId.poker]: 'https://media.miomni.com/uploads/poker_icon.png',
  [CategoryId.boxing]: 'https://media.miomni.com/uploads/boxing_icon.png',
  [CategoryId.cycling]: 'https://media.miomni.com/uploads/cycling_icon.png',
  [CategoryId.darts]: 'https://media.miomni.com/uploads/darts_icon.png',
  [CategoryId.baseball]: 'https://media.miomni.com/uploads/baseball_icon.png',
  [CategoryId.rugbyLeague]:
    'https://media.miomni.com/uploads/rugby_league_icon.png',
  [CategoryId.basketball]:
    'https://media.miomni.com/uploads/basketball_icon.png',
  [CategoryId.tv]: 'https://media.miomni.com/uploads/tv_icon.png',
  [CategoryId.chess]: 'https://media.miomni.com/uploads/chess_icon.png',
  [CategoryId.greyhounds]:
    'https://media.miomni.com/uploads/greyhounds_icon.png',
  [CategoryId.entertainment]: 'https://media.miomni.com/uploads/tv_icon.png',
  [CategoryId.eSports]: 'https://media.miomni.com/uploads/esports_icon.png',
  [CategoryId.athletics]: 'https://media.miomni.com/uploads/olympics_icon.png',
} as const;

export type CategoryIcon = (typeof CategoryIcon)[keyof typeof CategoryIcon];

export function getCategoryIcon(category: CategoryId): CategoryIcon {
  return CategoryIcon[category];
}
