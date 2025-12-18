import { UPPER_CATEGORIES, type YatzyCategory } from './yatzyCategories';

const FIXED_SCORES: Record<string, number> = {
  'Small Straight': 30,
  'Large Straight': 40,
  'Full House': 25,
  Yatzy: 50,
};

function parseInteger(value: string): number | null {
  if (value === undefined || value === null) return null;
  const v = value.toString().trim();
  if (v === '') return null;
  const n = Number(v);
  if (!Number.isInteger(n)) return NaN;
  return n;
}

export function isValidCategoryValue(category: YatzyCategory, value: string): { valid: boolean; reason?: string } {
  if (value === undefined || value === null || value.toString().trim() === '') {
    return { valid: false, reason: 'Required' };
  }

  const n = parseInteger(value);
  if (n === null) return { valid: false, reason: 'Required' };
  if (Number.isNaN(n)) return { valid: false, reason: 'Must be an integer' };
  if (n < 0) return { valid: false, reason: 'Must be non-negative' };
  if (n > 999) return { valid: false, reason: 'Too large' };

  // Upper categories: value must be divisible by the face (Ones=1, Twos=2...)
  const upperIndex = UPPER_CATEGORIES.indexOf(category);
  if (upperIndex !== -1) {
    const face = upperIndex + 1;
    if (n % face !== 0) {
      return { valid: false, reason: `Must be divisible by ${face}` };
    }
  }

  // Fixed-score lower categories
  if (Object.prototype.hasOwnProperty.call(FIXED_SCORES, category)) {
    const fixed = FIXED_SCORES[category];
    if (n !== fixed) return { valid: false, reason: `Must be exactly ${fixed}` };
  }

  return { valid: true };
}

export function validateRoundScores(scores: Record<YatzyCategory, string>): Record<YatzyCategory, string | null> {
  const result = {} as Record<YatzyCategory, string | null>;
  Object.keys(scores).forEach((k) => {
    const cat = k as YatzyCategory;
    const val = scores[cat];
    const check = isValidCategoryValue(cat, val);
    result[cat] = check.valid ? null : check.reason || 'Invalid';
  });
  return result;
}

export default validateRoundScores;
