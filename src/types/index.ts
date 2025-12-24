export interface User {
  id: string
  email: string
  username: string
  level: number
  xp: number
  streak: number
  createdAt: Date
}

export interface Lesson {
  id: string
  title: string
  description: string
  level: number
  xp: number
  exercises: Exercise[]
  locked: boolean
  progress: number
}

export interface Exercise {
  id: string
  type: 'multiple-choice' | 'fill-blank' | 'match' | 'speak'
  question: string
  options?: string[]
  answer: string
  explanation?: string
}

export interface Progress {
  userId: string
  lessonId: string
  completed: boolean
  score: number
  lastAttempt: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

// Re-export vocabulary types
export type { VocabularyWord, VocabularyCategory, VocabularyStats, CategoryInfo } from './vocabulary'
