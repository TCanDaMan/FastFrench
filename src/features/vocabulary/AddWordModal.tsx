import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { VocabularyCategory } from '../../types/vocabulary'
import { CATEGORY_INFO } from '../../types/vocabulary'
import { useVocabularyStore } from './vocabularyStore'

interface AddWordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddWordModal({ isOpen, onClose }: AddWordModalProps) {
  const addWord = useVocabularyStore((state) => state.addWord)
  const [formData, setFormData] = useState({
    french: '',
    english: '',
    phonetic: '',
    category: 'common' as VocabularyCategory,
    exampleSentence: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const newErrors: Record<string, string> = {}
    if (!formData.french.trim()) {
      newErrors.french = 'French word is required'
    }
    if (!formData.english.trim()) {
      newErrors.english = 'English translation is required'
    }
    if (!formData.phonetic.trim()) {
      newErrors.phonetic = 'Phonetic pronunciation is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Add word
    addWord({
      french: formData.french.trim(),
      english: formData.english.trim(),
      phonetic: formData.phonetic.trim(),
      category: formData.category,
      exampleSentence: formData.exampleSentence.trim() || undefined,
    })

    // Reset form
    setFormData({
      french: '',
      english: '',
      phonetic: '',
      category: 'common',
      exampleSentence: '',
    })
    setErrors({})

    // Close modal
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add Custom Word
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* French Word */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      French Word *
                    </label>
                    <input
                      type="text"
                      value={formData.french}
                      onChange={(e) => handleChange('french', e.target.value)}
                      placeholder="e.g., Bonjour"
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                        errors.french ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.french && (
                      <p className="mt-1 text-sm text-red-600">{errors.french}</p>
                    )}
                  </div>

                  {/* English Translation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      English Translation *
                    </label>
                    <input
                      type="text"
                      value={formData.english}
                      onChange={(e) => handleChange('english', e.target.value)}
                      placeholder="e.g., Hello"
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                        errors.english ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.english && (
                      <p className="mt-1 text-sm text-red-600">{errors.english}</p>
                    )}
                  </div>

                  {/* Phonetic */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phonetic (IPA) *
                    </label>
                    <input
                      type="text"
                      value={formData.phonetic}
                      onChange={(e) => handleChange('phonetic', e.target.value)}
                      placeholder="e.g., bɔ̃.ʒuʁ"
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                        errors.phonetic ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.phonetic && (
                      <p className="mt-1 text-sm text-red-600">{errors.phonetic}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Use IPA pronunciation. You can find it on{' '}
                      <a
                        href="https://en.wiktionary.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Wiktionary
                      </a>
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(Object.keys(CATEGORY_INFO) as VocabularyCategory[]).map((category) => {
                        const info = CATEGORY_INFO[category]
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleChange('category', category)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                              formData.category === category
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span>{info.icon}</span>
                            <span className="text-xs">{info.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Example Sentence */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Example Sentence (Optional)
                    </label>
                    <textarea
                      value={formData.exampleSentence}
                      onChange={(e) => handleChange('exampleSentence', e.target.value)}
                      placeholder="e.g., Bonjour, comment allez-vous?"
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      Add Word
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
