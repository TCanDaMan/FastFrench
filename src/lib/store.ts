import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import type { Achievement, DailyProgress, LevelUpResult, Rank } from '../types/gamification'
import { calculateLevel, calculateRank } from './xp'
import { updateStreak, shouldAwardStreakFreeze } from './streaks'
import { syncService, type SyncStatus } from './syncService'
import { debouncedProfileSync, prepareProfileForSync } from './profileSync'

interface GamificationState {
  // User profile
  user: User | null
  setUser: (user: User | null) => void

  // XP and Level
  totalXp: number
  currentLevel: number
  currentRank: Rank
  addXp: (xp: number) => LevelUpResult

  // Daily Progress
  dailyXp: number
  dailyXpGoal: 10 | 20 | 50
  setDailyXpGoal: (goal: 10 | 20 | 50) => void
  resetDailyProgress: () => void

  // Streak
  currentStreak: number
  longestStreak: number
  streakFreezeAvailable: boolean
  lastPracticeDate: Date | null
  updatePracticeStreak: () => {
    newStreak: number
    streakIncreased: boolean
    freezeUsed: boolean
    bonusXp: number
  }
  useStreakFreeze: () => boolean

  // Achievements
  achievements: Achievement[]
  setAchievements: (achievements: Achievement[]) => void
  unlockAchievement: (achievementId: string) => Achievement | null

  // Daily Progress Tracking
  todayProgress: DailyProgress | null
  updateDailyProgress: (updates: Partial<DailyProgress>) => void

  // Stats
  wordsLearned: number
  phrasesPracticed: number
  practiceSessions: number
  timeSpentMinutes: number
  incrementStats: (stats: {
    wordsLearned?: number
    phrasesPracticed?: number
    practiceSessions?: number
    timeSpentMinutes?: number
  }) => void

  // Sync status
  syncStatus: SyncStatus
  lastSyncedAt: Date | null
  markSynced: () => void

  // Sync actions
  syncToCloud: () => Promise<void>
  syncFromCloud: (userId: string) => Promise<void>
  triggerBackgroundSync: () => void
}

export const useStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      totalXp: 0,
      currentLevel: 1,
      currentRank: 'debutant' as Rank,
      dailyXp: 0,
      dailyXpGoal: 20,
      currentStreak: 0,
      longestStreak: 0,
      streakFreezeAvailable: false,
      lastPracticeDate: null,
      achievements: [],
      todayProgress: null,
      wordsLearned: 0,
      phrasesPracticed: 0,
      practiceSessions: 0,
      timeSpentMinutes: 0,
      syncStatus: 'pending',
      lastSyncedAt: null,

      // User actions
      setUser: (user) => {
        if (user) {
          set({
            user,
            totalXp: user.xp,
            currentLevel: user.level,
            currentStreak: user.streak,
          })

          // Sync from cloud when user logs in
          get().syncFromCloud(user.id)
        } else {
          set({ user })
        }
      },

      // XP Management
      addXp: (xp: number): LevelUpResult => {
        const state = get()
        const oldXp = state.totalXp
        const oldLevel = state.currentLevel
        const oldRank = state.currentRank

        const newXp = oldXp + xp
        const newLevel = calculateLevel(newXp)
        const newRank = calculateRank(newLevel)

        const didLevelUp = newLevel > oldLevel

        set({
          totalXp: newXp,
          currentLevel: newLevel,
          currentRank: newRank,
          dailyXp: state.dailyXp + xp,
        })

        // Update today's progress
        if (state.todayProgress) {
          get().updateDailyProgress({
            xp_earned: state.todayProgress.xp_earned + xp,
          })
        }

        // Trigger background sync after XP change
        get().triggerBackgroundSync()

        return {
          didLevelUp,
          oldLevel,
          newLevel,
          oldRank,
          newRank,
        }
      },

      // Daily Progress
      setDailyXpGoal: (goal) => set({ dailyXpGoal: goal }),

      resetDailyProgress: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        set({
          dailyXp: 0,
          todayProgress: {
            user_id: get().user?.id || '',
            date: today,
            xp_earned: 0,
            words_learned: 0,
            words_reviewed: 0,
            phrases_practiced: 0,
            time_spent_minutes: 0,
            practice_sessions: 0,
            perfect_lessons: 0,
          },
        })
      },

      // Streak Management
      updatePracticeStreak: () => {
        const state = get()
        const result = updateStreak(
          state.currentStreak,
          state.lastPracticeDate,
          state.streakFreezeAvailable
        )

        const updates: Partial<GamificationState> = {
          currentStreak: result.newStreak,
          lastPracticeDate: new Date(),
        }

        // Update longest streak if needed
        if (result.newStreak > state.longestStreak) {
          updates.longestStreak = result.newStreak
        }

        // Use freeze if it was used
        if (result.freezeUsed) {
          updates.streakFreezeAvailable = false
        }

        // Award new freeze if milestone reached
        if (shouldAwardStreakFreeze(result.newStreak)) {
          updates.streakFreezeAvailable = true
        }

        // Add bonus XP if milestone reached
        if (result.bonusXp > 0) {
          get().addXp(result.bonusXp)
        }

        set(updates)

        // Trigger background sync after streak update
        get().triggerBackgroundSync()

        return {
          newStreak: result.newStreak,
          streakIncreased: result.streakIncreased,
          freezeUsed: result.freezeUsed,
          bonusXp: result.bonusXp,
        }
      },

      useStreakFreeze: () => {
        const state = get()

        if (!state.streakFreezeAvailable) {
          return false
        }

        const result = updateStreak(
          state.currentStreak,
          state.lastPracticeDate,
          true
        )

        if (result.freezeUsed) {
          set({
            currentStreak: result.newStreak,
            streakFreezeAvailable: false,
            lastPracticeDate: new Date(),
          })
          return true
        }

        return false
      },

      // Achievement Management
      setAchievements: (achievements) => set({ achievements }),

      unlockAchievement: (achievementId: string): Achievement | null => {
        const state = get()
        const achievement = state.achievements.find(a => a.id === achievementId)

        if (!achievement || achievement.unlocked) {
          return null
        }

        const unlockedAchievement: Achievement = {
          ...achievement,
          unlocked: true,
          earned_at: new Date(),
        }

        // Update achievements list
        const updatedAchievements = state.achievements.map(a =>
          a.id === achievementId ? unlockedAchievement : a
        )

        set({ achievements: updatedAchievements })

        // Award XP for achievement
        if (achievement.xp_reward > 0) {
          get().addXp(achievement.xp_reward)
        }

        return unlockedAchievement
      },

      // Daily Progress Tracking
      updateDailyProgress: (updates) => {
        const state = get()
        if (!state.todayProgress) {
          return
        }

        const updatedProgress: DailyProgress = {
          ...state.todayProgress,
          ...updates,
        }

        set({ todayProgress: updatedProgress })
      },

      // Stats Management
      incrementStats: (stats) => {
        const state = get()
        const updates: Partial<GamificationState> = {}

        if (stats.wordsLearned) {
          updates.wordsLearned = state.wordsLearned + stats.wordsLearned
        }

        if (stats.phrasesPracticed) {
          updates.phrasesPracticed = state.phrasesPracticed + stats.phrasesPracticed
        }

        if (stats.practiceSessions) {
          updates.practiceSessions = state.practiceSessions + stats.practiceSessions
        }

        if (stats.timeSpentMinutes) {
          updates.timeSpentMinutes = state.timeSpentMinutes + stats.timeSpentMinutes
        }

        set(updates)

        // Update today's progress
        if (state.todayProgress) {
          const progressUpdates: Partial<DailyProgress> = {}

          if (stats.wordsLearned) {
            progressUpdates.words_learned = state.todayProgress.words_learned + stats.wordsLearned
          }
          if (stats.phrasesPracticed) {
            progressUpdates.phrases_practiced = state.todayProgress.phrases_practiced + stats.phrasesPracticed
          }
          if (stats.practiceSessions) {
            progressUpdates.practice_sessions = state.todayProgress.practice_sessions + stats.practiceSessions
          }
          if (stats.timeSpentMinutes) {
            progressUpdates.time_spent_minutes = state.todayProgress.time_spent_minutes + stats.timeSpentMinutes
          }

          get().updateDailyProgress(progressUpdates)
        }

        // Trigger background sync after stats change
        get().triggerBackgroundSync()
      },

      // Sync Management
      markSynced: () => set({ lastSyncedAt: new Date(), syncStatus: 'synced' }),

      // Trigger background sync (debounced)
      triggerBackgroundSync: () => {
        const state = get()
        if (!state.user?.id) return

        set({ syncStatus: 'pending' })

        const profileData = prepareProfileForSync({
          totalXp: state.totalXp,
          currentLevel: state.currentLevel,
          currentRank: state.currentRank,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          streakFreezeAvailable: state.streakFreezeAvailable,
          lastPracticeDate: state.lastPracticeDate,
          dailyXpGoal: state.dailyXpGoal,
          user: state.user,
        })

        debouncedProfileSync(state.user.id, profileData)
      },

      // Immediate sync to cloud
      syncToCloud: async () => {
        const state = get()
        if (!state.user?.id) return

        if (!syncService.isOnline()) {
          set({ syncStatus: 'offline' })
          return
        }

        set({ syncStatus: 'syncing' })

        const profileData = prepareProfileForSync({
          totalXp: state.totalXp,
          currentLevel: state.currentLevel,
          currentRank: state.currentRank,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          streakFreezeAvailable: state.streakFreezeAvailable,
          lastPracticeDate: state.lastPracticeDate,
          dailyXpGoal: state.dailyXpGoal,
          user: state.user,
        })

        const result = await syncService.syncToCloud(state.user.id, {
          profile: profileData,
          dailyProgress: state.todayProgress || undefined,
        })

        if (result.success) {
          set({ syncStatus: 'synced', lastSyncedAt: new Date() })
        } else {
          set({ syncStatus: 'error' })
        }
      },

      // Sync from cloud (on login)
      syncFromCloud: async (userId: string) => {
        if (!syncService.isOnline()) {
          set({ syncStatus: 'offline' })
          return
        }

        set({ syncStatus: 'syncing' })

        const cloudData = await syncService.syncFromCloud(userId)

        if (cloudData) {
          const updates: Partial<GamificationState> = {}

          // Merge profile data
          if (cloudData.profile) {
            updates.totalXp = cloudData.profile.xp
            updates.currentLevel = cloudData.profile.level
            if (cloudData.profile.rank) {
              updates.currentRank = cloudData.profile.rank as Rank
            }
            updates.currentStreak = cloudData.profile.streak
          }

          // Merge daily progress
          if (cloudData.dailyProgress && cloudData.dailyProgress.length > 0) {
            const today = cloudData.dailyProgress[0]
            if (!get().todayProgress || today.xp_earned > get().todayProgress!.xp_earned) {
              updates.todayProgress = today
              updates.dailyXp = today.xp_earned
            }
          }

          set({ ...updates, syncStatus: 'synced', lastSyncedAt: new Date() })
        } else {
          set({ syncStatus: 'error' })
        }
      },
    }),
    {
      name: 'fastfrench-storage',
      // Only persist essential data
      partialize: (state) => ({
        user: state.user,
        totalXp: state.totalXp,
        currentLevel: state.currentLevel,
        currentRank: state.currentRank,
        dailyXp: state.dailyXp,
        dailyXpGoal: state.dailyXpGoal,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        streakFreezeAvailable: state.streakFreezeAvailable,
        lastPracticeDate: state.lastPracticeDate,
        achievements: state.achievements,
        todayProgress: state.todayProgress,
        wordsLearned: state.wordsLearned,
        phrasesPracticed: state.phrasesPracticed,
        practiceSessions: state.practiceSessions,
        timeSpentMinutes: state.timeSpentMinutes,
        syncStatus: state.syncStatus,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
)

// Selectors for computed values
export const selectUserStats = (state: GamificationState) => ({
  total_xp: state.totalXp,
  current_level: state.currentLevel,
  current_rank: state.currentRank,
  current_streak: state.currentStreak,
  longest_streak: state.longestStreak,
  streak_freeze_available: state.streakFreezeAvailable,
  last_practice_date: state.lastPracticeDate,
  daily_xp_goal: state.dailyXpGoal,
  words_learned: state.wordsLearned,
  phrases_practiced: state.phrasesPracticed,
  practice_sessions: state.practiceSessions,
  time_spent_minutes: state.timeSpentMinutes,
})

export const selectDailyProgress = (state: GamificationState) => ({
  current: state.dailyXp,
  goal: state.dailyXpGoal,
  percentage: Math.min(100, (state.dailyXp / state.dailyXpGoal) * 100),
  remaining: Math.max(0, state.dailyXpGoal - state.dailyXp),
  completed: state.dailyXp >= state.dailyXpGoal,
})

export const selectNeedsSyncing = (state: GamificationState) => {
  if (!state.lastSyncedAt) return true

  const hoursSinceSync = (Date.now() - state.lastSyncedAt.getTime()) / (1000 * 60 * 60)
  return hoursSinceSync > 1 // Sync if more than 1 hour since last sync
}

export const selectSyncStatus = (state: GamificationState) => ({
  status: state.syncStatus,
  lastSyncedAt: state.lastSyncedAt,
  needsSync: selectNeedsSyncing(state),
})
