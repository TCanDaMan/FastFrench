/**
 * Voice Selector Component
 * Allows users to select their preferred French TTS voice
 */

import { motion } from 'framer-motion'
import { useVoiceSelection } from '../hooks/useTTS'
import { Modal } from './Modal'

export interface VoiceSelectorProps {
  onVoiceChange?: (voiceName: string) => void
}

export function VoiceSelector({ onVoiceChange }: VoiceSelectorProps) {
  const {
    frenchVoices,
    selectedVoice,
    selectVoice,
    speaking,
    isOpen,
    setIsOpen,
    loading,
    supported,
  } = useVoiceSelection()

  const handleSelectVoice = async (voiceName: string) => {
    await selectVoice(voiceName)
    onVoiceChange?.(voiceName)
  }

  if (!supported) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Text-to-speech not supported in this browser
      </div>
    )
  }

  const selectedVoiceInfo = frenchVoices.find((v) => v.voice.name === selectedVoice)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all w-full"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎤</div>
          <div className="text-left">
            <div className="text-sm text-gray-600 dark:text-gray-400">French Voice</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {selectedVoiceInfo ? selectedVoiceInfo.name : 'Select a voice'}
            </div>
            {selectedVoiceInfo && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {selectedVoiceInfo.gender === 'female' && '👩'}
                {selectedVoiceInfo.gender === 'male' && '👨'}
                {' '}
                Quality: {selectedVoiceInfo.priority >= 90 ? 'Excellent' : selectedVoiceInfo.priority >= 70 ? 'Good' : 'Fair'}
              </div>
            )}
          </div>
        </div>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select French Voice"
      >
        <div className="space-y-3">
          {loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading voices...
            </div>
          )}

          {!loading && frenchVoices.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No French voices found. Please check your browser settings.
            </div>
          )}

          {frenchVoices.map((voiceInfo) => (
            <motion.button
              key={voiceInfo.voice.name}
              onClick={() => handleSelectVoice(voiceInfo.voice.name)}
              disabled={speaking}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedVoice === voiceInfo.voice.name
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
              } ${speaking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      {voiceInfo.gender === 'female' && '👩'}
                      {voiceInfo.gender === 'male' && '👨'}
                      {voiceInfo.gender === 'unknown' && '🗣️'}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {voiceInfo.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>{voiceInfo.voice.lang}</span>
                    <span>•</span>
                    <span>
                      {voiceInfo.priority >= 90 && '⭐⭐⭐ Excellent'}
                      {voiceInfo.priority >= 70 && voiceInfo.priority < 90 && '⭐⭐ Good'}
                      {voiceInfo.priority < 70 && '⭐ Fair'}
                    </span>
                  </div>

                  {voiceInfo.voice.localService && (
                    <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                      ✓ Offline available
                    </div>
                  )}
                </div>

                {selectedVoice === voiceInfo.voice.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-blue-500"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}

          {frenchVoices.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 dark:text-blue-400 mt-0.5">💡</div>
                <div className="flex-1 text-sm text-blue-900 dark:text-blue-300">
                  <div className="font-semibold mb-1">Tip</div>
                  Click a voice to hear a preview. Female voices are often clearer for learning
                  French pronunciation.
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

/**
 * Compact voice selector for settings
 */
export function VoiceSelectorCompact({ onVoiceChange }: VoiceSelectorProps) {
  const { frenchVoices, selectedVoice, speak, loading } = useVoiceSelection()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = e.target.value
    onVoiceChange?.(voiceName)

    // Preview the voice
    if (voiceName) {
      await speak('Bonjour', { voice: voiceName })
    }
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        French Voice
      </label>
      <select
        value={selectedVoice || ''}
        onChange={handleChange}
        disabled={loading}
        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
      >
        {loading && <option>Loading voices...</option>}
        {!loading && frenchVoices.length === 0 && <option>No voices available</option>}
        {frenchVoices.map((voiceInfo) => (
          <option key={voiceInfo.voice.name} value={voiceInfo.voice.name}>
            {voiceInfo.name}
            {' - '}
            {voiceInfo.priority >= 90 ? 'Excellent' : voiceInfo.priority >= 70 ? 'Good' : 'Fair'}
            {' '}
            ({voiceInfo.gender})
          </option>
        ))}
      </select>
    </div>
  )
}
