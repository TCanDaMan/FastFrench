// Practice Session Management for FastFrench

import { XP_REWARDS } from './xp'

export interface PracticeActivity {
  type: 'word_learned' | 'word_reviewed_correct' | 'word_reviewed_incorrect' | 'phrase_practiced' | 'quiz_correct' | 'quiz_perfect'
  count: number
  timestamp: Date
}

export interface PracticeSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  activities: PracticeActivity[]
  totalXp: number
  isActive: boolean
}

export interface SessionSummary {
  duration: number // minutes
  wordsLearned: number
  wordsReviewed: number
  phrasesPracticed: number
  quizScore: number
  totalXp: number
  perfectQuiz: boolean
  activities: PracticeActivity[]
}

// Create a new practice session
export function createSession(userId: string): PracticeSession {
  return {
    id: crypto.randomUUID(),
    userId,
    startTime: new Date(),
    activities: [],
    totalXp: 0,
    isActive: true,
  }
}

// Add activity to current session
export function addActivity(
  session: PracticeSession,
  type: PracticeActivity['type'],
  count: number = 1
): PracticeSession {
  const activity: PracticeActivity = {
    type,
    count,
    timestamp: new Date(),
  }

  const xpGained = calculateActivityXp(type, count)

  return {
    ...session,
    activities: [...session.activities, activity],
    totalXp: session.totalXp + xpGained,
  }
}

// Calculate XP for an activity
function calculateActivityXp(type: PracticeActivity['type'], count: number): number {
  switch (type) {
    case 'word_learned':
      return XP_REWARDS.WORD_LEARNED * count

    case 'word_reviewed_correct':
      return XP_REWARDS.WORD_REVIEWED_CORRECT * count

    case 'word_reviewed_incorrect':
      return XP_REWARDS.WORD_REVIEWED_INCORRECT * count

    case 'phrase_practiced':
      return XP_REWARDS.PHRASE_PRACTICED * count

    case 'quiz_correct':
      return XP_REWARDS.QUIZ_CORRECT * count

    case 'quiz_perfect':
      return XP_REWARDS.QUIZ_PERFECT * count

    default:
      return 0
  }
}

// End session and generate summary
export function endSession(session: PracticeSession): SessionSummary {
  const endTime = new Date()
  const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / (1000 * 60))

  // Aggregate activities
  const wordsLearned = session.activities
    .filter(a => a.type === 'word_learned')
    .reduce((sum, a) => sum + a.count, 0)

  const wordsReviewed = session.activities
    .filter(a => a.type === 'word_reviewed_correct' || a.type === 'word_reviewed_incorrect')
    .reduce((sum, a) => sum + a.count, 0)

  const phrasesPracticed = session.activities
    .filter(a => a.type === 'phrase_practiced')
    .reduce((sum, a) => sum + a.count, 0)

  const quizCorrect = session.activities
    .filter(a => a.type === 'quiz_correct')
    .reduce((sum, a) => sum + a.count, 0)

  const totalQuizQuestions = session.activities
    .filter(a => a.type === 'quiz_correct' || a.type === 'word_reviewed_incorrect')
    .reduce((sum, a) => sum + a.count, 0)

  const quizScore = totalQuizQuestions > 0
    ? Math.round((quizCorrect / totalQuizQuestions) * 100)
    : 0

  const perfectQuiz = session.activities.some(a => a.type === 'quiz_perfect')

  return {
    duration: Math.max(1, duration), // Minimum 1 minute
    wordsLearned,
    wordsReviewed,
    phrasesPracticed,
    quizScore,
    totalXp: session.totalXp,
    perfectQuiz,
    activities: session.activities,
  }
}

// Quick session helpers for common practice types

export function practiceWord(session: PracticeSession, correct: boolean): PracticeSession {
  return addActivity(
    session,
    correct ? 'word_reviewed_correct' : 'word_reviewed_incorrect',
    1
  )
}

export function learnWord(session: PracticeSession): PracticeSession {
  return addActivity(session, 'word_learned', 1)
}

export function practicePhrase(session: PracticeSession): PracticeSession {
  return addActivity(session, 'phrase_practiced', 1)
}

export function answerQuiz(session: PracticeSession, correct: boolean): PracticeSession {
  return addActivity(session, correct ? 'quiz_correct' : 'word_reviewed_incorrect', 1)
}

export function completeQuizPerfectly(session: PracticeSession): PracticeSession {
  return addActivity(session, 'quiz_perfect', 1)
}

// Session statistics

export function getSessionStats(session: PracticeSession): {
  duration: number
  activityCount: number
  xpPerMinute: number
  isProductive: boolean
} {
  const now = new Date()
  const duration = Math.floor((now.getTime() - session.startTime.getTime()) / (1000 * 60))
  const activityCount = session.activities.length
  const xpPerMinute = duration > 0 ? session.totalXp / duration : 0
  const isProductive = activityCount >= 5 && xpPerMinute >= 1

  return {
    duration: Math.max(1, duration),
    activityCount,
    xpPerMinute: Math.round(xpPerMinute),
    isProductive,
  }
}

// Check if session should be auto-ended (inactive for 30 minutes)
export function shouldAutoEnd(session: PracticeSession, inactivityMinutes: number = 30): boolean {
  if (!session.isActive || session.activities.length === 0) {
    return false
  }

  const lastActivity = session.activities[session.activities.length - 1]
  const now = new Date()
  const minutesSinceLastActivity = Math.floor(
    (now.getTime() - lastActivity.timestamp.getTime()) / (1000 * 60)
  )

  return minutesSinceLastActivity >= inactivityMinutes
}

// Get session XP breakdown
export function getXpBreakdown(session: PracticeSession): {
  type: string
  xp: number
  count: number
}[] {
  const breakdown = new Map<string, { xp: number; count: number }>()

  session.activities.forEach(activity => {
    const xp = calculateActivityXp(activity.type, activity.count)
    const existing = breakdown.get(activity.type) || { xp: 0, count: 0 }

    breakdown.set(activity.type, {
      xp: existing.xp + xp,
      count: existing.count + activity.count,
    })
  })

  return Array.from(breakdown.entries()).map(([type, data]) => ({
    type: formatActivityType(type as PracticeActivity['type']),
    xp: data.xp,
    count: data.count,
  }))
}

// Format activity type for display
function formatActivityType(type: PracticeActivity['type']): string {
  switch (type) {
    case 'word_learned':
      return 'Words Learned'
    case 'word_reviewed_correct':
      return 'Correct Reviews'
    case 'word_reviewed_incorrect':
      return 'Incorrect Reviews'
    case 'phrase_practiced':
      return 'Phrases Practiced'
    case 'quiz_correct':
      return 'Quiz Correct'
    case 'quiz_perfect':
      return 'Perfect Quiz'
    default:
      return 'Other'
  }
}

// Get motivational message based on session performance
export function getSessionMessage(summary: SessionSummary): string {
  const { totalXp, perfectQuiz, duration } = summary

  if (perfectQuiz) {
    return "Perfect score! You're mastering French!"
  }

  if (totalXp >= 100) {
    return "Amazing session! Keep up the great work!"
  }

  if (totalXp >= 50) {
    return "Great progress today!"
  }

  if (duration >= 30) {
    return "Impressive dedication! Time flies when you're learning!"
  }

  return "Good session! Every bit of practice counts!"
}

// Calculate session quality score (0-100)
export function calculateSessionQuality(summary: SessionSummary): number {
  let score = 0

  // XP contribution (0-40 points)
  score += Math.min(40, (summary.totalXp / 100) * 40)

  // Duration contribution (0-20 points)
  score += Math.min(20, (summary.duration / 20) * 20)

  // Accuracy contribution (0-30 points)
  if (summary.quizScore > 0) {
    score += (summary.quizScore / 100) * 30
  } else {
    score += 15 // Neutral score if no quiz
  }

  // Perfect bonus (10 points)
  if (summary.perfectQuiz) {
    score += 10
  }

  return Math.min(100, Math.round(score))
}
