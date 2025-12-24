/**
 * Vocabulary types for flashcard system
 */

export type VocabularyCategory =
  | 'greetings'
  | 'restaurant'
  | 'directions'
  | 'shopping'
  | 'transportation'
  | 'accommodation'
  | 'numbers'
  | 'time'
  | 'common'
  | 'emergency'

export interface VocabularyWord {
  id: string
  french: string
  english: string
  phonetic: string // IPA pronunciation
  category: VocabularyCategory
  exampleSentence?: string

  // SM-2 spaced repetition fields
  easinessFactor: number // Default: 2.5
  interval: number // Days until next review
  repetitions: number // Number of successful repetitions
  nextReviewDate: Date // When to review next
  timesCorrect: number // Total correct answers
  timesIncorrect: number // Total incorrect answers
  mastered: boolean // Whether word is mastered

  // Metadata
  addedAt: Date
  lastReviewedAt?: Date
}

export interface VocabularyStats {
  totalWords: number
  dueWords: number
  newWords: number
  masteredWords: number
  reviewedToday: number
  currentStreak: number
}

export interface ReviewSession {
  id: string
  startedAt: Date
  completedAt?: Date
  wordsReviewed: number
  correctAnswers: number
  incorrectAnswers: number
  xpEarned: number
}

export interface CategoryInfo {
  id: VocabularyCategory
  name: string
  icon: string
  description: string
  color: string
}

export const CATEGORY_INFO: Record<VocabularyCategory, CategoryInfo> = {
  greetings: {
    id: 'greetings',
    name: 'Greetings & Basics',
    icon: '👋',
    description: 'Essential greetings and common phrases',
    color: 'from-blue-500 to-blue-600',
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant & Food',
    icon: '🍽️',
    description: 'Dining out and ordering food',
    color: 'from-orange-500 to-orange-600',
  },
  directions: {
    id: 'directions',
    name: 'Directions & Places',
    icon: '🗺️',
    description: 'Finding your way around Paris',
    color: 'from-green-500 to-green-600',
  },
  shopping: {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    description: 'Shopping and purchases',
    color: 'from-pink-500 to-pink-600',
  },
  transportation: {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚇',
    description: 'Getting around by metro, bus, taxi',
    color: 'from-purple-500 to-purple-600',
  },
  accommodation: {
    id: 'accommodation',
    name: 'Accommodation',
    icon: '🏨',
    description: 'Hotels and lodging',
    color: 'from-indigo-500 to-indigo-600',
  },
  numbers: {
    id: 'numbers',
    name: 'Numbers',
    icon: '🔢',
    description: 'Counting and quantities',
    color: 'from-cyan-500 to-cyan-600',
  },
  time: {
    id: 'time',
    name: 'Time & Dates',
    icon: '🕐',
    description: 'Telling time and dates',
    color: 'from-teal-500 to-teal-600',
  },
  common: {
    id: 'common',
    name: 'Common Words',
    icon: '⭐',
    description: 'Frequently used vocabulary',
    color: 'from-yellow-500 to-yellow-600',
  },
  emergency: {
    id: 'emergency',
    name: 'Emergency',
    icon: '🚨',
    description: 'Important safety phrases',
    color: 'from-red-500 to-red-600',
  },
}
