// Streak Management for FastFrench

import { XP_REWARDS } from './xp'

// Streak milestones that trigger achievements
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const

export interface StreakUpdateResult {
  newStreak: number
  streakIncreased: boolean
  streakLost: boolean
  freezeUsed: boolean
  milestoneReached: number | null
  bonusXp: number
}

// Check if today's practice has already been counted
export function hasPracticedToday(lastPracticeDate: Date | null): boolean {
  if (!lastPracticeDate) return false

  const today = new Date()
  const lastPractice = new Date(lastPracticeDate)

  return (
    today.getFullYear() === lastPractice.getFullYear() &&
    today.getMonth() === lastPractice.getMonth() &&
    today.getDate() === lastPractice.getDate()
  )
}

// Get the number of days between two dates
function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000 // milliseconds in a day
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay))
}

// Calculate streak status when practicing
export function updateStreak(
  currentStreak: number,
  lastPracticeDate: Date | null,
  streakFreezeAvailable: boolean
): StreakUpdateResult {
  const now = new Date()

  // First practice ever
  if (!lastPracticeDate) {
    return {
      newStreak: 1,
      streakIncreased: true,
      streakLost: false,
      freezeUsed: false,
      milestoneReached: null,
      bonusXp: 0,
    }
  }

  // Already practiced today - no change
  if (hasPracticedToday(lastPracticeDate)) {
    return {
      newStreak: currentStreak,
      streakIncreased: false,
      streakLost: false,
      freezeUsed: false,
      milestoneReached: null,
      bonusXp: 0,
    }
  }

  const daysSinceLastPractice = daysBetween(lastPracticeDate, now)

  // Practiced yesterday - increment streak
  if (daysSinceLastPractice === 1) {
    const newStreak = currentStreak + 1
    const milestoneReached = STREAK_MILESTONES.find(m => m === newStreak) || null
    const bonusXp = milestoneReached ? XP_REWARDS.STREAK_MILESTONE : 0

    return {
      newStreak,
      streakIncreased: true,
      streakLost: false,
      freezeUsed: false,
      milestoneReached,
      bonusXp,
    }
  }

  // Missed exactly one day - can use freeze
  if (daysSinceLastPractice === 2 && streakFreezeAvailable) {
    const milestoneReached = STREAK_MILESTONES.find(m => m === currentStreak + 1) || null
    const bonusXp = milestoneReached ? XP_REWARDS.STREAK_MILESTONE : 0

    return {
      newStreak: currentStreak + 1,
      streakIncreased: true,
      streakLost: false,
      freezeUsed: true,
      milestoneReached,
      bonusXp,
    }
  }

  // Streak broken - reset to 1
  return {
    newStreak: 1,
    streakIncreased: false,
    streakLost: true,
    freezeUsed: false,
    milestoneReached: null,
    bonusXp: 0,
  }
}

// Check if user can use a streak freeze
export function canUseStreakFreeze(
  lastPracticeDate: Date | null,
  hasFreezeAvailable: boolean
): boolean {
  if (!hasFreezeAvailable || !lastPracticeDate) {
    return false
  }

  const now = new Date()
  const daysSinceLastPractice = daysBetween(lastPracticeDate, now)

  // Can only use freeze if missed exactly one day
  return daysSinceLastPractice === 2
}

// Get streak status without updating it (for display purposes)
export function getStreakStatus(
  lastPracticeDate: Date | null
): {
  isActive: boolean
  daysAgo: number
  willBreakToday: boolean
  canBeRestored: boolean
} {
  if (!lastPracticeDate) {
    return {
      isActive: false,
      daysAgo: 0,
      willBreakToday: false,
      canBeRestored: false,
    }
  }

  const now = new Date()
  const daysAgo = daysBetween(lastPracticeDate, now)

  // Already practiced today
  if (daysAgo === 0) {
    return {
      isActive: true,
      daysAgo: 0,
      willBreakToday: false,
      canBeRestored: false,
    }
  }

  // Practiced yesterday - streak is safe
  if (daysAgo === 1) {
    return {
      isActive: true,
      daysAgo: 1,
      willBreakToday: true, // Will break if no practice today
      canBeRestored: false,
    }
  }

  // Missed one day - can be restored with freeze
  if (daysAgo === 2) {
    return {
      isActive: false,
      daysAgo: 2,
      willBreakToday: false,
      canBeRestored: true,
    }
  }

  // Streak is broken
  return {
    isActive: false,
    daysAgo,
    willBreakToday: false,
    canBeRestored: false,
  }
}

// Get next streak milestone
export function getNextStreakMilestone(currentStreak: number): number | null {
  return STREAK_MILESTONES.find(m => m > currentStreak) || null
}

// Calculate progress to next milestone
export function streakMilestoneProgress(currentStreak: number): {
  current: number
  next: number | null
  percentage: number
  previousMilestone: number
} {
  const nextMilestone = getNextStreakMilestone(currentStreak)
  const previousMilestones = [...STREAK_MILESTONES].filter(m => m <= currentStreak)
  const previousMilestone = previousMilestones.length > 0
    ? previousMilestones[previousMilestones.length - 1]
    : 0

  if (!nextMilestone) {
    return {
      current: currentStreak,
      next: null,
      percentage: 100,
      previousMilestone,
    }
  }

  const progress = currentStreak - previousMilestone
  const total = nextMilestone - previousMilestone
  const percentage = (progress / total) * 100

  return {
    current: currentStreak,
    next: nextMilestone,
    percentage,
    previousMilestone,
  }
}

// Award streak freeze at specific milestones
export function shouldAwardStreakFreeze(newStreak: number): boolean {
  // Award freeze at every 7-day milestone
  return newStreak > 0 && newStreak % 7 === 0
}

// Get encouraging message based on streak
export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!"
  if (streak === 1) return "Great start! Keep it up!"
  if (streak < 7) return `${streak} days! You're building momentum!`
  if (streak < 14) return `${streak} days strong! Fantastic!`
  if (streak < 30) return `${streak} days! You're on fire!`
  if (streak < 60) return `${streak} days! Incredible dedication!`
  if (streak < 100) return `${streak} days! You're unstoppable!`
  return `${streak} days! You're a legend!`
}
