import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SortAsc, Play, Sparkles, Filter } from 'lucide-react';
import { PhraseCategory, CATEGORY_INFO, Phrase } from '../types/phrases';
import { usePhraseStore } from '../features/phrases/phraseStore';
import { SCENARIOS } from '../data/phrases';
import PhraseCard from '../features/phrases/PhraseCard';
import CategoryDetails from '../features/phrases/CategoryDetails';
import PhrasePractice from '../features/phrases/PhrasePractice';
import ScenarioMode from '../features/phrases/ScenarioMode';

type View = 'browse' | 'category-details' | 'practice' | 'scenario';
type SortBy = 'difficulty' | 'alphabetical' | 'most-practiced';

// Color mapping for progress bars
const PROGRESS_BAR_COLORS: Record<string, string> = {
  'text-blue-600': 'bg-blue-500',
  'text-purple-600': 'bg-purple-500',
  'text-amber-600': 'bg-amber-500',
  'text-green-600': 'bg-green-500',
  'text-indigo-600': 'bg-indigo-500',
  'text-pink-600': 'bg-pink-500',
  'text-teal-600': 'bg-teal-500',
  'text-red-600': 'bg-red-500',
  'text-orange-600': 'bg-orange-500',
};

export default function PhrasesPage() {
  const { phrases, getTotalPhrases, getLearnedPhrases, getCategoryProgress } = usePhraseStore();

  const [view, setView] = useState<View>('browse');
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('difficulty');
  const [filterCategory, setFilterCategory] = useState<PhraseCategory | 'all'>('all');

  // Filter and sort phrases
  const getFilteredPhrases = (): Phrase[] => {
    let filtered = [...phrases];

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.french.toLowerCase().includes(query) ||
          p.english.toLowerCase().includes(query) ||
          p.phonetic.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'difficulty') {
      filtered.sort((a, b) => a.difficulty - b.difficulty);
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.french.localeCompare(b.french));
    } else if (sortBy === 'most-practiced') {
      // Would need access to progress - for now, just difficulty
      filtered.sort((a, b) => a.difficulty - b.difficulty);
    }

    return filtered;
  };

  const filteredPhrases = getFilteredPhrases();
  const categories = Object.keys(CATEGORY_INFO) as PhraseCategory[];

  // Handle navigation
  const handleCategoryClick = (category: PhraseCategory) => {
    setSelectedCategory(category);
    setView('category-details');
  };

  const handleStartPractice = (category?: PhraseCategory) => {
    setSelectedCategory(category || null);
    setView('practice');
  };

  const handleStartScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setView('scenario');
  };

  const handleBackToBrowse = () => {
    setView('browse');
    setSelectedCategory(null);
    setSelectedScenarioId(null);
  };

  // Render different views
  if (view === 'category-details' && selectedCategory) {
    return (
      <CategoryDetails
        category={selectedCategory}
        onBack={handleBackToBrowse}
        onStartPractice={() => handleStartPractice(selectedCategory)}
      />
    );
  }

  if (view === 'practice') {
    return (
      <PhrasePractice category={selectedCategory || undefined} onComplete={handleBackToBrowse} />
    );
  }

  if (view === 'scenario' && selectedScenarioId) {
    return (
      <ScenarioMode
        scenarioId={selectedScenarioId}
        onComplete={handleBackToBrowse}
        onBack={handleBackToBrowse}
      />
    );
  }

  // Main browse view
  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 lg:top-16 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '72rem', marginInline: 'auto' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Phrase Library</h1>
              <p className="text-sm text-zinc-400 mt-1">
                {getLearnedPhrases()} of {getTotalPhrases()} phrases learned
              </p>
            </div>
            <button
              onClick={() => handleStartPractice()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Practice All
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search phrases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter and Sort */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-2.5">
              <Filter className="w-5 h-5 text-zinc-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as PhraseCategory | 'all')}
                className="text-sm border border-zinc-700 rounded-xl px-4 py-2.5 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_INFO[cat].emoji} {CATEGORY_INFO[cat].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <SortAsc className="w-5 h-5 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="text-sm border border-zinc-700 rounded-xl px-4 py-2.5 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      <div className="px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '72rem', marginInline: 'auto' }}>
        {/* Category Pills */}
        <h2 className="text-xl font-bold text-white mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-10" style={{ gap: '1.25rem' }}>
          {categories.map((category) => {
            const info = CATEGORY_INFO[category];
            const progress = getCategoryProgress(category);
            const progressPercent =
              progress.total > 0 ? (progress.learned / progress.total) * 100 : 0;

            return (
              <motion.button
                key={category}
                onClick={() => handleCategoryClick(category)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-5 text-center hover:border-zinc-600 hover:bg-zinc-800/50 transition-all overflow-visible shadow-md shadow-black/10"
              >
                <div className="text-3xl mb-3">{info.emoji}</div>
                <div className="text-base font-semibold text-white mb-1.5">{info.name}</div>
                <div className="text-sm text-zinc-500">
                  {progress.learned}/{progress.total}
                </div>
                {/* Mini progress bar */}
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-4">
                  <div
                    className={`h-full rounded-full ${PROGRESS_BAR_COLORS[info.color] || 'bg-indigo-500'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Scenarios Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Practice Scenarios</h2>
          </div>
          <p className="text-base text-zinc-400 mb-5">
            Real-world situations to test your French skills
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1.5rem' }}>
            {SCENARIOS.map((scenario) => (
              <motion.button
                key={scenario.id}
                onClick={() => handleStartScenario(scenario.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-zinc-900 rounded-xl p-6 text-left hover:bg-zinc-800 transition-all border border-zinc-700 shadow-lg shadow-black/20"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{scenario.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1.5">{scenario.title}</h3>
                    <p className="text-sm text-zinc-400 mb-3">{scenario.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg">
                        {scenario.phraseIds.length} phrases
                      </span>
                      <span className="text-sm bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg">
                        Level {scenario.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* All Phrases List */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            {searchQuery ? 'Search Results' : 'All Phrases'}{' '}
            <span className="text-zinc-500 font-normal">({filteredPhrases.length})</span>
          </h2>

          {filteredPhrases.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p>No phrases found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5rem' }}>
              <AnimatePresence>
                {filteredPhrases.map((phrase, index) => (
                  <motion.div
                    key={phrase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <PhraseCard phrase={phrase} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
