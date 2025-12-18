import { UPPER_CATEGORIES, LOWER_CATEGORIES, type YatzyCategory } from './yatzyCategories';

export type PlayerScores = Record<YatzyCategory, string | undefined>;

/**
 * Calculate the sum of all upper section scores (Ones through Sixes)
 */
export function calculateUpperSum(scores: PlayerScores): number {
  return UPPER_CATEGORIES.map((cat) => parseInt(scores[cat] || '0', 10)).reduce((a, b) => a + b, 0);
}

/**
 * Determine if player qualifies for bonus (upper sum >= 63)
 * If qualified, bonus is 35 points, otherwise 0
 */
export function calculateBonus(upperSum: number): number {
  return upperSum > 62 ? 35 : 0;
}

/**
 * Calculate the sum of all lower section scores
 */
export function calculateLowerSum(scores: PlayerScores): number {
  return LOWER_CATEGORIES.map((cat) => parseInt(scores[cat] || '0', 10)).reduce((a, b) => a + b, 0);
}

/**
 * Calculate the total score for a player across all sections
 */
export function calculateRoundTotal(scores: PlayerScores): number {
  const upperSum = calculateUpperSum(scores);
  const bonus = calculateBonus(upperSum);
  const lowerSum = calculateLowerSum(scores);
  return upperSum + bonus + lowerSum;
}

/**
 * Calculate all score components at once
 */
export function calculateAllScores(scores: PlayerScores) {
  const upperSum = calculateUpperSum(scores);
  const bonus = calculateBonus(upperSum);
  const lowerSum = calculateLowerSum(scores);
  const total = upperSum + bonus + lowerSum;
  return { upperSum, bonus, lowerSum, total };
}
