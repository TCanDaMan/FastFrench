import { useState } from 'react'
import { motion } from 'framer-motion'
import type { VocabularyWord } from '../../types/vocabulary'
import { CATEGORY_INFO } from '../../types/vocabulary'
import { QUALITY_RATINGS } from '../../lib/spacedRepetition'
import { useTTS } from '../../hooks/useTTS'
import { AudioPlayer } from '../../components/AudioPlayer'

interface FlashcardProps {
  word: VocabularyWord
  onRate: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void
  cardNumber: number
  totalCards: number
}

export function Flashcard({ word, onRate, cardNumber, totalCards }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { speak, speaking, stop } = useTTS()

  const categoryInfo = CATEGORY_INFO[word.category]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handlePlayAudio = async (e: React.MouseEvent, slow: boolean = false) => {
    e.stopPropagation()

    if (speaking) {
      stop()
      return
    }

    try {
      await speak(word.french, {
        rate: slow ? 0.6 : 0.9,
      })
    } catch (error) {
      console.error('TTS Error:', error)
    }
  }

  const handleRate = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    onRate(quality)
    setIsFlipped(false) // Reset for next card
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Card {cardNumber} of {totalCards}</span>
          <span className="flex items-center gap-2">
            {categoryInfo.icon} {categoryInfo.name}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${(cardNumber / totalCards) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <motion.div
          className="relative w-full h-96 cursor-pointer"
          onClick={handleFlip}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className={`h-full rounded-3xl bg-gradient-to-br ${categoryInfo.color} p-8 shadow-2xl flex flex-col items-center justify-center text-white`}>
              <div className="text-6xl mb-4">{categoryInfo.icon}</div>
              <h2 className="text-5xl font-bold mb-4 text-center">{word.french}</h2>
              <p className="text-2xl text-white/90 mb-6 font-light">{word.phonetic}</p>

              {/* Audio Controls */}
              <div className="flex items-center gap-3 mb-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handlePlayAudio(e, true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-xl">🐢</span>
                  <span className="font-medium text-sm">Slow</span>
                </button>

                <button
                  onClick={(e) => handlePlayAudio(e, false)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  <svg
                    className={`w-5 h-5 ${speaking ? 'animate-pulse' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <span className="font-medium text-sm">Normal</span>
                </button>
              </div>

              <p className="mt-6 text-white/70 text-sm">Tap to reveal</p>
            </div>
          </div>

          {/* Back of card */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="h-full rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-2xl flex flex-col items-center justify-center">
              <div className={`text-4xl mb-6 p-4 rounded-full bg-gradient-to-br ${categoryInfo.color}`}>
                {categoryInfo.icon}
              </div>

              <h3 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                {word.english}
              </h3>

              {word.exampleSentence && (
                <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl max-w-md" onClick={(e) => e.stopPropagation()}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Example:</p>
                  <p className="text-gray-700 dark:text-gray-300 italic mb-3">{word.exampleSentence}</p>
                  <AudioPlayer
                    text={word.exampleSentence}
                    lang="fr-FR"
                    variant="compact"
                    showSpeedControl
                  />
                </div>
              )}

              <p className="text-gray-500 dark:text-gray-400 text-sm">Tap to flip back</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rating Buttons (only show when flipped) */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8"
        >
          <button
            onClick={() => handleRate(QUALITY_RATINGS.AGAIN)}
            className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="text-sm opacity-90">Again</div>
            <div className="text-xs opacity-70 mt-1">&lt; 1 day</div>
          </button>

          <button
            onClick={() => handleRate(QUALITY_RATINGS.HARD)}
            className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="text-sm opacity-90">Hard</div>
            <div className="text-xs opacity-70 mt-1">1 day</div>
          </button>

          <button
            onClick={() => handleRate(QUALITY_RATINGS.GOOD)}
            className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="text-sm opacity-90">Good</div>
            <div className="text-xs opacity-70 mt-1">3-6 days</div>
          </button>

          <button
            onClick={() => handleRate(QUALITY_RATINGS.EASY)}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="text-sm opacity-90">Easy</div>
            <div className="text-xs opacity-70 mt-1">&gt; 6 days</div>
          </button>
        </motion.div>
      )}
    </div>
  )
}
