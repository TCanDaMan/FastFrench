// Comprehensive Gamification Hook for FastFrench

import { useCallback, useEffect, useMemo } from 'react'
import { useStore, selectUserStats, selectDailyProgress } from '../lib/store'
import { supabase } from '../lib/supabase'
import type { Achievement, PracticeSessionResult } from '../types/gamification'
import { checkAchievementProgress } from '../lib/achievements'
import { XP_REWARDS } from '../lib/xp'
import { hasPracticedToday } from '../lib/streaks'

export interface UseGamificationReturn {
  // Current state
  stats: ReturnType<typeof selectUserStats>
  dailyProgress: ReturnType<typeof selectDailyProgress>
  achievements: Achievement[]

  // Actions
  practiceWord: (correct: boolean) => Promise<PracticeSessionResult>
  learnWord: () => Promise<PracticeSessionResult>
  practicePhrase: () => Promise<PracticeSessionResult>
  completeQuiz: (correctCount: number, totalCount: number) => Promise<PracticeSessionResult>
  startPracticeSession: () => void
  endPracticeSession: (timeSpentMinutes: number) => Promise<PracticeSessionResult>

  // Utilities
  checkForNewAchievements: () => Promise<Achievement[]>
  syncWithDatabase: () => Promise<void>
  setDailyGoal: (goal: 10 | 20 | 50) => void

  // Status
  isLoading: boolean
  needsSync: boolean
}

export function useGamification(): UseGamificationReturn {
  const store = useStore()

  const stats = useMemo(() => selectUserStats(store), [
    store.totalXp,
    store.currentLevel,
    store.currentRank,
    store.currentStreak,
    store.longestStreak,
    store.streakFreezeAvailable,
    store.lastPracticeDate,
    store.dailyXpGoal,
    store.wordsLearned,
    store.phrasesPracticed,
    store.practiceSessions,
    store.timeSpentMinutes,
  ])

  const dailyProgress = useMemo(() => selectDailyProgress(store), [
    store.dailyXp,
    store.dailyXpGoal,
  ])

  const needsSync = useMemo(() => {
    if (!store.lastSyncedAt) return true
    const hoursSinceSync = (Date.now() - store.lastSyncedAt.getTime()) / (1000 * 60 * 60)
    return hoursSinceSync > 1
  }, [store.lastSyncedAt])

  // Initialize daily progress on mount
  useEffect(() => {
    if (!store.todayProgress) {
      store.resetDailyProgress()
    }
  }, [])

  // Check and update streak on first practice of the day
  const updateStreakIfNeeded = useCallback(() => {
    if (!hasPracticedToday(store.lastPracticeDate)) {
      return store.updatePracticeStreak()
    }
    return null
  }, [store.lastPracticeDate])

  // Check for newly unlocked achievements
  const checkForNewAchievements = useCallback(async (): Promise<Achievement[]> => {
    const unlockedAchievements: Achievement[] = []

    for (const achievement of store.achievements) {
      if (!achievement.unlocked && checkAchievementProgress(achievement, stats)) {
        const unlocked = store.unlockAchievement(achievement.id)
        if (unlocked) {
          unlockedAchievements.push(unlocked)

          // Sync achievement unlock to database
          if (store.user) {
            try {
              await supabase.from('user_achievements').insert({
                user_id: store.user.id,
                achievement_id: achievement.id,
              })
            } catch (error) {
              console.error('Failed to sync achievement:', error)
            }
          }
        }
      }
    }

    return unlockedAchievements
  }, [store.achievements, stats, store.user])

  // Practice a word (review)
  const practiceWord = useCallback(async (correct: boolean): Promise<PracticeSessionResult> => {
    const xpEarned = correct ? XP_REWARDS.WORD_REVIEWED_CORRECT : XP_REWARDS.WORD_REVIEWED_INCORRECT

    // Update streak on first practice of the day
    const streakResult = updateStreakIfNeeded()

    // Add XP and get level up result
    const levelUpResult = store.addXp(xpEarned)

    // Update stats
    store.incrementStats({ wordsLearned: 1 }) // Reviews count as learned

    // Check for new achievements
    const achievementsUnlocked = await checkForNewAchievements()

    return {
      xpEarned,
      wordsLearned: 0,
      wordsReviewed: 1,
      phrasesPracticed: 0,
      timeSpentMinutes: 0,
      levelUpResult: levelUpResult.didLevelUp ? levelUpResult : null,
      achievementsUnlocked,
      streakUpdated: !!streakResult,
      newStreak: store.currentStreak,
    }
  }, [updateStreakIfNeeded, checkForNewAchievements])

  // Learn a new word
  const learnWord = useCallback(async (): Promise<PracticeSessionResult> => {
    const xpEarned = XP_REWARDS.WORD_LEARNED

    // Update streak on first practice of the day
    const streakResult = updateStreakIfNeeded()

    // Add XP and get level up result
    const levelUpResult = store.addXp(xpEarned)

    // Update stats
    store.incrementStats({ wordsLearned: 1 })

    // Check for new achievements
    const achievementsUnlocked = await checkForNewAchievements()

    return {
      xpEarned,
      wordsLearned: 1,
      wordsReviewed: 0,
      phrasesPracticed: 0,
      timeSpentMinutes: 0,
      levelUpResult: levelUpResult.didLevelUp ? levelUpResult : null,
      achievementsUnlocked,
      streakUpdated: !!streakResult,
      newStreak: store.currentStreak,
    }
  }, [updateStreakIfNeeded, checkForNewAchievements])

  // Practice a phrase
  const practicePhrase = useCallback(async (): Promise<PracticeSessionResult> => {
    const xpEarned = XP_REWARDS.PHRASE_PRACTICED

    // Update streak on first practice of the day
    const streakResult = updateStreakIfNeeded()

    // Add XP and get level up result
    const levelUpResult = store.addXp(xpEarned)

    // Update stats
    store.incrementStats({ phrasesPracticed: 1 })

    // Check for new achievements
    const achievementsUnlocked = await checkForNewAchievements()

    return {
      xpEarned,
      wordsLearned: 0,
      wordsReviewed: 0,
      phrasesPracticed: 1,
      timeSpentMinutes: 0,
      levelUpResult: levelUpResult.didLevelUp ? levelUpResult : null,
      achievementsUnlocked,
      streakUpdated: !!streakResult,
      newStreak: store.currentStreak,
    }
  }, [updateStreakIfNeeded, checkForNewAchievements])

  // Complete a quiz
  const completeQuiz = useCallback(async (
    correctCount: number,
    totalCount: number
  ): Promise<PracticeSessionResult> => {
    const isPerfect = correctCount === totalCount && totalCount > 0

    let xpEarned = correctCount * XP_REWARDS.QUIZ_CORRECT
    if (isPerfect) {
      xpEarned += XP_REWARDS.QUIZ_PERFECT
    }

    // Update streak on first practice of the day
    const streakResult = updateStreakIfNeeded()

    // Add XP and get level up result
    const levelUpResult = store.addXp(xpEarned)

    // Update stats (quiz answers count as reviews)
    store.incrementStats({ wordsLearned: totalCount })

    // Check for new achievements
    const achievementsUnlocked = await checkForNewAchievements()

    return {
      xpEarned,
      wordsLearned: 0,
      wordsReviewed: totalCount,
      phrasesPracticed: 0,
      timeSpentMinutes: 0,
      levelUpResult: levelUpResult.didLevelUp ? levelUpResult : null,
      achievementsUnlocked,
      streakUpdated: !!streakResult,
      newStreak: store.currentStreak,
    }
  }, [updateStreakIfNeeded, checkForNewAchievements])

  // Start a practice session
  const startPracticeSession = useCallback(() => {
    // This would typically initialize a practice session object
    // For now, we just update the streak
    updateStreakIfNeeded()
  }, [updateStreakIfNeeded])

  // End a practice session
  const endPracticeSession = useCallback(async (
    timeSpentMinutes: number
  ): Promise<PracticeSessionResult> => {
    // Increment practice session count
    store.incrementStats({
      practiceSessions: 1,
      timeSpentMinutes,
    })

    // Check for new achievements
    const achievementsUnlocked = await checkForNewAchievements()

    // No XP for just ending session (XP earned during practice)
    return {
      xpEarned: 0,
      wordsLearned: 0,
      wordsReviewed: 0,
      phrasesPracticed: 0,
      timeSpentMinutes,
      levelUpResult: null,
      achievementsUnlocked,
      streakUpdated: false,
      newStreak: store.currentStreak,
    }
  }, [checkForNewAchievements])

  // Sync with database
  const syncWithDatabase = useCallback(async () => {
    if (!store.user) return

    try {
      // Update user profile in database
      await supabase
        .from('profiles')
        .update({
          total_xp: store.totalXp,
          current_level: store.currentLevel,
          current_rank: store.currentRank,
          current_streak: store.currentStreak,
          longest_streak: store.longestStreak,
          streak_freeze_available: store.streakFreezeAvailable,
          last_practice_date: store.lastPracticeDate,
          daily_xp_goal: store.dailyXpGoal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', store.user.id)

      // Sync today's progress
      if (store.todayProgress) {
        await supabase
          .from('daily_progress')
          .upsert({
            user_id: store.user.id,
            date: store.todayProgress.date,
            xp_earned: store.todayProgress.xp_earned,
            words_learned: store.todayProgress.words_learned,
            words_reviewed: store.todayProgress.words_reviewed,
            phrases_practiced: store.todayProgress.phrases_practiced,
            time_spent_minutes: store.todayProgress.time_spent_minutes,
          })
      }

      store.markSynced()
    } catch (error) {
      console.error('Failed to sync with database:', error)
    }
  }, [store.user, store.totalXp, store.currentLevel, store.todayProgress])

  // Auto-sync every 5 minutes if needed
  useEffect(() => {
    if (!needsSync) return

    const interval = setInterval(() => {
      syncWithDatabase()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [needsSync, syncWithDatabase])

  // Set daily goal
  const setDailyGoal = useCallback((goal: 10 | 20 | 50) => {
    store.setDailyXpGoal(goal)

    // Sync to database
    if (store.user) {
      supabase
        .from('profiles')
        .update({ daily_xp_goal: goal })
        .eq('id', store.user.id)
        .then(null, console.error)
    }
  }, [store.user])

  return {
    stats,
    dailyProgress,
    achievements: store.achievements,

    practiceWord,
    learnWord,
    practicePhrase,
    completeQuiz,
    startPracticeSession,
    endPracticeSession,

    checkForNewAchievements,
    syncWithDatabase,
    setDailyGoal,

    isLoading: false,
    needsSync,
  }
}

// Helper hook for level progression visualization
export function useLevelProgress() {
  const { stats } = useGamification()

  return useMemo(() => {
    const currentLevelXp = Math.pow(stats.current_level - 1, 2) * 100
    const nextLevelXp = Math.pow(stats.current_level, 2) * 100
    const xpInCurrentLevel = stats.total_xp - currentLevelXp
    const xpNeededForLevel = nextLevelXp - currentLevelXp
    const percentage = (xpInCurrentLevel / xpNeededForLevel) * 100

    return {
      currentLevel: stats.current_level,
      currentLevelXp,
      nextLevelXp,
      xpInCurrentLevel,
      xpNeededForLevel,
      percentage: Math.min(100, Math.max(0, percentage)),
      isMaxLevel: stats.current_level >= 50,
    }
  }, [stats.total_xp, stats.current_level])
}

// Helper hook for streak status
export function useStreakStatus() {
  const { stats } = useGamification()

  return useMemo(() => {
    const hasStreak = stats.current_streak > 0
    const canUseFreeze = stats.streak_freeze_available
    const isOnFire = stats.current_streak >= 7

    return {
      hasStreak,
      canUseFreeze,
      isOnFire,
      daysUntilFreeze: canUseFreeze ? 0 : Math.max(0, 7 - (stats.current_streak % 7)),
    }
  }, [stats.current_streak, stats.streak_freeze_available])
}
