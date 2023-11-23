import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';

export const CategoryTitle = {
  [CategoryId.football]: 'Football',
  [CategoryId.nfl]: 'NFL',
  [CategoryId.golf]: 'Golf',
  [CategoryId.racing]: 'Racing',
  [CategoryId.currentAffairs]: 'Current Affairs',
  [CategoryId.special]: 'Special',
  [CategoryId.rugbyUnion]: 'Rugby Union',
  [CategoryId.ufc]: 'UFC',
  [CategoryId.cricket]: 'Cricket',
  [CategoryId.motorSport]: 'Motor Sport',
  [CategoryId.snooker]: 'Snooker',
  [CategoryId.tennis]: 'Tennis',
  [CategoryId.poker]: 'Poker',
  [CategoryId.boxing]: 'Boxing',
  [CategoryId.cycling]: 'Cycling',
  [CategoryId.darts]: 'Darts',
  [CategoryId.baseball]: 'Baseball',
  [CategoryId.rugbyLeague]: 'Rugby',
  [CategoryId.basketball]: 'Basketball',
  [CategoryId.tv]: 'TV',
  [CategoryId.chess]: 'Chess',
  [CategoryId.greyhounds]: 'Greyhounds',
  [CategoryId.entertainment]: 'Entertainment',
  [CategoryId.eSports]: 'eSports',
  [CategoryId.athletics]: 'Athletics',
} as const;

export type CategoryTitle = (typeof CategoryTitle)[keyof typeof CategoryTitle];

export function getCategoryTitle(category: CategoryId): CategoryTitle {
  return CategoryTitle[category];
}
