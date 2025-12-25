import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlashcardDeck } from '../features/vocabulary/FlashcardDeck'
import { VocabularyList } from '../features/vocabulary/VocabularyList'
import { AddWordModal } from '../features/vocabulary/AddWordModal'
import { useVocabularyStore } from '../features/vocabulary/vocabularyStore'
import type { VocabularyCategory } from '../types/vocabulary'
import { CATEGORY_INFO } from '../types/vocabulary'

type PracticeMode = 'review' | 'new' | 'category' | null
type View = 'selection' | 'practice' | 'browse'

export default function PracticePage() {
  const [view, setView] = useState<View>('selection')
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(null)
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [showSessionSummary, setShowSessionSummary] = useState(false)

  const initializeWords = useVocabularyStore((state) => state.initializeWords)
  const getDueWords = useVocabularyStore((state) => state.getDueWords)
  const getNewWords = useVocabularyStore((state) => state.getNewWords)
  const getWordsByCategory = useVocabularyStore((state) => state.getWordsByCategory)
  const getStats = useVocabularyStore((state) => state.getStats)
  const startSession = useVocabularyStore((state) => state.startSession)
  const endSession = useVocabularyStore((state) => state.endSession)
  const currentSession = useVocabularyStore((state) => state.currentSession)

  const stats = getStats()

  useEffect(() => {
    // Initialize vocabulary on first load
    initializeWords()
  }, [initializeWords])

  const handleStartPractice = (mode: PracticeMode, category?: VocabularyCategory) => {
    setPracticeMode(mode)
    setSelectedCategory(category || null)
    startSession()
    setView('practice')
  }

  const handleCompletePractice = () => {
    endSession()
    setShowSessionSummary(true)
  }

  const handleCloseSummary = () => {
    setShowSessionSummary(false)
    setPracticeMode(null)
    setSelectedCategory(null)
    setView('selection')
  }

  const getPracticeWords = () => {
    if (practiceMode === 'review') {
      return getDueWords()
    } else if (practiceMode === 'new') {
      return getNewWords(10)
    } else if (practiceMode === 'category' && selectedCategory) {
      return getWordsByCategory(selectedCategory)
    }
    return []
  }

  const practiceWords = getPracticeWords()

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ paddingBottom: '5rem', paddingTop: '5rem' }}>
      <div className="px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem', marginInline: 'auto' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Practice</h1>
          <p className="text-zinc-400">
            Master French vocabulary with spaced repetition
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex mb-8" style={{ gap: '0.5rem' }}>
          <button
            onClick={() => setView('selection')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              view === 'selection'
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            Practice
          </button>
          <button
            onClick={() => setView('browse')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              view === 'browse'
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            Browse
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Daily Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 mb-8" style={{ gap: '1rem' }}>
                <StatCard
                  icon="📚"
                  label="Total Words"
                  value={stats.totalWords}
                  color="from-blue-500 to-blue-600"
                />
                <StatCard
                  icon="🔴"
                  label="Due for Review"
                  value={stats.dueWords}
                  color="from-red-500 to-red-600"
                />
                <StatCard
                  icon="⭐"
                  label="Mastered"
                  value={stats.masteredWords}
                  color="from-yellow-500 to-yellow-600"
                />
                <StatCard
                  icon="✅"
                  label="Reviewed Today"
                  value={stats.reviewedToday}
                  color="from-green-500 to-green-600"
                />
              </div>

              {/* Practice Options */}
              <div className="grid md:grid-cols-2 mb-8" style={{ gap: '1.5rem' }}>
                {/* Review Due Words */}
                <PracticeModeCard
                  icon="🔴"
                  title="Review Due Words"
                  description="Practice words that are due for review"
                  count={stats.dueWords}
                  gradient="from-red-500 to-red-600"
                  onClick={() => handleStartPractice('review')}
                  disabled={stats.dueWords === 0}
                />

                {/* Learn New Words */}
                <PracticeModeCard
                  icon="✨"
                  title="Learn New Words"
                  description="Add 10 new words to your vocabulary"
                  count={Math.min(stats.newWords, 10)}
                  gradient="from-green-500 to-green-600"
                  onClick={() => handleStartPractice('new')}
                  disabled={stats.newWords === 0}
                />
              </div>

              {/* Practice by Category */}
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Practice by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: '0.75rem' }}>
                  {(Object.keys(CATEGORY_INFO) as VocabularyCategory[]).map((category) => {
                    const info = CATEGORY_INFO[category]
                    const categoryWords = getWordsByCategory(category)
                    return (
                      <button
                        key={category}
                        onClick={() => handleStartPractice('category', category)}
                        disabled={categoryWords.length === 0}
                        className={`p-4 rounded-xl text-center transition-all ${
                          categoryWords.length === 0
                            ? 'bg-zinc-800 opacity-50 cursor-not-allowed'
                            : 'bg-gradient-to-br ' + info.color + ' hover:scale-105 shadow-lg'
                        }`}
                      >
                        <div className="text-3xl mb-2">{info.icon}</div>
                        <div className="text-xs font-medium text-white mb-1">{info.name}</div>
                        <div className="text-xs text-white/80">{categoryWords.length} words</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Back Button */}
              <button
                onClick={() => setView('selection')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Practice Options
              </button>

              {practiceWords.length > 0 ? (
                <FlashcardDeck words={practiceWords} onComplete={handleCompletePractice} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    No words available
                  </h2>
                  <p className="text-zinc-400 mb-4">
                    Try a different practice mode or category
                  </p>
                  <button
                    onClick={() => setView('selection')}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
                  >
                    Back to Practice Options
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {view === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VocabularyList onAddWord={() => setIsAddModalOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Session Summary Modal */}
        {showSessionSummary && currentSession && (
          <SessionSummaryModal
            session={currentSession}
            onClose={handleCloseSummary}
          />
        )}

        {/* Add Word Modal */}
        <AddWordModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: number
  color: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg text-white`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-white/80">{label}</div>
    </motion.div>
  )
}

function PracticeModeCard({
  icon,
  title,
  description,
  count,
  gradient,
  onClick,
  disabled,
}: {
  icon: string
  title: string
  description: string
  count: number
  gradient: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-left transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-zinc-600 hover:bg-zinc-800'
      }`}
    >
      <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-4`}>
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">{count} words</span>
        {!disabled && (
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            Start
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        )}
      </div>
    </motion.button>
  )
}

function SessionSummaryModal({
  session,
  onClose,
}: {
  session: { wordsReviewed: number; correctAnswers: number; incorrectAnswers: number; xpEarned: number }
  onClose: () => void
}) {
  const accuracy = session.wordsReviewed > 0
    ? Math.round((session.correctAnswers / session.wordsReviewed) * 100)
    : 0

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Session Complete!
        </h2>
        <p className="text-zinc-400 mb-6">Great job practicing!</p>

        <div className="grid grid-cols-2 mb-6" style={{ gap: '1rem' }}>
          <div className="bg-blue-500/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-400">
              {session.wordsReviewed}
            </div>
            <div className="text-sm text-zinc-400">Words Reviewed</div>
          </div>

          <div className="bg-green-500/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400">
              {accuracy}%
            </div>
            <div className="text-sm text-zinc-400">Accuracy</div>
          </div>

          <div className="bg-purple-500/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-400">
              +{session.xpEarned}
            </div>
            <div className="text-sm text-zinc-400">XP Earned</div>
          </div>

          <div className="bg-yellow-500/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-yellow-400">
              {session.correctAnswers}/{session.wordsReviewed}
            </div>
            <div className="text-sm text-zinc-400">Correct</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          Continue
        </button>
      </motion.div>
    </div>
  )
}
