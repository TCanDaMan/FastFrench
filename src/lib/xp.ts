// XP Calculation Utilities for FastFrench

import { Rank } from '../types/gamification'

// XP Rewards for different activities
export const XP_REWARDS = {
  WORD_LEARNED: 5,
  WORD_REVIEWED_CORRECT: 3,
  WORD_REVIEWED_INCORRECT: 1,
  PHRASE_PRACTICED: 10,
  QUIZ_CORRECT: 3,
  QUIZ_PERFECT: 20, // Bonus for getting all questions right
  DAILY_GOAL_REACHED: 10,
  STREAK_MILESTONE: 25, // Bonus for reaching streak milestones
  LESSON_COMPLETED: 15,
  CHALLENGE_COMPLETED: 50,
} as const

// Level calculation: level = floor(sqrt(xp / 100)) + 1
// This creates a smooth progression curve
export function calculateLevel(xp: number): number {
  if (xp < 0) return 1
  const level = Math.floor(Math.sqrt(xp / 100)) + 1
  return Math.min(level, 50) // Cap at level 50
}

// Calculate XP needed to reach a specific level
export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.pow(level - 1, 2) * 100
}

// Calculate XP needed to reach next level from current XP
export function xpToNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  if (currentLevel >= 50) return 0 // Max level reached

  const nextLevelXp = xpForLevel(currentLevel + 1)
  return nextLevelXp - currentXp
}

// Calculate progress percentage to next level
export function levelProgressPercentage(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  if (currentLevel >= 50) return 100

  const currentLevelXp = xpForLevel(currentLevel)
  const nextLevelXp = xpForLevel(currentLevel + 1)
  const xpInCurrentLevel = currentXp - currentLevelXp
  const xpNeededForLevel = nextLevelXp - currentLevelXp

  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100))
}

// Rank calculation based on level
export function calculateRank(level: number): Rank {
  if (level >= 40) return Rank.MAITRE       // Master: 40-50
  if (level >= 30) return Rank.PARISIEN     // Parisien: 30-39
  if (level >= 20) return Rank.VOYAGEUR     // Voyageur: 20-29
  if (level >= 10) return Rank.TOURISTE     // Touriste: 10-19
  return Rank.DEBUTANT                       // Debutant: 1-9
}

// Get rank for a specific XP amount (convenience function)
export function rankFromXp(xp: number): Rank {
  return calculateRank(calculateLevel(xp))
}

// Level ranges for each rank
export const RANK_LEVEL_RANGES: Record<Rank, { min: number; max: number }> = {
  [Rank.DEBUTANT]: { min: 1, max: 9 },
  [Rank.TOURISTE]: { min: 10, max: 19 },
  [Rank.VOYAGEUR]: { min: 20, max: 29 },
  [Rank.PARISIEN]: { min: 30, max: 39 },
  [Rank.MAITRE]: { min: 40, max: 50 },
}

// XP ranges for each rank
export const RANK_XP_RANGES: Record<Rank, { min: number; max: number }> = {
  [Rank.DEBUTANT]: { min: 0, max: xpForLevel(10) - 1 },
  [Rank.TOURISTE]: { min: xpForLevel(10), max: xpForLevel(20) - 1 },
  [Rank.VOYAGEUR]: { min: xpForLevel(20), max: xpForLevel(30) - 1 },
  [Rank.PARISIEN]: { min: xpForLevel(30), max: xpForLevel(40) - 1 },
  [Rank.MAITRE]: { min: xpForLevel(40), max: Infinity },
}

// Check if adding XP will cause a level up
export function willLevelUp(currentXp: number, xpToAdd: number): boolean {
  const currentLevel = calculateLevel(currentXp)
  const newLevel = calculateLevel(currentXp + xpToAdd)
  return newLevel > currentLevel
}

// Get all levels that will be gained from adding XP
export function getLevelsGained(currentXp: number, xpToAdd: number): number[] {
  const currentLevel = calculateLevel(currentXp)
  const newLevel = calculateLevel(currentXp + xpToAdd)

  const levels: number[] = []
  for (let i = currentLevel + 1; i <= newLevel; i++) {
    levels.push(i)
  }

  return levels
}

// Calculate daily XP progress towards goal
export function dailyXpProgress(earnedXp: number, goalXp: 10 | 20 | 50): {
  percentage: number
  remaining: number
  completed: boolean
} {
  const percentage = Math.min(100, (earnedXp / goalXp) * 100)
  const remaining = Math.max(0, goalXp - earnedXp)
  const completed = earnedXp >= goalXp

  return { percentage, remaining, completed }
}

// Estimate time to reach next level (in days) based on daily XP average
export function estimatedDaysToNextLevel(
  currentXp: number,
  dailyXpAverage: number
): number {
  if (dailyXpAverage <= 0) return Infinity

  const xpNeeded = xpToNextLevel(currentXp)
  return Math.ceil(xpNeeded / dailyXpAverage)
}

// Calculate streak multiplier bonus (future feature)
export function streakMultiplier(streakDays: number): number {
  // Every 7 days adds 10% bonus (max 50% at 35+ days)
  const weeks = Math.floor(streakDays / 7)
  return Math.min(1.5, 1 + (weeks * 0.1))
}
