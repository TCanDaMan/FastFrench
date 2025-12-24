// Supabase Sync Utilities for Gamification

import { supabase } from './supabase'
import { useStore } from './store'
import type { Achievement, DailyProgress } from '../types/gamification'

export interface SyncResult {
  success: boolean
  error?: string
  lastSync: Date
}

// Load user profile and gamification data from Supabase
export async function loadUserData(userId: string): Promise<void> {
  const store = useStore.getState()

  try {
    // Load profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    if (profile) {
      // Update store with profile data
      store.setUser({
        id: profile.id,
        email: '', // Will be loaded from auth
        username: profile.display_name,
        level: profile.current_level,
        xp: profile.total_xp,
        streak: profile.current_streak,
        createdAt: new Date(profile.created_at),
      })

      // Update gamification state
      useStore.setState({
        totalXp: profile.total_xp,
        currentLevel: profile.current_level,
        currentRank: profile.current_rank,
        currentStreak: profile.current_streak,
        longestStreak: profile.longest_streak,
        streakFreezeAvailable: profile.streak_freeze_available,
        lastPracticeDate: profile.last_practice_date ? new Date(profile.last_practice_date) : null,
        dailyXpGoal: profile.daily_xp_goal,
      })
    }

    // Load achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')

    if (achievementsError) throw achievementsError

    // Load user's unlocked achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('user_id', userId)

    if (userAchievementsError) throw userAchievementsError

    // Combine achievements with unlock status
    const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || [])
    const achievementsWithStatus: Achievement[] = (achievements || []).map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon_name: achievement.icon_name,
      xp_reward: achievement.xp_reward,
      requirement_type: achievement.requirement_type,
      requirement_value: achievement.requirement_value,
      unlocked: unlockedIds.has(achievement.id),
      earned_at: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.earned_at
        ? new Date(userAchievements.find(ua => ua.achievement_id === achievement.id)!.earned_at)
        : undefined,
    }))

    store.setAchievements(achievementsWithStatus)

    // Load today's progress
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: todayProgress, error: progressError } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today.toISOString().split('T')[0])
      .single()

    if (progressError && progressError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned", which is fine
      throw progressError
    }

    if (todayProgress) {
      useStore.setState({
        todayProgress: {
          id: todayProgress.id,
          user_id: todayProgress.user_id,
          date: new Date(todayProgress.date),
          xp_earned: todayProgress.xp_earned,
          words_learned: todayProgress.words_learned,
          words_reviewed: todayProgress.words_reviewed,
          phrases_practiced: todayProgress.phrases_practiced,
          time_spent_minutes: todayProgress.time_spent_minutes,
          practice_sessions: 0, // Not stored in DB schema
          perfect_lessons: 0,   // Not stored in DB schema
        },
        dailyXp: todayProgress.xp_earned,
      })
    } else {
      // Initialize today's progress
      store.resetDailyProgress()
    }

    store.markSynced()
  } catch (error) {
    console.error('Failed to load user data:', error)
    throw error
  }
}

// Save current state to Supabase
export async function saveUserData(userId: string): Promise<SyncResult> {
  const store = useStore.getState()

  try {
    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        total_xp: store.totalXp,
        current_level: store.currentLevel,
        current_rank: store.currentRank,
        current_streak: store.currentStreak,
        longest_streak: store.longestStreak,
        streak_freeze_available: store.streakFreezeAvailable,
        last_practice_date: store.lastPracticeDate?.toISOString().split('T')[0] || null,
        daily_xp_goal: store.dailyXpGoal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (profileError) throw profileError

    // Save today's progress
    if (store.todayProgress) {
      const { error: progressError } = await supabase
        .from('daily_progress')
        .upsert({
          user_id: userId,
          date: store.todayProgress.date.toISOString().split('T')[0],
          xp_earned: store.todayProgress.xp_earned,
          words_learned: store.todayProgress.words_learned,
          words_reviewed: store.todayProgress.words_reviewed,
          phrases_practiced: store.todayProgress.phrases_practiced,
          time_spent_minutes: store.todayProgress.time_spent_minutes,
        })

      if (progressError) throw progressError
    }

    store.markSynced()

    return {
      success: true,
      lastSync: new Date(),
    }
  } catch (error) {
    console.error('Failed to save user data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastSync: new Date(),
    }
  }
}

// Sync achievements (unlock new achievements)
export async function syncAchievements(userId: string): Promise<Achievement[]> {
  const store = useStore.getState()
  const newlyUnlocked: Achievement[] = []

  try {
    // Get locally unlocked achievements that haven't been synced
    const locallyUnlocked = store.achievements.filter(a => a.unlocked)

    // Check which ones are not in the database
    const { data: dbAchievements, error: fetchError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId)

    if (fetchError) throw fetchError

    const dbUnlockedIds = new Set(dbAchievements?.map(ua => ua.achievement_id) || [])

    // Insert achievements that are unlocked locally but not in DB
    for (const achievement of locallyUnlocked) {
      if (!dbUnlockedIds.has(achievement.id)) {
        const { error: insertError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            earned_at: achievement.earned_at?.toISOString() || new Date().toISOString(),
          })

        if (!insertError) {
          newlyUnlocked.push(achievement)
        }
      }
    }

    return newlyUnlocked
  } catch (error) {
    console.error('Failed to sync achievements:', error)
    return []
  }
}

// Get leaderboard data (for future implementation)
export async function getLeaderboard(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, total_xp, current_level, current_rank, current_streak')
      .order('total_xp', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return []
  }
}

// Get user's rank on leaderboard
export async function getUserRank(userId: string): Promise<number | null> {
  try {
    // Get all users ordered by XP
    const { data, error } = await supabase
      .from('profiles')
      .select('id, total_xp')
      .order('total_xp', { ascending: false })

    if (error) throw error

    // Find user's position
    const rank = (data || []).findIndex(user => user.id === userId) + 1

    return rank > 0 ? rank : null
  } catch (error) {
    console.error('Failed to fetch user rank:', error)
    return null
  }
}

// Get weekly progress data
export async function getWeeklyProgress(userId: string): Promise<DailyProgress[]> {
  try {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { data, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('date', weekAgo.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) throw error

    return (data || []).map(d => ({
      id: d.id,
      user_id: d.user_id,
      date: new Date(d.date),
      xp_earned: d.xp_earned,
      words_learned: d.words_learned,
      words_reviewed: d.words_reviewed,
      phrases_practiced: d.phrases_practiced,
      time_spent_minutes: d.time_spent_minutes,
      practice_sessions: 0,
      perfect_lessons: 0,
    }))
  } catch (error) {
    console.error('Failed to fetch weekly progress:', error)
    return []
  }
}

// Initialize new user with default data
export async function initializeNewUser(userId: string, displayName: string): Promise<void> {
  try {
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        display_name: displayName,
        current_level: 1,
        current_rank: 'debutant',
        total_xp: 0,
        current_streak: 0,
        longest_streak: 0,
        streak_freeze_available: false,
        daily_xp_goal: 20,
      })

    if (profileError) throw profileError

    // Load initial data
    await loadUserData(userId)
  } catch (error) {
    console.error('Failed to initialize new user:', error)
    throw error
  }
}
