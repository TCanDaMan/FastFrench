/**
 * TTS Usage Examples
 * Comprehensive examples of how to use the TTS system in FastFrench
 */

import { useState } from 'react'
import { useTTS, useSlowTTS, useVoiceSelection } from '../hooks/useTTS'
import { AudioPlayer } from '../components/AudioPlayer'
import { VoiceSelector, VoiceSelectorCompact } from '../components/VoiceSelector'
import {
  getPronunciationTips,
  getDifficultSounds,
  getDifficultyLevel,
  syllabify,
} from '../lib/phonetics'

/**
 * Example 1: Basic TTS Usage
 */
export function BasicTTSExample() {
  const { speak, speaking, stop, supported } = useTTS()

  const handleSpeak = async () => {
    if (speaking) {
      stop()
    } else {
      await speak('Bonjour, comment allez-vous?')
    }
  }

  if (!supported) {
    return <div>TTS not supported</div>
  }

  return (
    <button onClick={handleSpeak}>
      {speaking ? 'Stop' : 'Speak French'}
    </button>
  )
}

/**
 * Example 2: TTS with Speed Control
 */
export function TTSWithSpeedExample() {
  const { speak, speaking } = useTTS()
  const [speed, setSpeed] = useState(1.0)

  const handleSpeak = async () => {
    await speak('Rouge', { rate: speed })
  }

  return (
    <div>
      <button onClick={handleSpeak} disabled={speaking}>
        Speak
      </button>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
      />
      <span>{speed}x</span>
    </div>
  )
}

/**
 * Example 3: Slow TTS for Learning
 */
export function SlowTTSExample() {
  const { speakSlow, speakNormal, speaking, isSlowMode } = useSlowTTS()

  return (
    <div>
      <button onClick={() => speakSlow('Je voudrais un café')}>
        🐢 Slow
      </button>
      <button onClick={() => speakNormal('Je voudrais un café')}>
        🏃 Normal
      </button>
      {speaking && <span>{isSlowMode ? 'Speaking slowly...' : 'Speaking normally...'}</span>}
    </div>
  )
}

/**
 * Example 4: Voice Selection
 */
export function VoiceSelectionExample() {
  const { frenchVoices, selectedVoice, setVoice } = useTTS()

  return (
    <div>
      <h3>Available French Voices:</h3>
      <select
        value={selectedVoice}
        onChange={(e) => setVoice(e.target.value)}
      >
        {frenchVoices.map((v) => (
          <option key={v.voice.name} value={v.voice.name}>
            {v.name} - {v.gender} ({v.priority} priority)
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * Example 5: Using AudioPlayer Component
 */
export function AudioPlayerExample() {
  return (
    <div className="space-y-4">
      {/* Default variant */}
      <AudioPlayer
        text="Bonjour tout le monde!"
        showSpeedControl
        showRepeat
      />

      {/* Compact variant */}
      <AudioPlayer
        text="Au revoir"
        variant="compact"
        showSpeedControl
      />

      {/* Minimal variant */}
      <AudioPlayer
        text="Merci"
        variant="minimal"
      />
    </div>
  )
}

/**
 * Example 6: Voice Selector Component
 */
export function VoiceSelectorExample() {
  return (
    <div className="space-y-4">
      {/* Full voice selector with modal */}
      <VoiceSelector
        onVoiceChange={(voice) => console.log('Selected voice:', voice)}
      />

      {/* Compact dropdown selector */}
      <VoiceSelectorCompact
        onVoiceChange={(voice) => console.log('Selected voice:', voice)}
      />
    </div>
  )
}

/**
 * Example 7: Pronunciation Tips
 */
export function PronunciationTipsExample() {
  const word = 'rouge'
  const tips = getPronunciationTips(word)
  const difficult = getDifficultSounds(word)
  const difficulty = getDifficultyLevel(word)
  const syllables = syllabify(word)

  return (
    <div>
      <h3>Word: {word}</h3>
      <p>Difficulty: {difficulty}</p>
      <p>Syllables: {syllables.join(' - ')}</p>

      <h4>Pronunciation Tips:</h4>
      <ul>
        {tips.map((tip, i) => (
          <li key={i}>
            <strong>[{tip.sound}]</strong>: {tip.description}
            <br />
            <em>Example: {tip.example}</em>
          </li>
        ))}
      </ul>

      <h4>Difficult Sounds:</h4>
      <ul>
        {difficult.map((tip, i) => (
          <li key={i}>
            <strong>[{tip.sound}]</strong>: {tip.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Example 8: Flashcard with TTS
 */
export function FlashcardWithTTSExample() {
  const { speak, speaking } = useTTS()
  const [showAnswer, setShowAnswer] = useState(false)

  const word = {
    french: 'Bonjour',
    english: 'Hello',
    phonetic: '/bɔ̃ʒuʁ/',
    example: 'Bonjour, comment allez-vous?',
  }

  const handlePlayWord = async () => {
    await speak(word.french, { rate: 0.9 })
  }

  const handlePlaySlow = async () => {
    await speak(word.french, { rate: 0.6 })
  }

  const handlePlayExample = async () => {
    await speak(word.example, { rate: 0.9 })
  }

  return (
    <div>
      <div>
        <h2>{word.french}</h2>
        <p>{word.phonetic}</p>

        <div>
          <button onClick={handlePlaySlow} disabled={speaking}>
            🐢 Slow
          </button>
          <button onClick={handlePlayWord} disabled={speaking}>
            🏃 Normal
          </button>
        </div>

        <button onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? 'Hide' : 'Show'} Answer
        </button>

        {showAnswer && (
          <div>
            <h3>{word.english}</h3>
            <p>{word.example}</p>
            <button onClick={handlePlayExample} disabled={speaking}>
              Play Example
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Example 9: Practice Word List
 */
export function PracticeWordListExample() {
  const { speak, speaking } = useTTS()
  const [currentIndex, setCurrentIndex] = useState(0)

  const words = [
    { french: 'Bonjour', english: 'Hello' },
    { french: 'Merci', english: 'Thank you' },
    { french: 'Au revoir', english: 'Goodbye' },
    { french: 'S\'il vous plaît', english: 'Please' },
  ]

  const currentWord = words[currentIndex]

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSpeak = async () => {
    await speak(currentWord.french)
  }

  return (
    <div>
      <h2>
        {currentIndex + 1} / {words.length}
      </h2>
      <h3>{currentWord.french}</h3>
      <p>{currentWord.english}</p>

      <button onClick={handleSpeak} disabled={speaking}>
        🔊 Play
      </button>

      <div>
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          ← Previous
        </button>
        <button onClick={handleNext} disabled={currentIndex === words.length - 1}>
          Next →
        </button>
      </div>
    </div>
  )
}

/**
 * Example 10: Interactive Voice Selection with Preview
 */
export function InteractiveVoicePreviewExample() {
  const { frenchVoices, speak, speaking } = useTTS()
  const [selectedForPreview, setSelectedForPreview] = useState<string>('')

  const handlePreview = async (voiceName: string) => {
    setSelectedForPreview(voiceName)
    await speak('Bonjour, je suis une voix française', { voice: voiceName })
    setSelectedForPreview('')
  }

  return (
    <div>
      <h3>Click to preview each voice:</h3>
      <div className="grid gap-2">
        {frenchVoices.map((v) => (
          <button
            key={v.voice.name}
            onClick={() => handlePreview(v.voice.name)}
            disabled={speaking}
            className={speaking && selectedForPreview === v.voice.name ? 'active' : ''}
          >
            {v.gender === 'female' && '👩'}
            {v.gender === 'male' && '👨'}
            {' '}
            {v.name}
            {' '}
            {v.priority >= 90 && '⭐⭐⭐'}
            {v.priority >= 70 && v.priority < 90 && '⭐⭐'}
            {v.priority < 70 && '⭐'}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Example 11: TTS with Error Handling
 */
export function TTSWithErrorHandlingExample() {
  const [error, setError] = useState<string | null>(null)
  const { speak, supported } = useTTS()

  const handleSpeak = async () => {
    setError(null)
    try {
      await speak('Bonjour', {
        onError: (err) => {
          setError(err.message)
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (!supported) {
    return <div className="error">TTS is not supported in this browser</div>
  }

  return (
    <div>
      <button onClick={handleSpeak}>Speak</button>
      {error && <div className="error">Error: {error}</div>}
    </div>
  )
}

/**
 * Example 12: Complete Pronunciation Practice Component
 */
export function CompletePronunciationExample() {
  const { speak, speaking } = useTTS()
  const [showTips, setShowTips] = useState(false)

  const word = {
    french: 'rouge',
    english: 'red',
    phonetic: '/ʁuʒ/',
  }

  const tips = getPronunciationTips(word.french)
  const difficulty = getDifficultyLevel(word.french)
  const syllables = syllabify(word.french)

  return (
    <div className={`difficulty-${difficulty}`}>
      <h2>{word.french}</h2>
      <p className="phonetic">{word.phonetic}</p>
      <p className="syllables">{syllables.join(' · ')}</p>

      <div className="audio-controls">
        <button onClick={() => speak(word.french, { rate: 0.6 })} disabled={speaking}>
          🐢 Slow
        </button>
        <button onClick={() => speak(word.french, { rate: 0.9 })} disabled={speaking}>
          🏃 Normal
        </button>
        <button onClick={() => speak(word.french, { rate: 1.25 })} disabled={speaking}>
          🚀 Fast
        </button>
      </div>

      <p className="translation">{word.english}</p>

      <button onClick={() => setShowTips(!showTips)}>
        {showTips ? 'Hide' : 'Show'} Pronunciation Tips
      </button>

      {showTips && (
        <div className="tips">
          <h4>Difficulty: {difficulty}</h4>
          {tips.map((tip, i) => (
            <div key={i} className="tip-card">
              <strong>[{tip.sound}]</strong>
              <p>{tip.description}</p>
              <p className="example">Example: {tip.example}</p>
              {tip.lipPosition && <p className="lip-position">👄 {tip.lipPosition}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
