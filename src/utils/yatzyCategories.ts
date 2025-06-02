export type YatzyCategory =
  | 'Ones'
  | 'Twos'
  | 'Threes'
  | 'Fours'
  | 'Fives'
  | 'Sixes'
  | 'Bonus'
  | 'One Pair'
  | 'Two Pairs'
  | 'Three of a Kind'
  | 'Four of a Kind'
  | 'Small Straight'
  | 'Large Straight'
  | 'Full House'
  | 'Chance'
  | 'Yatzy';

export const UPPER_CATEGORIES: YatzyCategory[] = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];
export const LOWER_CATEGORIES: YatzyCategory[] = [
  'One Pair',
  'Two Pairs',
  'Three of a Kind',
  'Four of a Kind',
  'Small Straight',
  'Large Straight',
  'Full House',
  'Chance',
  'Yatzy',
];
export const BONUS_CATEGORY: YatzyCategory = 'Bonus';
