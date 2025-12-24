import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { VocabularyWord, VocabularyCategory, VocabularyStats } from '../../types/vocabulary'
import { calculateSM2, isDue, isMastered } from '../../lib/spacedRepetition'
import { initialVocabulary } from '../../data/initialVocabulary'

interface VocabularyState {
  words: VocabularyWord[]
  currentSession: {
    wordsReviewed: number
    correctAnswers: number
    incorrectAnswers: number
    xpEarned: number
  } | null

  // Actions
  initializeWords: () => void
  addWord: (word: Omit<VocabularyWord, 'id' | 'easinessFactor' | 'interval' | 'repetitions' | 'nextReviewDate' | 'timesCorrect' | 'timesIncorrect' | 'mastered' | 'addedAt'>) => void
  reviewWord: (id: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => number
  deleteWord: (id: string) => void

  // Queries
  getDueWords: () => VocabularyWord[]
  getNewWords: (limit?: number) => VocabularyWord[]
  getWordsByCategory: (category: VocabularyCategory) => VocabularyWord[]
  getStats: () => VocabularyStats
  getWord: (id: string) => VocabularyWord | undefined

  // Session management
  startSession: () => void
  endSession: () => { wordsReviewed: number; correctAnswers: number; incorrectAnswers: number; xpEarned: number } | null
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      words: [],
      currentSession: null,

      initializeWords: () => {
        const { words } = get()
        if (words.length === 0) {
          set({ words: initialVocabulary })
        }
      },

      addWord: (wordData) => {
        const newWord: VocabularyWord = {
          ...wordData,
          id: crypto.randomUUID(),
          easinessFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewDate: new Date(), // Due immediately for new words
          timesCorrect: 0,
          timesIncorrect: 0,
          mastered: false,
          addedAt: new Date(),
        }

        set((state) => ({
          words: [...state.words, newWord],
        }))
      },

      reviewWord: (id, quality) => {
        const state = get()
        const word = state.words.find((w) => w.id === id)
        if (!word) return 0

        // Calculate SM-2 parameters
        const sm2Result = calculateSM2(
          quality,
          word.easinessFactor,
          word.interval,
          word.repetitions
        )

        // Calculate XP earned
        let xpEarned = 0
        if (quality >= 3) {
          // Base XP for correct answer
          xpEarned = 10

          // Bonus XP for harder words
          if (word.easinessFactor < 2.0) {
            xpEarned += 5
          }

          // Bonus XP for perfect recall
          if (quality === 5) {
            xpEarned += 5
          }

          // Bonus XP for first-time correct
          if (word.timesCorrect === 0) {
            xpEarned += 10
          }
        }

        // Update word
        const updatedWord: VocabularyWord = {
          ...word,
          ...sm2Result,
          timesCorrect: word.timesCorrect + (quality >= 3 ? 1 : 0),
          timesIncorrect: word.timesIncorrect + (quality < 3 ? 1 : 0),
          lastReviewedAt: new Date(),
          mastered: isMastered(
            sm2Result.repetitions,
            sm2Result.easinessFactor,
            word.timesCorrect + (quality >= 3 ? 1 : 0),
            word.timesIncorrect + (quality < 3 ? 1 : 0)
          ),
        }

        // Update state
        set((state) => ({
          words: state.words.map((w) => (w.id === id ? updatedWord : w)),
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                wordsReviewed: state.currentSession.wordsReviewed + 1,
                correctAnswers: state.currentSession.correctAnswers + (quality >= 3 ? 1 : 0),
                incorrectAnswers: state.currentSession.incorrectAnswers + (quality < 3 ? 1 : 0),
                xpEarned: state.currentSession.xpEarned + xpEarned,
              }
            : null,
        }))

        return xpEarned
      },

      deleteWord: (id) => {
        set((state) => ({
          words: state.words.filter((w) => w.id !== id),
        }))
      },

      getDueWords: () => {
        const { words } = get()
        return words
          .filter((word) => !word.mastered && isDue(new Date(word.nextReviewDate)))
          .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
      },

      getNewWords: (limit = 10) => {
        const { words } = get()
        return words
          .filter((word) => word.repetitions === 0 && word.timesCorrect === 0)
          .slice(0, limit)
      },

      getWordsByCategory: (category) => {
        const { words } = get()
        return words.filter((word) => word.category === category)
      },

      getStats: () => {
        const { words } = get()
        const dueWords = words.filter((word) => !word.mastered && isDue(new Date(word.nextReviewDate)))
        const newWords = words.filter((word) => word.repetitions === 0 && word.timesCorrect === 0)
        const masteredWords = words.filter((word) => word.mastered)

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const reviewedToday = words.filter((word) => {
          if (!word.lastReviewedAt) return false
          const reviewDate = new Date(word.lastReviewedAt)
          reviewDate.setHours(0, 0, 0, 0)
          return reviewDate.getTime() === today.getTime()
        })

        return {
          totalWords: words.length,
          dueWords: dueWords.length,
          newWords: newWords.length,
          masteredWords: masteredWords.length,
          reviewedToday: reviewedToday.length,
          currentStreak: 0, // TODO: Implement streak tracking
        }
      },

      getWord: (id) => {
        const { words } = get()
        return words.find((w) => w.id === id)
      },

      startSession: () => {
        set({
          currentSession: {
            wordsReviewed: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            xpEarned: 0,
          },
        })
      },

      endSession: () => {
        const { currentSession } = get()
        set({ currentSession: null })
        return currentSession
      },
    }),
    {
      name: 'vocabulary-storage',
    }
  )
)
