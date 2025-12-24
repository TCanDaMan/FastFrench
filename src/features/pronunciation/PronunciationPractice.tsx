/**
 * Pronunciation Practice Component
 * Dedicated mode for practicing French pronunciation
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSlowTTS } from '../../hooks/useTTS'
import { AudioPlayer } from '../../components/AudioPlayer'
import {
  getPronunciationTips,
  getDifficultSounds,
  getLipPositionEmoji,
  getDifficultyLevel,
  syllabify,
  PRONUNCIATION_RULES,
  type PhoneticTip,
} from '../../lib/phonetics'
import type { VocabularyWord, VocabularyCategory } from '../../types/vocabulary'
import { CATEGORY_INFO } from '../../types/vocabulary'

export interface PronunciationPracticeProps {
  words: VocabularyWord[]
  category?: VocabularyCategory
  onComplete?: () => void
}

export function PronunciationPractice({
  words,
  category,
  onComplete,
}: PronunciationPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTips, setShowTips] = useState(false)
  const [showPhonetic, setShowPhonetic] = useState(true)

  const { speakSlow, speakNormal, speaking, isSlowMode } = useSlowTTS()

  const currentWord = words[currentIndex]
  const tips = getPronunciationTips(currentWord.french)
  const difficultSounds = getDifficultSounds(currentWord.french)
  const difficulty = getDifficultyLevel(currentWord.french)
  const syllables = syllabify(currentWord.french)
  const categoryInfo = category ? CATEGORY_INFO[category] : null

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowTips(false)
    } else {
      onComplete?.()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowTips(false)
    }
  }

  const handlePlaySlow = async () => {
    await speakSlow(currentWord.french)
  }

  const handlePlayNormal = async () => {
    await speakNormal(currentWord.french)
  }

  const difficultyColors = {
    easy: 'from-green-500 to-green-600',
    medium: 'from-yellow-500 to-orange-600',
    hard: 'from-red-500 to-pink-600',
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {categoryInfo && (
              <div className={`text-4xl p-3 rounded-2xl bg-gradient-to-br ${categoryInfo.color}`}>
                {categoryInfo.icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Pronunciation Practice
              </h1>
              {categoryInfo && (
                <p className="text-gray-600 dark:text-gray-400">{categoryInfo.name}</p>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentIndex + 1} / {words.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Word Card */}
      <div className={`mb-8 p-8 rounded-3xl bg-gradient-to-br ${difficultyColors[difficulty]} text-white shadow-2xl`}>
        <div className="text-center">
          {/* Difficulty Badge */}
          <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
          </div>

          {/* French Word */}
          <h2 className="text-6xl font-bold mb-4">{currentWord.french}</h2>

          {/* Syllables */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {syllables.map((syllable, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xl font-medium"
              >
                {syllable}
              </span>
            ))}
          </div>

          {/* Phonetic */}
          <AnimatePresence>
            {showPhonetic && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <p className="text-3xl text-white/90 font-light">{currentWord.phonetic}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* English Translation */}
          <p className="text-2xl text-white/80 mb-8">{currentWord.english}</p>

          {/* Audio Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePlaySlow}
              disabled={speaking}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              <span className="text-2xl">🐢</span>
              <span className="font-medium">Slow</span>
              {isSlowMode && <span className="animate-pulse">●</span>}
            </button>

            <button
              onClick={handlePlayNormal}
              disabled={speaking}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              <span className="text-2xl">🏃</span>
              <span className="font-medium">Normal</span>
              {!isSlowMode && speaking && <span className="animate-pulse">●</span>}
            </button>
          </div>

          {/* Toggle Phonetic */}
          <button
            onClick={() => setShowPhonetic(!showPhonetic)}
            className="mt-6 text-sm text-white/70 hover:text-white transition-colors"
          >
            {showPhonetic ? 'Hide' : 'Show'} Phonetic Notation
          </button>
        </div>
      </div>

      {/* Pronunciation Tips */}
      <div className="mb-8">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
        >
          <span className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>💡</span>
            Pronunciation Tips
            {difficultSounds.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                {difficultSounds.length} difficult sound{difficultSounds.length > 1 ? 's' : ''}
              </span>
            )}
          </span>
          <svg
            className={`w-6 h-6 transition-transform ${showTips ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              {/* Difficult Sounds */}
              {difficultSounds.length > 0 && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
                    <span>⚠️</span>
                    Challenging Sounds for English Speakers
                  </h3>
                  <div className="space-y-3">
                    {difficultSounds.map((tip, index) => (
                      <TipCard key={index} tip={tip} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Tips */}
              {tips.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                    All Sound Tips
                  </h3>
                  <div className="space-y-3">
                    {tips.map((tip, index) => (
                      <TipCard key={index} tip={tip} />
                    ))}
                  </div>
                </div>
              )}

              {/* General Rules */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <span>📚</span>
                  General French Pronunciation Rules
                </h3>
                <div className="space-y-2">
                  {PRONUNCIATION_RULES.map((rule, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-purple-900 dark:text-purple-300">
                        {rule.rule}
                      </div>
                      <div className="text-purple-700 dark:text-purple-400 ml-4">
                        {rule.description}
                      </div>
                      {rule.examples.length > 0 && (
                        <div className="text-purple-600 dark:text-purple-500 ml-4 text-xs italic">
                          Examples: {rule.examples.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Example Sentence */}
      {currentWord.exampleSentence && (
        <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Example Sentence
          </h3>
          <p className="text-lg text-gray-900 dark:text-white italic mb-4">
            {currentWord.exampleSentence}
          </p>
          <AudioPlayer
            text={currentWord.exampleSentence}
            lang="fr-FR"
            variant="compact"
            showSpeedControl
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg transform hover:scale-105"
        >
          {currentIndex === words.length - 1 ? 'Finish' : 'Next'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function TipCard({ tip }: { tip: PhoneticTip }) {
  const lipEmoji = getLipPositionEmoji(tip.sound)

  return (
    <div className="flex items-start gap-3">
      <div className="text-3xl flex-shrink-0">{lipEmoji}</div>
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-white mb-1">
          Sound: <span className="text-blue-600 dark:text-blue-400">[{tip.sound}]</span>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
          {tip.description}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Example: <span className="italic">{tip.example}</span>
        </div>
        {tip.englishApproximation && (
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            English approximation: {tip.englishApproximation}
          </div>
        )}
        {tip.lipPosition && (
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Lip position: {tip.lipPosition}
          </div>
        )}
      </div>
    </div>
  )
}
