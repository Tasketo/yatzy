import { UPPER_CATEGORIES, type YatzyCategory } from './yatzyCategories';

const FIXED_SCORES: Record<string, number> = {
  'Small Straight': 30,
  'Large Straight': 40,
  'Full House': 25,
  Yatzy: 50,
};

const LOWER_CATEGORY_MAXES: Record<string, number> = {
  'One Pair': 12, // 6 + 6
  'Two Pairs': 22, // 6 + 6 + 5 + 5
  'Three of a Kind': 18, // 6 + 6 + 6
  'Four of a Kind': 24, // 6 + 6 + 6 + 6
  Chance: 30, // 6 + 6 + 6 + 6 + 6
};

function parseInteger(value: string): number | null {
  if (value === undefined || value === null) return null;
  const v = value.toString().trim();
  if (v === '') return null;
  const n = Number(v);
  if (!Number.isInteger(n)) return NaN;
  return n;
}

export function isValidCategoryValue(
  category: YatzyCategory,
  value: string,
): { valid: boolean; reasonKey?: string; messageParams?: Record<string, string | number> } {
  if (value === undefined || value === null || value.toString().trim() === '') {
    return { valid: false, reasonKey: 'Required' };
  }

  const n = parseInteger(value);
  if (n === null) return { valid: false, reasonKey: 'Required' };
  if (Number.isNaN(n)) return { valid: false, reasonKey: 'Must be an integer' };
  if (n < 0) return { valid: false, reasonKey: 'Must be non-negative' };

  // Upper categories: value must be divisible by the face (Ones=1, Twos=2...)
  // With 5 dice, max is 5 * face value (e.g., Sixes max is 30)
  // Note: 0 is valid for all upper categories (0 % any number === 0)
  const upperIndex = UPPER_CATEGORIES.indexOf(category);
  if (upperIndex !== -1) {
    const face = upperIndex + 1;
    const maxForCategory = 5 * face; // 5 dice max
    if (n > maxForCategory) {
      return { valid: false, reasonKey: 'Maximum is {{max}}', messageParams: { max: maxForCategory } };
    }
    if (n % face !== 0) {
      return { valid: false, reasonKey: 'Must be divisible by {{divisor}}', messageParams: { divisor: face } };
    }
    return { valid: true };
  }

  // Check lower category maximums first
  if (Object.prototype.hasOwnProperty.call(LOWER_CATEGORY_MAXES, category)) {
    const max = LOWER_CATEGORY_MAXES[category];
    if (n > max) {
      return { valid: false, reasonKey: 'Maximum is {{max}}', messageParams: { max } };
    }
  }

  // Fixed-score lower categories
  // Note: 0 is valid (represents "no score in this category"); otherwise must match exact fixed value
  if (Object.prototype.hasOwnProperty.call(FIXED_SCORES, category)) {
    const fixed = FIXED_SCORES[category];
    if (n !== 0 && n !== fixed)
      return { valid: false, reasonKey: 'Must be exactly {{value}}', messageParams: { value: fixed } };
  }

  return { valid: true };
}

export function validateRoundScores(
  scores: Record<YatzyCategory, string>,
): Record<YatzyCategory, { reasonKey?: string; messageParams?: Record<string, string | number> } | null> {
  const result = {} as Record<
    YatzyCategory,
    { reasonKey?: string; messageParams?: Record<string, string | number> } | null
  >;
  Object.keys(scores).forEach((k) => {
    const cat = k as YatzyCategory;
    const val = scores[cat];
    const check = isValidCategoryValue(cat, val);
    result[cat] = check.valid ? null : { reasonKey: check.reasonKey, messageParams: check.messageParams };
  });
  return result;
}

export default validateRoundScores;
