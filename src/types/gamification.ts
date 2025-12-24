// Gamification Types for FastFrench

export enum Rank {
  DEBUTANT = 'debutant',
  TOURISTE = 'touriste',
  VOYAGEUR = 'voyageur',
  PARISIEN = 'parisien',
  MAITRE = 'maitre',
}

export const RankLabels: Record<Rank, string> = {
  [Rank.DEBUTANT]: 'Débutant',
  [Rank.TOURISTE]: 'Touriste',
  [Rank.VOYAGEUR]: 'Voyageur',
  [Rank.PARISIEN]: 'Parisien',
  [Rank.MAITRE]: 'Maître',
}

export const RankDescriptions: Record<Rank, string> = {
  [Rank.DEBUTANT]: 'Just starting your French journey',
  [Rank.TOURISTE]: 'Basic conversational skills',
  [Rank.VOYAGEUR]: 'Comfortable traveler',
  [Rank.PARISIEN]: 'Advanced fluency',
  [Rank.MAITRE]: 'Master of French',
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon_name: string
  xp_reward: number
  requirement_type: RequirementType
  requirement_value: number
  unlocked: boolean
  earned_at?: Date
}

export enum RequirementType {
  XP_EARNED = 'xp_earned',
  WORDS_LEARNED = 'words_learned',
  WORDS_REVIEWED = 'words_reviewed',
  PHRASES_PRACTICED = 'phrases_practiced',
  STREAK_DAYS = 'streak_days',
  PRACTICE_SESSIONS = 'practice_sessions',
  PERFECT_LESSONS = 'perfect_lessons',
  TIME_SPENT_MINUTES = 'time_spent_minutes',
}

export interface DailyProgress {
  id?: string
  user_id: string
  date: Date
  xp_earned: number
  words_learned: number
  words_reviewed: number
  phrases_practiced: number
  time_spent_minutes: number
  practice_sessions: number
  perfect_lessons: number
}

export interface Challenge {
  id: string
  challenge_type: 'daily' | 'weekly'
  description: string
  xp_reward: number
  requirement_type: RequirementType
  requirement_value: number
  start_date: Date
  end_date: Date
  progress: number
  completed: boolean
}

export interface UserStats {
  total_xp: number
  current_level: number
  current_rank: Rank
  current_streak: number
  longest_streak: number
  streak_freeze_available: boolean
  last_practice_date: Date | null
  daily_xp_goal: 10 | 20 | 50
  words_learned: number
  phrases_practiced: number
  practice_sessions: number
  time_spent_minutes: number
}

export interface LevelUpResult {
  didLevelUp: boolean
  oldLevel: number
  newLevel: number
  oldRank: Rank
  newRank: Rank
}

export interface PracticeSessionResult {
  xpEarned: number
  wordsLearned: number
  wordsReviewed: number
  phrasesPracticed: number
  timeSpentMinutes: number
  levelUpResult: LevelUpResult | null
  achievementsUnlocked: Achievement[]
  streakUpdated: boolean
  newStreak: number
}
