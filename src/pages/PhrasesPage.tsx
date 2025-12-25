import { useState } from 'react'
import { Search, SortAsc, Play, Sparkles, Filter } from 'lucide-react'
import { PhraseCategory, CATEGORY_INFO, Phrase } from '../types/phrases'
import { usePhraseStore } from '../features/phrases/phraseStore'
import { SCENARIOS } from '../data/phrases'
import PhraseCard from '../features/phrases/PhraseCard'
import CategoryDetails from '../features/phrases/CategoryDetails'
import PhrasePractice from '../features/phrases/PhrasePractice'
import ScenarioMode from '../features/phrases/ScenarioMode'

type View = 'browse' | 'category-details' | 'practice' | 'scenario'
type SortBy = 'difficulty' | 'alphabetical' | 'most-practiced'

export default function PhrasesPage() {
  const { phrases, getTotalPhrases, getLearnedPhrases, getCategoryProgress } = usePhraseStore()

  const [view, setView] = useState<View>('browse')
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | null>(null)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('difficulty')
  const [filterCategory, setFilterCategory] = useState<PhraseCategory | 'all'>('all')

  // Filter and sort phrases
  const getFilteredPhrases = (): Phrase[] => {
    let filtered = [...phrases]

    if (filterCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === filterCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.french.toLowerCase().includes(query) ||
          p.english.toLowerCase().includes(query) ||
          p.phonetic.toLowerCase().includes(query)
      )
    }

    if (sortBy === 'difficulty') {
      filtered.sort((a, b) => a.difficulty - b.difficulty)
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.french.localeCompare(b.french))
    }

    return filtered
  }

  const filteredPhrases = getFilteredPhrases()
  const categories = Object.keys(CATEGORY_INFO) as PhraseCategory[]

  // Handle navigation
  const handleCategoryClick = (category: PhraseCategory) => {
    setSelectedCategory(category)
    setView('category-details')
  }

  const handleStartPractice = (category?: PhraseCategory) => {
    setSelectedCategory(category || null)
    setView('practice')
  }

  const handleStartScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId)
    setView('scenario')
  }

  const handleBackToBrowse = () => {
    setView('browse')
    setSelectedCategory(null)
    setSelectedScenarioId(null)
  }

  // Render different views
  if (view === 'category-details' && selectedCategory) {
    return (
      <CategoryDetails
        category={selectedCategory}
        onBack={handleBackToBrowse}
        onStartPractice={() => handleStartPractice(selectedCategory)}
      />
    )
  }

  if (view === 'practice') {
    return (
      <PhrasePractice category={selectedCategory || undefined} onComplete={handleBackToBrowse} />
    )
  }

  if (view === 'scenario' && selectedScenarioId) {
    return (
      <ScenarioMode
        scenarioId={selectedScenarioId}
        onComplete={handleBackToBrowse}
        onBack={handleBackToBrowse}
      />
    )
  }

  // Main browse view
  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 lg:top-14 z-10">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-text-primary text-2xl font-bold">Phrase Library</h1>
              <p className="text-text-muted text-sm mt-0.5">
                {getLearnedPhrases()} of {getTotalPhrases()} phrases learned
              </p>
            </div>
            <button
              onClick={() => handleStartPractice()}
              className="btn btn-primary btn-md"
            >
              <Play className="w-4 h-4" />
              Practice
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search phrases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border rounded-lg text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-muted" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as PhraseCategory | 'all')}
                className="text-sm bg-elevated border border-border rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_INFO[cat].emoji} {CATEGORY_INFO[cat].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="text-sm bg-elevated border border-border rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary"
              >
                <option value="difficulty">By Difficulty</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="most-practiced">Most Practiced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Category Grid */}
        <h2 className="text-text-primary font-semibold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {categories.map((category) => {
            const info = CATEGORY_INFO[category]
            const progress = getCategoryProgress(category)
            const progressPercent = progress.total > 0 ? (progress.learned / progress.total) * 100 : 0

            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="card p-4 text-center hover:border-border-hover transition-all"
              >
                <div className="text-2xl mb-2">{info.emoji}</div>
                <div className="text-sm font-medium text-text-primary mb-1">{info.name}</div>
                <div className="text-xs text-text-muted mb-3">
                  {progress.learned}/{progress.total}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill progress-fill-primary"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Scenarios */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <h2 className="text-text-primary font-semibold">Practice Scenarios</h2>
          </div>
          <p className="text-text-muted text-sm mb-4">
            Real-world situations to test your French skills
          </p>

          <div className="grid gap-4">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleStartScenario(scenario.id)}
                className="card p-5 text-left hover:border-border-hover transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{scenario.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-text-primary font-semibold mb-1">{scenario.title}</h3>
                    <p className="text-text-muted text-sm mb-3">{scenario.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary">
                        {scenario.phraseIds.length} phrases
                      </span>
                      <span className="badge">
                        Level {scenario.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* All Phrases */}
        <div>
          <h2 className="text-text-primary font-semibold mb-4">
            {searchQuery ? 'Search Results' : 'All Phrases'}
            <span className="text-text-muted font-normal ml-2">({filteredPhrases.length})</span>
          </h2>

          {filteredPhrases.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-text-muted">No phrases found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPhrases.map((phrase) => (
                <PhraseCard key={phrase.id} phrase={phrase} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
