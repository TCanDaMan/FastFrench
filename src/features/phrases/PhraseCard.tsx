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
      className={`relative bg-zinc-900 border border-zinc-700 rounded-2xl hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer ${
        compact ? 'p-4' : 'p-5'
      }`}
      onClick={onClick || handleFlip}
    >
      {/* Category Badge */}
      {showCategory && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="text-lg leading-none">{categoryInfo.emoji}</span>
          {!compact && (
            <span className="text-xs font-semibold text-indigo-400">
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
            className={`w-3.5 h-3.5 ${
              i < phrase.difficulty
                ? 'fill-amber-400 text-amber-400'
                : 'fill-zinc-700 text-zinc-700'
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
            <h3 className={`font-bold text-indigo-400 mb-2 tracking-wide ${compact ? 'text-xl' : 'text-2xl'}`}>
              {phrase.french}
            </h3>

            {/* English Translation */}
            <p className={`text-zinc-300 mb-4 ${compact ? 'text-sm' : 'text-base'}`}>
              {phrase.english}
            </p>

            {/* Phonetic */}
            <div className={`flex items-center gap-3 ${compact ? 'mb-3' : 'mb-4'}`}>
              <span className="font-ipa text-zinc-500 text-sm bg-zinc-800/70 px-2.5 py-1 rounded-md">
                {phrase.phonetic}
              </span>
              <button
                onClick={handlePlayAudio}
                className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                aria-label="Play pronunciation"
              >
                <Volume2 className="w-4 h-4 text-indigo-400" />
              </button>
            </div>

            {!compact && (
              <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
                {/* Practice Count */}
                {progress && progress.practiced > 0 ? (
                  <span className="text-xs text-zinc-500">
                    Practiced {progress.practiced}x
                  </span>
                ) : (
                  <span></span>
                )}

                {/* Flip Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
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
            <h4 className="font-semibold text-lg text-white mb-3">Usage Context</h4>
            <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
              {phrase.usageContext}
            </p>

            {/* Comfort Level */}
            {progress && (
              <div className="mb-4">
                <p className="text-xs text-zinc-400 mb-2">Your Comfort Level</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded ${
                        progress.comfortLevel >= level ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Mark as Learned */}
            <button
              onClick={handleToggleLearned}
              className={`w-full py-2.5 px-4 rounded-xl font-medium transition-colors ${
                progress?.isLearned
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
              className="mt-3 w-full text-sm text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              Back to phrase
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return cardContent;
}
