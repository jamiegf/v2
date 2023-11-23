import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';

export const CategoryBackgroundImage: {
  readonly [key in CategoryId]: string;
} = {
  [CategoryId.football]: 'https://media.miomni.com/uploads/FOOTBALL-2-BG.jpg',
  [CategoryId.nfl]: 'https://media.miomni.com/uploads/AMERICAN-FOOTBALL-BG.jpg',
  [CategoryId.golf]: 'https://media.miomni.com/uploads/GOLF-BG.jpg',
  [CategoryId.racing]: 'https://media.miomni.com/uploads/HORSE-BG.jpg',
  [CategoryId.currentAffairs]:
    'https://media.miomni.com/uploads/GENERIC-BG.jpg',
  [CategoryId.special]: 'https://media.miomni.com/uploads/SPECIAL-BG.jpg',
  [CategoryId.rugbyUnion]: 'https://media.miomni.com/uploads/RUGBY-BG.jpg',
  [CategoryId.ufc]: 'https://media.miomni.com/uploads/UFC-BG.jpg',
  [CategoryId.cricket]: 'https://media.miomni.com/uploads/CRICKET-BG.jpg',
  [CategoryId.motorSport]: 'https://media.miomni.com/uploads/FORMULA1-BG.jpg',
  [CategoryId.snooker]: 'https://media.miomni.com/uploads/SNOOKER-BG.jpg',
  [CategoryId.tennis]: 'https://media.miomni.com/uploads/TENNIS-BG.jpg',
  [CategoryId.poker]: 'https://media.miomni.com/uploads/GENERIC-BG.jpg',
  [CategoryId.boxing]: 'https://media.miomni.com/uploads/BOXING-BG.jpg',
  [CategoryId.cycling]: 'https://media.miomni.com/uploads/GENERIC-BG.jpg',
  [CategoryId.darts]: 'https://media.miomni.com/uploads/DARTS-BG.jpg',
  [CategoryId.baseball]: 'https://media.miomni.com/uploads/BASEBALL-BG.jpg',
  [CategoryId.rugbyLeague]:
    'https://media.miomni.com/uploads/RUGBY-LEAGUE-BG.jpg',
  [CategoryId.basketball]: 'https://media.miomni.com/uploads/BASKETBALL-BG.jpg',
  [CategoryId.tv]: 'https://media.miomni.com/uploads/TV-BG.jpg',
  [CategoryId.chess]: 'https://media.miomni.com/uploads/GENERIC-BG.jpg',
  [CategoryId.greyhounds]: 'https://media.miomni.com/uploads/GREYHOUND-BG.jpg',
  [CategoryId.entertainment]: 'https://media.miomni.com/uploads/TV-BG.jpg',
  [CategoryId.eSports]: 'https://media.miomni.com/uploads/GENERIC-BG.jpg',
  [CategoryId.athletics]: 'https://media.miomni.com/uploads/GENERIC-BG.jpg',
} as const;

export type CategoryBackgroundImage =
  (typeof CategoryBackgroundImage)[keyof typeof CategoryBackgroundImage];

export function getCategoryBackground(
  category: CategoryId,
): CategoryBackgroundImage {
  return CategoryBackgroundImage[category];
}
