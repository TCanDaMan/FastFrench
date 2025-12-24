// Example Usage of Gamification System
// This file demonstrates how to use the gamification hooks and utilities

import { useEffect } from 'react'
import { useGamification, useLevelProgress, useStreakStatus } from '../hooks/useGamification'
import { useStore } from '../lib/store'
import { loadUserData, saveUserData } from '../lib/sync'
import {
  xpToNextLevel,
  levelProgressPercentage,
  dailyXpProgress,
  XP_REWARDS
} from '../lib/xp'
import { getStreakMessage, getNextStreakMilestone } from '../lib/streaks'
import {
  getUnlockedAchievements,
  groupAchievementsByCategory,
  getAlmostUnlocked,
  formatRequirement
} from '../lib/achievements'
import { RankLabels } from '../types/gamification'

// Example 1: Display user stats and progress
export function UserStatsDisplay() {
  const { stats, dailyProgress } = useGamification()
  const levelProgress = useLevelProgress()
  const streakStatus = useStreakStatus()

  return (
    <div className="user-stats">
      {/* Level and XP */}
      <div className="level-info">
        <h2>Level {stats.current_level}</h2>
        <p>{RankLabels[stats.current_rank]}</p>
        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${levelProgress.percentage}%` }}
          />
        </div>
        <p>
          {levelProgress.xpInCurrentLevel} / {levelProgress.xpNeededForLevel} XP
        </p>
      </div>

      {/* Daily Progress */}
      <div className="daily-progress">
        <h3>Daily Goal</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${dailyProgress.percentage}%` }}
          />
        </div>
        <p>
          {dailyProgress.current} / {dailyProgress.goal} XP
          {dailyProgress.completed && ' ✓ Goal Reached!'}
        </p>
      </div>

      {/* Streak */}
      <div className="streak-info">
        <h3>
          {streakStatus.isOnFire ? '🔥' : ''}
          {stats.current_streak} Day Streak
        </h3>
        <p>{getStreakMessage(stats.current_streak)}</p>
        {streakStatus.canUseFreeze && (
          <p>✨ Streak Freeze Available</p>
        )}
        {!streakStatus.canUseFreeze && streakStatus.daysUntilFreeze > 0 && (
          <p>{streakStatus.daysUntilFreeze} days until next freeze</p>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div>
          <p>Words Learned</p>
          <p>{stats.words_learned}</p>
        </div>
        <div>
          <p>Phrases Practiced</p>
          <p>{stats.phrases_practiced}</p>
        </div>
        <div>
          <p>Practice Sessions</p>
          <p>{stats.practice_sessions}</p>
        </div>
        <div>
          <p>Time Spent</p>
          <p>{Math.floor(stats.time_spent_minutes / 60)}h {stats.time_spent_minutes % 60}m</p>
        </div>
      </div>
    </div>
  )
}

// Example 2: Practice a word and handle results
export function WordPracticeExample() {
  const { practiceWord, learnWord } = useGamification()

  const handleCorrectAnswer = async () => {
    const result = await practiceWord(true)

    // Show XP gained
    console.log(`+${result.xpEarned} XP`)

    // Check for level up
    if (result.levelUpResult) {
      console.log(`🎉 Level Up! ${result.levelUpResult.oldLevel} → ${result.levelUpResult.newLevel}`)

      // Check for rank up
      if (result.levelUpResult.newRank !== result.levelUpResult.oldRank) {
        console.log(`⭐ New Rank: ${RankLabels[result.levelUpResult.newRank]}`)
      }
    }

    // Check for achievements
    if (result.achievementsUnlocked.length > 0) {
      result.achievementsUnlocked.forEach(achievement => {
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`)
        console.log(`+${achievement.xp_reward} Bonus XP`)
      })
    }

    // Check for streak update
    if (result.streakUpdated) {
      console.log(`🔥 Streak updated: ${result.newStreak} days`)
    }
  }

  const handleIncorrectAnswer = async () => {
    const result = await practiceWord(false)
    console.log(`+${result.xpEarned} XP (keep practicing!)`)
  }

  const handleLearnNewWord = async () => {
    const result = await learnWord()
    console.log(`📚 New word learned! +${result.xpEarned} XP`)
  }

  return (
    <div>
      <button onClick={handleCorrectAnswer}>Correct Answer</button>
      <button onClick={handleIncorrectAnswer}>Incorrect Answer</button>
      <button onClick={handleLearnNewWord}>Learn New Word</button>
    </div>
  )
}

// Example 3: Complete a quiz
export function QuizExample() {
  const { completeQuiz } = useGamification()

  const handleQuizComplete = async () => {
    const correctAnswers = 8
    const totalQuestions = 10

    const result = await completeQuiz(correctAnswers, totalQuestions)

    // Perfect score bonus
    const isPerfect = correctAnswers === totalQuestions
    if (isPerfect) {
      console.log('🌟 Perfect Score! Bonus XP awarded!')
    }

    console.log(`Quiz complete: ${correctAnswers}/${totalQuestions}`)
    console.log(`+${result.xpEarned} XP`)

    // Handle level up and achievements
    if (result.levelUpResult) {
      console.log('🎉 Level Up!')
    }

    result.achievementsUnlocked.forEach(achievement => {
      console.log(`🏆 ${achievement.name}`)
    })
  }

  return (
    <button onClick={handleQuizComplete}>Complete Quiz</button>
  )
}

// Example 4: Display achievements
export function AchievementsDisplay() {
  const { achievements, stats } = useGamification()

  const grouped = groupAchievementsByCategory(achievements)
  const almostUnlocked = getAlmostUnlocked(achievements, stats, 80)

  return (
    <div className="achievements">
      {/* Almost unlocked */}
      {almostUnlocked.length > 0 && (
        <div className="almost-unlocked">
          <h3>Almost There!</h3>
          {almostUnlocked.map(achievement => (
            <div key={achievement.id} className="achievement-card">
              <h4>{achievement.name}</h4>
              <p>{achievement.description}</p>
              <p>{formatRequirement(achievement)}</p>
            </div>
          ))}
        </div>
      )}

      {/* All achievements by category */}
      {Object.entries(grouped).map(([category, categoryAchievements]) => {
        if (categoryAchievements.length === 0) return null

        return (
          <div key={category} className="achievement-category">
            <h3>{category}</h3>
            <div className="achievement-grid">
              {categoryAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <span className="icon">{achievement.icon_name}</span>
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  {achievement.unlocked ? (
                    <p className="unlocked-date">
                      Unlocked {achievement.earned_at?.toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="requirement">
                      {formatRequirement(achievement)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Example 5: Practice session flow
export function PracticeSessionExample() {
  const {
    startPracticeSession,
    endPracticeSession,
    learnWord,
    practicePhrase
  } = useGamification()

  const handleStartSession = () => {
    startPracticeSession()
    console.log('Practice session started')
  }

  const handleEndSession = async () => {
    const timeSpent = 25 // minutes

    const result = await endPracticeSession(timeSpent)

    console.log(`Session complete! ${timeSpent} minutes`)
    console.log(`Achievements unlocked: ${result.achievementsUnlocked.length}`)

    // Show session summary
    alert(`
      Great session!
      Time: ${timeSpent} minutes
      New Achievements: ${result.achievementsUnlocked.length}
    `)
  }

  return (
    <div className="practice-session">
      <button onClick={handleStartSession}>Start Practice</button>
      <button onClick={handleEndSession}>End Session</button>
    </div>
  )
}

// Example 6: Load and sync with database
export function SyncExample() {
  const { syncWithDatabase, needsSync } = useGamification()
  const user = useStore(state => state.user)

  // Load user data on mount
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id)
    }
  }, [user?.id])

  // Auto-save every 5 minutes
  useEffect(() => {
    if (!user?.id) return

    const interval = setInterval(() => {
      if (needsSync) {
        syncWithDatabase()
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [user?.id, needsSync, syncWithDatabase])

  const handleManualSync = async () => {
    if (user?.id) {
      await saveUserData(user.id)
      console.log('Synced with database')
    }
  }

  return (
    <div className="sync-controls">
      {needsSync && <p>⚠️ Unsaved changes</p>}
      <button onClick={handleManualSync}>Manual Sync</button>
    </div>
  )
}

// Example 7: Change daily goal
export function DailyGoalSettings() {
  const { stats, setDailyGoal } = useGamification()

  return (
    <div className="goal-settings">
      <h3>Daily XP Goal</h3>
      <p>Current: {stats.daily_xp_goal} XP</p>

      <div className="goal-options">
        <button
          onClick={() => setDailyGoal(10)}
          className={stats.daily_xp_goal === 10 ? 'active' : ''}
        >
          Casual (10 XP)
        </button>
        <button
          onClick={() => setDailyGoal(20)}
          className={stats.daily_xp_goal === 20 ? 'active' : ''}
        >
          Regular (20 XP)
        </button>
        <button
          onClick={() => setDailyGoal(50)}
          className={stats.daily_xp_goal === 50 ? 'active' : ''}
        >
          Serious (50 XP)
        </button>
      </div>
    </div>
  )
}

// Example 8: Use streak freeze
export function StreakFreezeButton() {
  const { stats } = useGamification()
  const store = useStore()

  const handleUseFreeze = () => {
    const success = store.useStreakFreeze()

    if (success) {
      console.log('✨ Streak freeze used! Your streak is safe.')
    } else {
      console.log('❌ Cannot use streak freeze right now.')
    }
  }

  if (!stats.streak_freeze_available) {
    return null
  }

  return (
    <button onClick={handleUseFreeze} className="streak-freeze-btn">
      ❄️ Use Streak Freeze
    </button>
  )
}
