import { syncService } from './syncService'
import type { User } from '../types'
import type { Rank } from '../types/gamification'

// Profile data that needs to be synced to Supabase
export interface SyncableProfile {
  display_name?: string
  current_level: number
  current_rank: Rank
  total_xp: number
  current_streak: number
  longest_streak: number
  streak_freeze_available: boolean
  last_practice_date: Date | null
  daily_xp_goal: 10 | 20 | 50
  paris_trip_date?: Date | null
  preferred_difficulty?: number
}

// Stats data from the store
export interface ProfileStats {
  totalXp: number
  currentLevel: number
  currentRank: Rank
  currentStreak: number
  longestStreak: number
  streakFreezeAvailable: boolean
  lastPracticeDate: Date | null
  dailyXpGoal: 10 | 20 | 50
  user: User | null
}

// Convert store state to syncable profile format
export function prepareProfileForSync(stats: ProfileStats): SyncableProfile {
  return {
    display_name: stats.user?.name,
    current_level: stats.currentLevel,
    current_rank: stats.currentRank,
    total_xp: stats.totalXp,
    current_streak: stats.currentStreak,
    longest_streak: stats.longestStreak,
    streak_freeze_available: stats.streakFreezeAvailable,
    last_practice_date: stats.lastPracticeDate,
    daily_xp_goal: stats.dailyXpGoal,
  }
}

// Sync profile to cloud with debouncing
let syncTimeout: NodeJS.Timeout | null = null

export function debouncedProfileSync(
  userId: string,
  profileData: SyncableProfile,
  delayMs = 2000
) {
  if (syncTimeout) {
    clearTimeout(syncTimeout)
  }

  syncTimeout = setTimeout(() => {
    syncService.syncProfileToCloud(userId, profileData)
      .then(result => {
        if (!result.success) {
          console.warn('Profile sync failed:', result.error)
        }
      })
      .catch(error => {
        console.error('Profile sync error:', error)
      })
  }, delayMs)
}

// Immediate profile sync (for important events like login)
export async function syncProfileNow(
  userId: string,
  profileData: SyncableProfile
) {
  // Cancel any pending debounced syncs
  if (syncTimeout) {
    clearTimeout(syncTimeout)
    syncTimeout = null
  }

  return await syncService.syncProfileToCloud(userId, profileData)
}

// Fetch and merge profile from cloud
export async function loadProfileFromCloud(
  userId: string,
  localProfile: ProfileStats
): Promise<ProfileStats> {
  const cloudProfile = await syncService.fetchProfileFromCloud(userId)

  if (!cloudProfile) {
    return localProfile
  }

  // Merge logic: Cloud takes precedence for stats
  return {
    ...localProfile,
    user: cloudProfile,
    totalXp: cloudProfile.xp,
    currentLevel: cloudProfile.level,
    currentRank: (cloudProfile.rank as Rank) || localProfile.currentRank,
    currentStreak: cloudProfile.streak,
    // Keep local values for things not in the User type
  }
}
