/**
 * Audio Player Component
 * Beautiful audio button with play/pause toggle and speed control
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTTS } from '../hooks/useTTS'

export interface AudioPlayerProps {
  text: string
  lang?: 'fr-FR' | 'en-US'
  variant?: 'default' | 'compact' | 'minimal'
  showSpeedControl?: boolean
  showRepeat?: boolean
  autoFocus?: boolean
  className?: string
  onPlayStart?: () => void
  onPlayEnd?: () => void
}

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5, emoji: '🐢' },
  { label: '0.75x', value: 0.75, emoji: '🚶' },
  { label: '1x', value: 1.0, emoji: '🏃' },
  { label: '1.25x', value: 1.25, emoji: '🚀' },
]

export function AudioPlayer({
  text,
  lang = 'fr-FR',
  variant = 'default',
  showSpeedControl = false,
  showRepeat = false,
  className = '',
  onPlayStart,
  onPlayEnd,
}: AudioPlayerProps) {
  const { speak, stop, speaking, loading, supported } = useTTS({ lang })
  const [speed, setSpeed] = useState(1.0)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  const handlePlay = async () => {
    if (speaking) {
      stop()
      onPlayEnd?.()
    } else {
      onPlayStart?.()
      try {
        await speak(text, {
          rate: speed,
          onEnd: () => {
            onPlayEnd?.()
          },
        })
      } catch (error) {
        console.error('TTS Error:', error)
        onPlayEnd?.()
      }
    }
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    setShowSpeedMenu(false)
    // If currently playing, restart with new speed
    if (speaking) {
      stop()
      setTimeout(() => {
        speak(text, { rate: newSpeed })
      }, 100)
    }
  }

  if (!supported) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Audio not supported in this browser
      </div>
    )
  }

  // Minimal variant - just an icon button
  if (variant === 'minimal') {
    return (
      <button
        onClick={handlePlay}
        disabled={loading}
        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
          speaking
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        } ${className}`}
        aria-label={speaking ? 'Stop audio' : 'Play audio'}
      >
        <svg
          className={`w-4 h-4 ${speaking ? 'animate-pulse' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {speaking ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          )}
        </svg>
      </button>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <motion.button
          onClick={handlePlay}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            speaking
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
          }`}
        >
          <svg
            className={`w-5 h-5 ${speaking ? 'animate-pulse' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {speaking ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
          <span className="text-sm font-medium">{speaking ? 'Stop' : 'Play'}</span>
        </motion.button>

        {showSpeedControl && (
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              {speed}x
            </button>

            <AnimatePresence>
              {showSpeedMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10"
                >
                  {SPEED_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSpeedChange(option.value)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                        speed === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      <span>{option.emoji}</span>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    )
  }

  // Default variant - full featured
  return (
    <div className={`${className}`}>
      <motion.button
        onClick={handlePlay}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 shadow-lg ${
          speaking
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/50'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Play/Pause Icon */}
        <div className="relative">
          <svg
            className={`w-8 h-8 ${speaking ? 'animate-pulse' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {speaking ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>

          {/* Loading indicator */}
          {loading && (
            <motion.div
              className="absolute inset-0 border-2 border-blue-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col items-start">
          <span className="text-lg font-semibold">{speaking ? 'Playing...' : 'Listen'}</span>
          {speed !== 1.0 && (
            <span className="text-xs opacity-75">{speed}x speed</span>
          )}
        </div>

        {/* Waveform animation when playing */}
        {speaking && (
          <div className="flex items-center gap-1 ml-auto">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{
                  height: ['8px', '20px', '8px'],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </motion.button>

      {/* Speed Control */}
      {showSpeedControl && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
          <div className="flex gap-1">
            {SPEED_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSpeedChange(option.value)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  speed === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title={option.label}
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Repeat Button */}
      {showRepeat && !speaking && (
        <motion.button
          onClick={handlePlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Repeat
        </motion.button>
      )}
    </div>
  )
}
