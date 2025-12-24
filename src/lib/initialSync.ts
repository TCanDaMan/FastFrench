/**
 * Initial Sync Helper
 *
 * Helps with first-time sync when a user logs in for the first time
 * or when migrating from localStorage-only to Supabase sync.
 */

import { supabase } from './supabase'
import { syncService } from './syncService'
import type { User } from '../types'

/**
 * Check if this is the user's first login
 * (profile doesn't exist in Supabase yet)
 */
export async function isFirstLogin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // Row not found - first login
    return true
  }

  return !data
}

/**
 * Create initial profile in Supabase
 * Called on first login with localStorage data
 */
export async function createInitialProfile(
  userId: string,
  displayName: string,
  localData?: {
    totalXp?: number
    currentLevel?: number
    currentStreak?: number
    longestStreak?: number
  }
): Promise<void> {
  const profileData = {
    id: userId,
    display_name: displayName,
    current_level: localData?.currentLevel || 1,
    current_rank: 'debutant' as const,
    total_xp: localData?.totalXp || 0,
    current_streak: localData?.currentStreak || 0,
    longest_streak: localData?.longestStreak || 0,
    streak_freeze_available: false,
    last_practice_date: null,
    daily_xp_goal: 20,
  }

  const { error } = await supabase.from('profiles').insert(profileData)

  if (error) {
    console.error('Failed to create initial profile:', error)
    throw error
  }
}

/**
 * Migrate localStorage data to Supabase on first login
 *
 * This preserves any existing progress the user made
 * before logging in (anonymous usage)
 */
export async function migrateLocalDataToCloud(
  userId: string,
  localData: {
    profile?: any
    vocabulary?: any[]
    phraseProgress?: any[]
    dailyProgress?: any
  }
): Promise<void> {
  console.log('Migrating local data to cloud...')

  try {
    // Create profile if needed
    if (localData.profile) {
      await createInitialProfile(
        userId,
        localData.profile.name || 'User',
        {
          totalXp: localData.profile.totalXp,
          currentLevel: localData.profile.currentLevel,
          currentStreak: localData.profile.currentStreak,
          longestStreak: localData.profile.longestStreak,
        }
      )
    }

    // Migrate vocabulary
    if (localData.vocabulary && localData.vocabulary.length > 0) {
      await syncService.syncVocabularyToCloud(userId, localData.vocabulary)
    }

    // Migrate phrase progress
    if (localData.phraseProgress && localData.phraseProgress.length > 0) {
      await syncService.syncPhraseProgressToCloud(userId, localData.phraseProgress)
    }

    // Migrate daily progress
    if (localData.dailyProgress) {
      await syncService.syncDailyProgressToCloud(userId, localData.dailyProgress)
    }

    console.log('Local data migrated successfully!')
  } catch (error) {
    console.error('Failed to migrate local data:', error)
    // Don't throw - we want the user to still be able to use the app
  }
}

/**
 * Handle first login flow
 *
 * 1. Check if first login
 * 2. If yes, migrate localStorage data
 * 3. If no, sync from cloud
 */
export async function handleFirstLoginSync(
  user: User,
  localData: {
    profile?: any
    vocabulary?: any[]
    phraseProgress?: any[]
    dailyProgress?: any
  }
): Promise<void> {
  const firstLogin = await isFirstLogin(user.id)

  if (firstLogin) {
    console.log('First login detected - migrating local data')
    await migrateLocalDataToCloud(user.id, localData)
  } else {
    console.log('Returning user - syncing from cloud')
    // Sync from cloud will happen automatically via useSync hook
  }
}

/**
 * Clear localStorage after successful migration
 * (Optional - only if you want to force cloud-only storage)
 */
export function clearLocalStorage(): void {
  localStorage.removeItem('fastfrench-storage')
  localStorage.removeItem('vocabulary-storage')
  localStorage.removeItem('fastfrench-phrases')
  console.log('LocalStorage cleared')
}
