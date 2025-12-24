/**
 * SM-2 Spaced Repetition Algorithm
 * Based on SuperMemo 2 algorithm for optimal review scheduling
 */

export interface SM2Result {
  easinessFactor: number; // Minimum 1.3
  interval: number; // Days until next review
  repetitions: number;
  nextReviewDate: Date;
}

/**
 * Calculate next review parameters using SM-2 algorithm
 * @param quality - User's quality of recall (0-5)
 *   0 - Complete blackout
 *   1 - Incorrect, but familiar
 *   2 - Incorrect, but easy to recall
 *   3 - Correct, but difficult
 *   4 - Correct, with hesitation
 *   5 - Perfect recall
 * @param previousEF - Previous easiness factor (default: 2.5)
 * @param previousInterval - Previous interval in days (default: 0)
 * @param previousReps - Previous number of repetitions (default: 0)
 * @returns SM2Result with updated parameters
 */
export function calculateSM2(
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  previousEF: number = 2.5,
  previousInterval: number = 0,
  previousReps: number = 0
): SM2Result {
  // Calculate new easiness factor
  let newEF = previousEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Ensure EF stays above minimum threshold
  if (newEF < 1.3) {
    newEF = 1.3
  }

  let newInterval: number
  let newReps: number

  // If quality < 3, reset the repetition count and start over
  if (quality < 3) {
    newReps = 0
    newInterval = 1
  } else {
    // Successful recall
    newReps = previousReps + 1

    // Calculate interval based on repetition number
    if (newReps === 1) {
      newInterval = 1
    } else if (newReps === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(previousInterval * newEF)
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)
  // Reset time to start of day for consistency
  nextReviewDate.setHours(0, 0, 0, 0)

  return {
    easinessFactor: newEF,
    interval: newInterval,
    repetitions: newReps,
    nextReviewDate,
  }
}

/**
 * Map simplified quality ratings to SM-2 quality values
 */
export const QUALITY_RATINGS = {
  AGAIN: 0 as const,  // Complete failure
  HARD: 3 as const,   // Correct with difficulty
  GOOD: 4 as const,   // Correct with some hesitation
  EASY: 5 as const,   // Perfect recall
}

/**
 * Get human-readable interval description
 */
export function getIntervalDescription(days: number): string {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 7) return `${days} days`
  if (days < 30) return `${Math.round(days / 7)} weeks`
  if (days < 365) return `${Math.round(days / 30)} months`
  return `${Math.round(days / 365)} years`
}

/**
 * Check if a word is due for review
 */
export function isDue(nextReviewDate: Date): boolean {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return nextReviewDate <= now
}

/**
 * Calculate mastery level based on stats
 */
export function calculateMastery(
  timesCorrect: number,
  timesIncorrect: number,
  repetitions: number
): number {
  const totalAttempts = timesCorrect + timesIncorrect
  if (totalAttempts === 0) return 0

  const successRate = timesCorrect / totalAttempts
  const repetitionBonus = Math.min(repetitions / 10, 1) * 0.3

  return Math.min((successRate * 0.7 + repetitionBonus) * 100, 100)
}

/**
 * Determine if word is mastered
 */
export function isMastered(
  repetitions: number,
  easinessFactor: number,
  timesCorrect: number,
  timesIncorrect: number
): boolean {
  const totalAttempts = timesCorrect + timesIncorrect
  if (totalAttempts === 0) return false

  const successRate = timesCorrect / totalAttempts

  // Word is mastered if:
  // - At least 5 successful repetitions
  // - Success rate > 90%
  // - Easiness factor > 2.0 (not too difficult)
  return repetitions >= 5 && successRate > 0.9 && easinessFactor > 2.0
}
