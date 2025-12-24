import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Flashcard } from './Flashcard'
import type { VocabularyWord } from '../../types/vocabulary'
import { useVocabularyStore } from './vocabularyStore'
import { useStore as useGamificationStore } from '../../lib/store'

interface FlashcardDeckProps {
  words: VocabularyWord[]
  onComplete: () => void
}

export function FlashcardDeck({ words, onComplete }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const reviewWord = useVocabularyStore((state) => state.reviewWord)
  const addXp = useGamificationStore((state) => state.addXp)

  const currentWord = words[currentIndex]
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  useEffect(() => {
    // Handle swipe gestures
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleRate(0) // Again
      } else if (e.key === 'ArrowRight') {
        handleRate(5) // Easy
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex])

  const handleRate = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentWord) return

    // Update word with SM-2 algorithm
    const xpEarned = reviewWord(currentWord.id, quality)

    // Add XP to user
    if (xpEarned > 0) {
      addXp(xpEarned)
    }

    // Set animation direction
    setDirection(quality >= 3 ? 'right' : 'left')

    // Move to next card or complete session
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setDirection(null)
      } else {
        onComplete()
      }
    }, 300)
  }

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const swipeThreshold = 100

    if (info.offset.x > swipeThreshold) {
      // Swiped right - Easy
      handleRate(5)
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left - Again
      handleRate(0)
    }
  }

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Session Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Great job! You've reviewed all cards.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[600px]">
      {/* Swipe Indicators */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-8 pointer-events-none z-10">
        <motion.div
          className="flex items-center gap-2 text-red-500 font-bold text-xl"
          animate={{ opacity: direction === 'left' ? 1 : 0 }}
        >
          <span>←</span>
          <span>Again</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 text-green-500 font-bold text-xl"
          animate={{ opacity: direction === 'right' ? 1 : 0 }}
        >
          <span>Easy</span>
          <span>→</span>
        </motion.div>
      </div>

      {/* Card Stack */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            style={{ x, rotate, opacity }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
              opacity: 0,
              transition: { duration: 0.3 },
            }}
            transition={{ duration: 0.3 }}
          >
            <Flashcard
              word={currentWord}
              onRate={handleRate}
              cardNumber={currentIndex + 1}
              totalCards={words.length}
            />
          </motion.div>
        </AnimatePresence>

        {/* Preview of next card */}
        {currentIndex < words.length - 1 && (
          <div className="absolute top-0 left-0 right-0 pointer-events-none -z-10">
            <div className="opacity-50 scale-95 blur-sm">
              <Flashcard
                word={words[currentIndex + 1]}
                onRate={() => {}}
                cardNumber={currentIndex + 2}
                totalCards={words.length}
              />
            </div>
          </div>
        )}
      </div>

      {/* Swipe Hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: currentIndex === 0 ? 1 : 0 }}
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <p>Swipe left for "Again" or right for "Easy"</p>
        <p className="mt-1">Or use keyboard arrows</p>
      </motion.div>
    </div>
  )
}
