import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCw, Check, Star } from 'lucide-react';
import { Phrase, CATEGORY_INFO } from '../../types/phrases';
import { usePhraseStore } from './phraseStore';

interface PhraseCardProps {
  phrase: Phrase;
  showCategory?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export default function PhraseCard({
  phrase,
  showCategory = true,
  compact = false,
  onClick,
}: PhraseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { getProgress, markAsLearned, markAsUnlearned } = usePhraseStore();

  const progress = getProgress(phrase.id);
  const categoryInfo = CATEGORY_INFO[phrase.category];

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use Web Speech API for French pronunciation
    const utterance = new SpeechSynthesisUtterance(phrase.french);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85; // Slightly slower for learners
    speechSynthesis.speak(utterance);
  };

  const handleToggleLearned = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (progress?.isLearned) {
      markAsUnlearned(phrase.id);
    } else {
      markAsLearned(phrase.id);
    }
  };

  const handleFlip = () => {
    if (!onClick) {
      setIsFlipped(!isFlipped);
    }
  };

  const cardContent = (
    <div
      className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
        compact ? 'p-4' : 'p-6'
      }`}
      onClick={onClick || handleFlip}
    >
      {/* Category Badge */}
      {showCategory && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="text-xl">{categoryInfo.emoji}</span>
          {!compact && (
            <span className={`text-xs font-semibold ${categoryInfo.color}`}>
              {categoryInfo.name}
            </span>
          )}
        </div>
      )}

      {/* Difficulty Stars */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < phrase.difficulty
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            transition={{ duration: 0.2 }}
          >
            {/* French Phrase */}
            <h3 className={`font-bold text-primary-900 mb-2 ${compact ? 'text-xl' : 'text-2xl'}`}>
              {phrase.french}
            </h3>

            {/* English Translation */}
            <p className={`text-gray-600 mb-3 ${compact ? 'text-sm' : 'text-base'}`}>
              {phrase.english}
            </p>

            {/* Phonetic */}
            <div className={`flex items-center gap-2 mb-4 ${compact ? 'text-xs' : 'text-sm'}`}>
              <span className="text-gray-500 font-mono">{phrase.phonetic}</span>
              <button
                onClick={handlePlayAudio}
                className="p-1.5 hover:bg-primary-100 rounded-full transition-colors"
                aria-label="Play pronunciation"
              >
                <Volume2 className="w-4 h-4 text-primary-600" />
              </button>
            </div>

            {!compact && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {/* Practice Count */}
                {progress && progress.practiced > 0 && (
                  <span className="text-xs text-gray-500">
                    Practiced {progress.practiced}x
                  </span>
                )}

                {/* Flip Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  More info
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Back of card - detailed info */}
            <h4 className="font-semibold text-lg text-primary-900 mb-3">Usage Context</h4>
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {phrase.usageContext}
            </p>

            {/* Comfort Level */}
            {progress && (
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-1">Your Comfort Level</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded ${
                        progress.comfortLevel >= level ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Mark as Learned */}
            <button
              onClick={handleToggleLearned}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                progress?.isLearned
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Check className="w-4 h-4 inline mr-2" />
              {progress?.isLearned ? 'Learned!' : 'Mark as Learned'}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="mt-3 w-full text-xs text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1"
            >
              <RotateCw className="w-3 h-3" />
              Back to phrase
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return cardContent;
}
