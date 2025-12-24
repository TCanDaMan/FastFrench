import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowRight, CheckCircle, XCircle, Award, RotateCcw, Sparkles } from 'lucide-react';
import { Scenario, Phrase } from '../../types/phrases';
import { SCENARIOS } from '../../data/phrases';
import { usePhraseStore } from './phraseStore';

interface ScenarioModeProps {
  scenarioId?: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function ScenarioMode({ scenarioId, onComplete, onBack }: ScenarioModeProps) {
  const { getPhraseById, recordPractice } = usePhraseStore();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (scenarioId) {
      const found = SCENARIOS.find((s) => s.id === scenarioId);
      setScenario(found || null);
    }
  }, [scenarioId]);

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <p className="text-gray-600">Loading scenario...</p>
      </div>
    );
  }

  const currentPhraseId = scenario.phraseIds[currentStep];
  const currentPhrase = getPhraseById(currentPhraseId);
  const allPhrases = scenario.phraseIds.map((id) => getPhraseById(id)).filter((p): p is Phrase => p !== undefined);

  // Generate wrong options
  const getOptions = (): Phrase[] => {
    if (!currentPhrase) return [];

    // Get other phrases from the scenario as options
    const otherPhrases = allPhrases.filter((p) => p.id !== currentPhrase.id);

    // Shuffle and take 2 wrong answers + the correct one
    const shuffled = [...otherPhrases].sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [...shuffled, currentPhrase].sort(() => Math.random() - 0.5);

    return options;
  };

  const [options] = useState(getOptions());

  const handleSelectPhrase = (phraseId: string) => {
    if (isCorrect !== null) return; // Already answered

    setSelectedPhraseId(phraseId);
    const correct = phraseId === currentPhraseId;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      recordPractice(phraseId, true);
    } else {
      recordPractice(phraseId, false);
    }
  };

  const handleNext = () => {
    if (currentStep < scenario.phraseIds.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedPhraseId(null);
      setIsCorrect(null);
    } else {
      setShowSummary(true);
    }
  };

  const handlePlayAudio = (phrase: Phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase.french);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedPhraseId(null);
    setIsCorrect(null);
    setScore(0);
    setShowSummary(false);
  };

  const progress = ((currentStep + 1) / scenario.phraseIds.length) * 100;

  if (showSummary) {
    const accuracy = (score / scenario.phraseIds.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">{scenario.icon}</div>
            <Award className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Scenario Complete!</h2>
            <p className="text-gray-600">{scenario.title}</p>
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

          {/* Score */}
          <div className="mb-6 p-4 bg-primary-50 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-1">Your Score</p>
            <p className="text-3xl font-bold text-primary-900">
              {score} / {scenario.phraseIds.length}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={onComplete}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
            >
              Choose Another Scenario
            </button>
            <button
              onClick={onBack}
              className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm"
            >
              Back to Phrases
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentPhrase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <p className="text-gray-600">Loading phrase...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{scenario.icon}</span>
              <div>
                <h1 className="font-bold text-gray-900">{scenario.title}</h1>
                <p className="text-xs text-gray-600">{scenario.context}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {currentStep + 1}/{scenario.phraseIds.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Situation Prompt */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <p className="text-sm font-medium text-gray-600">Situation</p>
                </div>
                <p className="text-lg text-gray-900 mb-4">You need to say:</p>
                <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
                  <p className="text-xl font-bold text-primary-900 text-center">
                    "{currentPhrase.english}"
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Which French phrase would you use?
                </p>

                {options.map((option) => {
                  const isSelected = selectedPhraseId === option.id;
                  const isCorrectOption = option.id === currentPhraseId;
                  const showResult = isCorrect !== null;

                  let buttonClass = 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200';

                  if (showResult) {
                    if (isSelected && isCorrect) {
                      buttonClass = 'bg-green-100 border-2 border-green-500';
                    } else if (isSelected && !isCorrect) {
                      buttonClass = 'bg-red-100 border-2 border-red-500';
                    } else if (isCorrectOption) {
                      buttonClass = 'bg-green-50 border-2 border-green-300';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectPhrase(option.id)}
                      disabled={isCorrect !== null}
                      className={`w-full p-4 rounded-xl text-left transition-all ${buttonClass} ${
                        isCorrect !== null ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-1">{option.french}</p>
                          <p className="text-sm text-gray-600 font-mono">{option.phonetic}</p>
                        </div>
                        {showResult && isCorrectOption && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 ml-2" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 ml-2" />
                        )}
                        {showResult && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayAudio(option);
                            }}
                            className="ml-2 p-2 hover:bg-white rounded-full transition-colors"
                          >
                            <Volume2 className="w-5 h-5 text-primary-600" />
                          </button>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Result Message */}
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  {isCorrect ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold text-green-900">Correct!</p>
                      <p className="text-sm text-green-700 mt-1">{currentPhrase.usageContext}</p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                      <XCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="font-semibold text-orange-900">Not quite!</p>
                      <p className="text-sm text-orange-700 mt-1">
                        The correct answer is highlighted above.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Next Button */}
              {isCorrect !== null && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleNext}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {currentStep < scenario.phraseIds.length - 1 ? 'Next Phrase' : 'See Results'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
