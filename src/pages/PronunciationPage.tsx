/**
 * Pronunciation Practice Page
 * Dedicated page for practicing French pronunciation
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PronunciationPractice } from '../features/pronunciation/PronunciationPractice'
import { VoiceSelector } from '../components/VoiceSelector'
import { useVocabularyStore } from '../features/vocabulary/vocabularyStore'
import type { VocabularyCategory } from '../types/vocabulary'
import { CATEGORY_INFO } from '../types/vocabulary'
import { getDifficultyLevel } from '../lib/phonetics'

export function PronunciationPage() {
  const { words } = useVocabularyStore()
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [isPracticing, setIsPracticing] = useState(false)

  // Filter words based on selection
  const filteredWords = useMemo(() => {
    let filtered = words

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((w) => w.category === selectedCategory)
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((w) => getDifficultyLevel(w.french) === difficultyFilter)
    }

    return filtered
  }, [words, selectedCategory, difficultyFilter])

  const handleStartPractice = () => {
    if (filteredWords.length > 0) {
      setIsPracticing(true)
    }
  }

  const handleCompletePractice = () => {
    setIsPracticing(false)
  }

  if (isPracticing && filteredWords.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
        <PronunciationPractice
          words={filteredWords}
          category={selectedCategory !== 'all' ? selectedCategory : undefined}
          onComplete={handleCompletePractice}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🗣️</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Pronunciation Practice
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Master authentic French pronunciation with guided practice
          </p>
        </motion.div>

        {/* Voice Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <VoiceSelector />
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === 'all'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold text-sm">All Categories</div>
              <div className="text-xs opacity-75 mt-1">{words.length} words</div>
            </button>

            {Object.values(CATEGORY_INFO).map((category) => {
              const categoryWords = words.filter((w) => w.category === category.id)
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-sm">{category.name}</div>
                  <div className="text-xs opacity-75 mt-1">{categoryWords.length} words</div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Difficulty Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Difficulty Level
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setDifficultyFilter('all')}
              className={`p-4 rounded-xl border-2 transition-all ${
                difficultyFilter === 'all'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400'
              }`}
            >
              <div className="font-semibold">All Levels</div>
              <div className="text-xs opacity-75 mt-1">
                {filteredWords.length} words
              </div>
            </button>

            <button
              onClick={() => setDifficultyFilter('easy')}
              className={`p-4 rounded-xl border-2 transition-all ${
                difficultyFilter === 'easy'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400'
              }`}
            >
              <div className="flex items-center gap-2 justify-center mb-1">
                <span className="text-xl">😊</span>
                <span className="font-semibold text-green-600 dark:text-green-400">Easy</span>
              </div>
              <div className="text-xs opacity-75">
                {words.filter((w) => getDifficultyLevel(w.french) === 'easy').length} words
              </div>
            </button>

            <button
              onClick={() => setDifficultyFilter('medium')}
              className={`p-4 rounded-xl border-2 transition-all ${
                difficultyFilter === 'medium'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-yellow-400'
              }`}
            >
              <div className="flex items-center gap-2 justify-center mb-1">
                <span className="text-xl">🤔</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">Medium</span>
              </div>
              <div className="text-xs opacity-75">
                {words.filter((w) => getDifficultyLevel(w.french) === 'medium').length} words
              </div>
            </button>

            <button
              onClick={() => setDifficultyFilter('hard')}
              className={`p-4 rounded-xl border-2 transition-all ${
                difficultyFilter === 'hard'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-red-400'
              }`}
            >
              <div className="flex items-center gap-2 justify-center mb-1">
                <span className="text-xl">😰</span>
                <span className="font-semibold text-red-600 dark:text-red-400">Hard</span>
              </div>
              <div className="text-xs opacity-75">
                {words.filter((w) => getDifficultyLevel(w.french) === 'hard').length} words
              </div>
            </button>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={handleStartPractice}
            disabled={filteredWords.length === 0}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Start Practice
            <span className="ml-2">→</span>
          </button>

          {filteredWords.length === 0 && (
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No words available for this selection. Try a different filter.
            </p>
          )}

          {filteredWords.length > 0 && (
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''} ready to practice
            </p>
          )}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">🐢</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Slow Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Practice at a slower pace to master difficult pronunciations
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Tips</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get guidance on challenging French sounds with visual cues
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Targeted Practice</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Focus on specific categories or difficulty levels
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
