import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowRight, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { Phrase, PhraseCategory } from '../../types/phrases';
import { usePhraseStore } from './phraseStore';

interface PhrasePracticeProps {
  category?: PhraseCategory;
  phraseIds?: string[];
  onComplete: () => void;
}

type Rating = 'didnt-know' | 'knew-it' | 'easy';

export default function PhrasePractice({
  category,
  phraseIds,
  onComplete,
}: PhrasePracticeProps) {
  const {
    getPhrasesByCategory,
    getPhraseById,
    recordPractice,
    getUnpracticedPhrases,
    startSession,
    endSession,
  } = usePhraseStore();

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [results, setResults] = useState<Record<string, Rating>>({});
  const [sessionId, setSessionId] = useState<string>('');
  const [showSummary, setShowSummary] = useState(false);

  // Initialize practice session
  useEffect(() => {
    let practicePhrases: Phrase[] = [];

    if (phraseIds) {
      // Use specific phrases
      practicePhrases = phraseIds
        .map((id) => getPhraseById(id))
        .filter((p): p is Phrase => p !== undefined);
    } else if (category) {
      // Get unpracticed phrases from category, or all if none unpracticed
      const unpracticed = getUnpracticedPhrases(category);
      if (unpracticed.length > 0) {
        practicePhrases = unpracticed;
      } else {
        practicePhrases = getPhrasesByCategory(category);
      }
    }

    // Shuffle phrases
    const shuffled = [...practicePhrases].sort(() => Math.random() - 0.5);
    setPhrases(shuffled);

    // Start session
    const id = startSession(category);
    setSessionId(id);
  }, [category, phraseIds]);

  const currentPhrase = phrases[currentIndex];
  const progress = ((currentIndex + (isRevealed ? 1 : 0)) / phrases.length) * 100;

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleRating = (rating: Rating) => {
    if (!currentPhrase) return;

    // Record practice
    const correct = rating !== 'didnt-know';
    recordPractice(currentPhrase.id, correct);

    // Store result
    setResults((prev) => ({
      ...prev,
      [currentPhrase.id]: rating,
    }));

    // Move to next or show summary
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      // End session
      const correctCount = Object.values({
        ...results,
        [currentPhrase.id]: rating,
      }).filter((r) => r !== 'didnt-know').length;

      endSession(sessionId, correctCount, phrases.length);
      setShowSummary(true);
    }
  };

  const handlePlayAudio = () => {
    if (!currentPhrase) return;
    const utterance = new SpeechSynthesisUtterance(currentPhrase.french);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setResults({});
    setShowSummary(false);
    const id = startSession(category);
    setSessionId(id);
  };

  if (phrases.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading practice session...</p>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const correctCount = Object.values(results).filter((r) => r !== 'didnt-know').length;
    const easyCount = Object.values(results).filter((r) => r === 'easy').length;
    const knewCount = Object.values(results).filter((r) => r === 'knew-it').length;
    const didntKnowCount = Object.values(results).filter((r) => r === 'didnt-know').length;
    const accuracy = (correctCount / phrases.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <Award className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Great Work!</h2>
            <p className="text-gray-600">Practice session complete</p>
          </div>

          {/* Accuracy Circle */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - accuracy / 100)}`}
                className="text-green-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{Math.round(accuracy)}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Easy</span>
              <span className="text-lg font-bold text-green-600">{easyCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Knew It</span>
              <span className="text-lg font-bold text-blue-600">{knewCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Didn't Know</span>
              <span className="text-lg font-bold text-orange-600">{didntKnowCount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Practice Again
            </button>
            <button
              onClick={onComplete}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentIndex + 1} of {phrases.length}
            </span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Practice Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhrase.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* English Prompt */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 mb-2">How would you say:</p>
                <h2 className="text-2xl font-bold text-gray-900">{currentPhrase.english}</h2>
              </div>

              {/* French Answer (revealed) */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 text-center">
                      <h3 className="text-3xl font-bold text-primary-900 mb-3">
                        {currentPhrase.french}
                      </h3>
                      <p className="text-gray-600 font-mono mb-4">{currentPhrase.phonetic}</p>
                      <button
                        onClick={handlePlayAudio}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
                      >
                        <Volume2 className="w-5 h-5" />
                        Listen
                      </button>
                    </div>

                    {/* Usage Context */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{currentPhrase.usageContext}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              {!isRevealed ? (
                <button
                  onClick={handleReveal}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  Show Answer
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-center text-sm text-gray-600 mb-2">How well did you know it?</p>
                  <button
                    onClick={() => handleRating('easy')}
                    className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Easy
                  </button>
                  <button
                    onClick={() => handleRating('knew-it')}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Knew It
                  </button>
                  <button
                    onClick={() => handleRating('didnt-know')}
                    className="w-full bg-orange-100 hover:bg-orange-200 text-orange-800 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Didn't Know
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
