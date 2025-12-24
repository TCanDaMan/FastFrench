import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { PhraseCategory, CATEGORY_INFO } from '../../types/phrases';
import { usePhraseStore } from './phraseStore';
import PhraseCard from './PhraseCard';

interface CategoryDetailsProps {
  category: PhraseCategory;
  onBack: () => void;
  onStartPractice: () => void;
}

export default function CategoryDetails({
  category,
  onBack,
  onStartPractice,
}: CategoryDetailsProps) {
  const { getPhrasesByCategory, getCategoryProgress } = usePhraseStore();

  const categoryInfo = CATEGORY_INFO[category];
  const phrases = getPhrasesByCategory(category);
  const progress = getCategoryProgress(category);
  const progressPercent = progress.total > 0 ? (progress.learned / progress.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 pb-20"
    >
      {/* Header */}
      <div className={`${categoryInfo.bgColor} border-b border-gray-200`}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to All Phrases</span>
          </button>

          <div className="flex items-start gap-4">
            <div className="text-5xl">{categoryInfo.emoji}</div>
            <div className="flex-1">
              <h1 className={`text-3xl font-bold ${categoryInfo.color} mb-2`}>
                {categoryInfo.name}
              </h1>
              <p className="text-gray-700 text-sm">{categoryInfo.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {progress.learned} of {progress.total} learned
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full ${
                  categoryInfo.color === 'text-blue-600'
                    ? 'bg-blue-500'
                    : categoryInfo.color === 'text-purple-600'
                    ? 'bg-purple-500'
                    : categoryInfo.color === 'text-amber-600'
                    ? 'bg-amber-500'
                    : categoryInfo.color === 'text-green-600'
                    ? 'bg-green-500'
                    : categoryInfo.color === 'text-indigo-600'
                    ? 'bg-indigo-500'
                    : categoryInfo.color === 'text-pink-600'
                    ? 'bg-pink-500'
                    : categoryInfo.color === 'text-teal-600'
                    ? 'bg-teal-500'
                    : categoryInfo.color === 'text-red-600'
                    ? 'bg-red-500'
                    : categoryInfo.color === 'text-orange-600'
                    ? 'bg-orange-500'
                    : 'bg-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary-900">{progress.total}</div>
              <div className="text-xs text-gray-600">Total Phrases</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{progress.learned}</div>
              <div className="text-xs text-gray-600">Learned</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.practiced}</div>
              <div className="text-xs text-gray-600">Practiced</div>
            </div>
          </div>

          {/* Practice Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartPractice}
            className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Play className="w-5 h-5" />
            Practice This Category
          </motion.button>
        </div>
      </div>

      {/* Phrase List */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Phrases</h2>

        <div className="space-y-4">
          {phrases.map((phrase, index) => (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PhraseCard phrase={phrase} showCategory={false} />
            </motion.div>
          ))}
        </div>

        {phrases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No phrases in this category yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
