// Achievement System for FastFrench

import { Achievement, RequirementType, UserStats } from '../types/gamification'

// Achievement categories for organization
export enum AchievementCategory {
  BEGINNER = 'beginner',
  XP = 'xp',
  VOCABULARY = 'vocabulary',
  STREAK = 'streak',
  PRACTICE = 'practice',
  MASTERY = 'mastery',
  TIME = 'time',
  SPECIAL = 'special',
}

// Map requirement types to stat properties
const REQUIREMENT_TO_STAT_MAP: Record<RequirementType, keyof UserStats> = {
  [RequirementType.XP_EARNED]: 'total_xp',
  [RequirementType.WORDS_LEARNED]: 'words_learned',
  [RequirementType.WORDS_REVIEWED]: 'words_learned', // Reviews accumulate in learned count
  [RequirementType.PHRASES_PRACTICED]: 'phrases_practiced',
  [RequirementType.STREAK_DAYS]: 'current_streak',
  [RequirementType.PRACTICE_SESSIONS]: 'practice_sessions',
  [RequirementType.TIME_SPENT_MINUTES]: 'time_spent_minutes',
  [RequirementType.PERFECT_LESSONS]: 'practice_sessions', // Will need separate tracking
}

// Check if an achievement should be unlocked based on user stats
export function checkAchievementProgress(
  achievement: Achievement,
  stats: UserStats
): boolean {
  if (achievement.unlocked) {
    return false // Already unlocked
  }

  const statKey = REQUIREMENT_TO_STAT_MAP[achievement.requirement_type]
  const currentValue = stats[statKey]

  if (typeof currentValue !== 'number') {
    return false
  }

  return currentValue >= achievement.requirement_value
}

// Get all achievements that should be unlocked
export function getUnlockedAchievements(
  achievements: Achievement[],
  stats: UserStats
): Achievement[] {
  return achievements.filter(achievement =>
    checkAchievementProgress(achievement, stats)
  )
}

// Calculate achievement completion percentage
export function achievementProgress(
  achievement: Achievement,
  stats: UserStats
): number {
  const statKey = REQUIREMENT_TO_STAT_MAP[achievement.requirement_type]
  const currentValue = stats[statKey]

  if (typeof currentValue !== 'number') {
    return 0
  }

  const percentage = (currentValue / achievement.requirement_value) * 100
  return Math.min(100, Math.max(0, percentage))
}

// Get achievements grouped by category
export function groupAchievementsByCategory(
  achievements: Achievement[]
): Record<AchievementCategory, Achievement[]> {
  const grouped: Record<AchievementCategory, Achievement[]> = {
    [AchievementCategory.BEGINNER]: [],
    [AchievementCategory.XP]: [],
    [AchievementCategory.VOCABULARY]: [],
    [AchievementCategory.STREAK]: [],
    [AchievementCategory.PRACTICE]: [],
    [AchievementCategory.MASTERY]: [],
    [AchievementCategory.TIME]: [],
    [AchievementCategory.SPECIAL]: [],
  }

  achievements.forEach(achievement => {
    const category = categorizeAchievement(achievement)
    grouped[category].push(achievement)
  })

  return grouped
}

// Determine achievement category based on requirement type and name
function categorizeAchievement(achievement: Achievement): AchievementCategory {
  const name = achievement.name.toLowerCase()

  // Check for special Paris-themed achievements
  if (
    name.includes('eiffel') ||
    name.includes('louvre') ||
    name.includes('champs') ||
    name.includes('arc de') ||
    name.includes('notre-dame')
  ) {
    return AchievementCategory.SPECIAL
  }

  // Check for beginner achievements
  if (
    name.includes('premier') ||
    name.includes('bonjour') ||
    name.includes('first') ||
    achievement.requirement_value <= 5
  ) {
    return AchievementCategory.BEGINNER
  }

  // Categorize by requirement type
  switch (achievement.requirement_type) {
    case RequirementType.XP_EARNED:
      return AchievementCategory.XP

    case RequirementType.WORDS_LEARNED:
    case RequirementType.WORDS_REVIEWED:
    case RequirementType.PHRASES_PRACTICED:
      return AchievementCategory.VOCABULARY

    case RequirementType.STREAK_DAYS:
      return AchievementCategory.STREAK

    case RequirementType.PRACTICE_SESSIONS:
      return AchievementCategory.PRACTICE

    case RequirementType.TIME_SPENT_MINUTES:
      return AchievementCategory.TIME

    case RequirementType.PERFECT_LESSONS:
      return AchievementCategory.MASTERY

    default:
      return AchievementCategory.SPECIAL
  }
}

// Get next achievement to unlock in a category
export function getNextAchievement(
  achievements: Achievement[],
  category: AchievementCategory
): Achievement | null {
  const categoryAchievements = achievements
    .filter(a => categorizeAchievement(a) === category && !a.unlocked)
    .sort((a, b) => a.requirement_value - b.requirement_value)

  return categoryAchievements[0] || null
}

// Get recently unlocked achievements (within last 7 days)
export function getRecentlyUnlocked(
  achievements: Achievement[],
  daysAgo: number = 7
): Achievement[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo)

  return achievements
    .filter(a => a.unlocked && a.earned_at && new Date(a.earned_at) >= cutoffDate)
    .sort((a, b) => {
      if (!a.earned_at || !b.earned_at) return 0
      return new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime()
    })
}

// Calculate total achievement progress
export function calculateAchievementStats(achievements: Achievement[]): {
  total: number
  unlocked: number
  percentage: number
  totalXpEarned: number
  totalXpAvailable: number
} {
  const total = achievements.length
  const unlocked = achievements.filter(a => a.unlocked).length
  const percentage = total > 0 ? (unlocked / total) * 100 : 0

  const totalXpEarned = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xp_reward, 0)

  const totalXpAvailable = achievements
    .reduce((sum, a) => sum + a.xp_reward, 0)

  return {
    total,
    unlocked,
    percentage,
    totalXpEarned,
    totalXpAvailable,
  }
}

// Get achievements close to being unlocked (within 20% of requirement)
export function getAlmostUnlocked(
  achievements: Achievement[],
  stats: UserStats,
  threshold: number = 80
): Achievement[] {
  return achievements
    .filter(a => !a.unlocked)
    .map(a => ({
      achievement: a,
      progress: achievementProgress(a, stats),
    }))
    .filter(({ progress }) => progress >= threshold && progress < 100)
    .sort((a, b) => b.progress - a.progress)
    .map(({ achievement }) => achievement)
}

// Format achievement requirement for display
export function formatRequirement(achievement: Achievement): string {
  const { requirement_type, requirement_value } = achievement

  switch (requirement_type) {
    case RequirementType.XP_EARNED:
      return `Earn ${requirement_value.toLocaleString()} XP`

    case RequirementType.WORDS_LEARNED:
      return `Learn ${requirement_value} word${requirement_value !== 1 ? 's' : ''}`

    case RequirementType.WORDS_REVIEWED:
      return `Review words ${requirement_value} time${requirement_value !== 1 ? 's' : ''}`

    case RequirementType.PHRASES_PRACTICED:
      return `Practice ${requirement_value} phrase${requirement_value !== 1 ? 's' : ''}`

    case RequirementType.STREAK_DAYS:
      return `Maintain a ${requirement_value}-day streak`

    case RequirementType.PRACTICE_SESSIONS:
      return `Complete ${requirement_value} practice session${requirement_value !== 1 ? 's' : ''}`

    case RequirementType.PERFECT_LESSONS:
      return `Get ${requirement_value} perfect lesson${requirement_value !== 1 ? 's' : ''}`

    case RequirementType.TIME_SPENT_MINUTES:
      const hours = Math.floor(requirement_value / 60)
      const minutes = requirement_value % 60
      if (hours > 0 && minutes === 0) {
        return `Practice for ${hours} hour${hours !== 1 ? 's' : ''}`
      } else if (hours > 0) {
        return `Practice for ${hours}h ${minutes}m`
      } else {
        return `Practice for ${minutes} minute${minutes !== 1 ? 's' : ''}`
      }

    default:
      return `Reach ${requirement_value}`
  }
}

// Get rarity label for achievement
export function getAchievementRarity(achievement: Achievement): {
  label: string
  color: string
} {
  const { requirement_value, xp_reward } = achievement

  // Determine rarity based on XP reward and requirement value
  if (xp_reward >= 1000 || requirement_value >= 10000) {
    return { label: 'Legendary', color: 'text-yellow-500' }
  } else if (xp_reward >= 500 || requirement_value >= 1000) {
    return { label: 'Epic', color: 'text-purple-500' }
  } else if (xp_reward >= 200 || requirement_value >= 100) {
    return { label: 'Rare', color: 'text-blue-500' }
  } else if (xp_reward >= 100 || requirement_value >= 25) {
    return { label: 'Uncommon', color: 'text-green-500' }
  } else {
    return { label: 'Common', color: 'text-gray-500' }
  }
}
