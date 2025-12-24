import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { VocabularyWord, VocabularyCategory } from '../../types/vocabulary'
import { CATEGORY_INFO } from '../../types/vocabulary'
import { useVocabularyStore } from './vocabularyStore'
import { calculateMastery, getIntervalDescription, isDue } from '../../lib/spacedRepetition'

interface VocabularyListProps {
  onAddWord: () => void
}

export function VocabularyList({ onAddWord }: VocabularyListProps) {
  const words = useVocabularyStore((state) => state.words)
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'alphabetical' | 'dueDate' | 'mastery'>('alphabetical')

  const filteredAndSortedWords = useMemo(() => {
    let filtered = words

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((word) => word.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (word) =>
          word.french.toLowerCase().includes(query) ||
          word.english.toLowerCase().includes(query)
      )
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.french.localeCompare(b.french)
        case 'dueDate':
          return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime()
        case 'mastery':
          const masteryA = calculateMastery(a.timesCorrect, a.timesIncorrect, a.repetitions)
          const masteryB = calculateMastery(b.timesCorrect, b.timesIncorrect, b.repetitions)
          return masteryB - masteryA
        default:
          return 0
      }
    })

    return sorted
  }, [words, selectedCategory, searchQuery, sortBy])

  const categories: Array<VocabularyCategory | 'all'> = [
    'all',
    'greetings',
    'restaurant',
    'directions',
    'shopping',
    'transportation',
    'accommodation',
    'numbers',
    'time',
    'common',
    'emergency',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vocabulary</h2>
        <button
          onClick={onAddWord}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Word
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search vocabulary..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((category) => {
          const isAll = category === 'all'
          const info = isAll ? null : CATEGORY_INFO[category]

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {isAll ? '🌟' : info?.icon}
              <span>{isAll ? 'All' : info?.name}</span>
            </button>
          )
        })}
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy('alphabetical')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            sortBy === 'alphabetical'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          A-Z
        </button>
        <button
          onClick={() => setSortBy('dueDate')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            sortBy === 'dueDate'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Due Date
        </button>
        <button
          onClick={() => setSortBy('mastery')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            sortBy === 'mastery'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Mastery
        </button>
      </div>

      {/* Word Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filteredAndSortedWords.length} {filteredAndSortedWords.length === 1 ? 'word' : 'words'}
      </div>

      {/* Word List */}
      <div className="space-y-3">
        {filteredAndSortedWords.map((word, index) => (
          <WordCard key={word.id} word={word} index={index} />
        ))}

        {filteredAndSortedWords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600 dark:text-gray-400">No words found</p>
          </div>
        )}
      </div>
    </div>
  )
}

function WordCard({ word, index }: { word: VocabularyWord; index: number }) {
  const categoryInfo = CATEGORY_INFO[word.category]
  const mastery = calculateMastery(word.timesCorrect, word.timesIncorrect, word.repetitions)
  const isWordDue = isDue(new Date(word.nextReviewDate))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`text-2xl p-2 rounded-lg bg-gradient-to-br ${categoryInfo.color}`}>
              {categoryInfo.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{word.french}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{word.phonetic}</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-3">{word.english}</p>

          {word.exampleSentence && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">
              "{word.exampleSentence}"
            </p>
          )}

          {/* Mastery Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Mastery: {mastery.toFixed(0)}%</span>
              <span className="flex items-center gap-1">
                <span className="text-green-600">✓ {word.timesCorrect}</span>
                <span className="text-red-600">✗ {word.timesIncorrect}</span>
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${mastery}%` }}
              />
            </div>
          </div>

          {/* Next Review */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            {word.mastered ? (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-medium">
                ⭐ Mastered
              </span>
            ) : (
              <>
                {isWordDue ? (
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full font-medium">
                    🔴 Due for review
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    Next: {getIntervalDescription(word.interval)}
                  </span>
                )}
              </>
            )}
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
              {categoryInfo.name}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
