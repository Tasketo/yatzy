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

export const YATZY_CATEGORY_HELPERS: Record<YatzyCategory, string> = {
  Ones: 'Sum of all dice showing 1.',
  Twos: 'Sum of all dice showing 2.',
  Threes: 'Sum of all dice showing 3.',
  Fours: 'Sum of all dice showing 4.',
  Fives: 'Sum of all dice showing 5.',
  Sixes: 'Sum of all dice showing 6.',
  Bonus: 'If the sum of Ones to Sixes is 63 or more, score 35 points.',
  'One Pair': 'Sum of the two highest matching dice.',
  'Two Pairs': 'Sum of two different pairs (4 dice). Example: 2-2-5-5-6 scores 2+2+5+5=14.',
  'Three of a Kind': 'Sum of three matching dice.',
  'Four of a Kind': 'Sum of four matching dice.',
  'Small Straight': 'For dices in a row (e.g. 1-2-3-4). Score 30 points.',
  'Large Straight': 'For dices in a row (e.g. 1-2-3-4-5). Scores 40 points.',
  'Full House': 'A pair and three of a kind (e.g., 2-2-3-3-3). Scores 25 points.',
  Chance: 'Sum of all dice (any combination).',
  Yatzy: 'All five dice the same. Scores 35 points.',
};
