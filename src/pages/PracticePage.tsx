import { useState, useEffect } from 'react'
import { BookOpen, Clock, Star, CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react'
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
    <div className="min-h-screen bg-base">
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24 lg:pt-24">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-text-primary text-2xl font-bold mb-1">Practice</h1>
          <p className="text-text-muted text-sm">Master French vocabulary with spaced repetition</p>
        </div>

        {/* View Toggle */}
        <div className="segmented-control mb-6">
          <button
            onClick={() => setView('selection')}
            className={`segmented-control-item ${view === 'selection' || view === 'practice' ? 'segmented-control-item-active' : ''}`}
          >
            Practice
          </button>
          <button
            onClick={() => setView('browse')}
            className={`segmented-control-item ${view === 'browse' ? 'segmented-control-item-active' : ''}`}
          >
            Browse
          </button>
        </div>

        {view === 'selection' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard icon={BookOpen} iconColor="text-primary" value={stats.totalWords} label="Total Words" />
              <StatCard icon={Clock} iconColor="text-danger" value={stats.dueWords} label="Due for Review" />
              <StatCard icon={Star} iconColor="text-gold" value={stats.masteredWords} label="Mastered" />
              <StatCard icon={CheckCircle} iconColor="text-success" value={stats.reviewedToday} label="Reviewed Today" />
            </div>

            {/* Practice Options */}
            <div className="grid gap-4 mb-6">
              <PracticeModeCard
                title="Review Due Words"
                description="Practice words that are due for review"
                count={stats.dueWords}
                onClick={() => handleStartPractice('review')}
                disabled={stats.dueWords === 0}
              />
              <PracticeModeCard
                title="Learn New Words"
                description="Add 10 new words to your vocabulary"
                count={Math.min(stats.newWords, 10)}
                onClick={() => handleStartPractice('new')}
                disabled={stats.newWords === 0}
              />
            </div>

            {/* Category Grid */}
            <div className="card p-5">
              <h2 className="text-text-primary font-semibold mb-4">Practice by Category</h2>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(CATEGORY_INFO) as VocabularyCategory[]).map((category) => {
                  const info = CATEGORY_INFO[category]
                  const categoryWords = getWordsByCategory(category)
                  return (
                    <button
                      key={category}
                      onClick={() => handleStartPractice('category', category)}
                      disabled={categoryWords.length === 0}
                      className={`p-4 rounded-xl text-center transition-all border ${
                        categoryWords.length === 0
                          ? 'bg-elevated border-border opacity-50 cursor-not-allowed'
                          : 'bg-surface border-border hover:border-border-hover'
                      }`}
                    >
                      <div className="text-2xl mb-2">{info.icon}</div>
                      <div className="text-xs font-medium text-text-primary mb-0.5">{info.name}</div>
                      <div className="text-xs text-text-muted">{categoryWords.length}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {view === 'practice' && (
          <>
            {/* Back Button */}
            <button
              onClick={() => setView('selection')}
              className="flex items-center gap-1.5 text-text-muted hover:text-text-secondary mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back to Practice Options</span>
            </button>

            {practiceWords.length > 0 ? (
              <FlashcardDeck words={practiceWords} onComplete={handleCompletePractice} />
            ) : (
              <div className="card p-8 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-text-primary text-xl font-bold mb-2">No words available</h2>
                <p className="text-text-muted text-sm mb-6">Try a different practice mode or category</p>
                <button
                  onClick={() => setView('selection')}
                  className="btn btn-primary btn-md"
                >
                  Back to Practice Options
                </button>
              </div>
            )}
          </>
        )}

        {view === 'browse' && (
          <VocabularyList onAddWord={() => setIsAddModalOpen(true)} />
        )}

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
  icon: Icon,
  iconColor,
  value,
  label,
}: {
  icon: React.ElementType
  iconColor: string
  value: number
  label: string
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function PracticeModeCard({
  title,
  description,
  count,
  onClick,
  disabled,
}: {
  title: string
  description: string
  count: number
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`card p-5 text-left transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-border-hover'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-text-primary font-semibold mb-1">{title}</h3>
          <p className="text-text-muted text-sm mb-2">{description}</p>
          <span className="text-text-secondary text-lg font-bold">{count} words</span>
        </div>
        {!disabled && (
          <div className="flex items-center text-primary">
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </div>
    </button>
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
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-surface border border-border rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-text-primary text-xl font-bold mb-1">Session Complete!</h2>
        <p className="text-text-muted text-sm mb-6">Great job practicing!</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">{session.wordsReviewed}</div>
            <div className="text-xs text-text-muted">Words Reviewed</div>
          </div>

          <div className="bg-success/10 border border-success/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-success">{accuracy}%</div>
            <div className="text-xs text-text-muted">Accuracy</div>
          </div>

          <div className="bg-gold/10 border border-gold/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-gold">+{session.xpEarned}</div>
            <div className="text-xs text-text-muted">XP Earned</div>
          </div>

          <div className="bg-elevated border border-border rounded-xl p-4">
            <div className="text-2xl font-bold text-text-primary">{session.correctAnswers}/{session.wordsReviewed}</div>
            <div className="text-xs text-text-muted">Correct</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn btn-primary btn-md"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
