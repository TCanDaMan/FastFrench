# TTS Integration Guide

Quick reference for integrating the TTS system into FastFrench components.

## Quick Start

### 1. Add Audio to Any Component

```typescript
import { AudioPlayer } from '../components/AudioPlayer'

function MyComponent() {
  return (
    <AudioPlayer text="Bonjour" variant="compact" showSpeedControl />
  )
}
```

### 2. Custom TTS Control

```typescript
import { useTTS } from '../hooks/useTTS'

function MyComponent() {
  const { speak, speaking, stop } = useTTS()

  return (
    <button
      onClick={() => speak('Bonjour')}
      disabled={speaking}
    >
      {speaking ? 'Stop' : 'Play'}
    </button>
  )
}
```

### 3. Add to Existing Vocabulary Components

The flashcard system has already been updated! Check:
- `/src/features/vocabulary/Flashcard.tsx`

## Integration Patterns

### Pattern 1: Word List with Audio

```typescript
import { AudioPlayer } from '../components/AudioPlayer'

function WordList({ words }) {
  return (
    <div>
      {words.map(word => (
        <div key={word.id} className="word-item">
          <h3>{word.french}</h3>
          <p>{word.english}</p>
          <AudioPlayer
            text={word.french}
            variant="minimal"
          />
        </div>
      ))}
    </div>
  )
}
```

### Pattern 2: Lesson with Auto-Play

```typescript
import { useTTS } from '../hooks/useTTS'
import { useEffect } from 'react'

function Lesson({ phrase }) {
  const { speak } = useTTS()

  // Auto-play when phrase changes
  useEffect(() => {
    speak(phrase.french, { rate: 0.9 })
  }, [phrase.id])

  return (
    <div>
      <h2>{phrase.french}</h2>
      <p>{phrase.english}</p>
    </div>
  )
}
```

### Pattern 3: Interactive Quiz

```typescript
import { useTTS } from '../hooks/useTTS'

function Quiz({ question }) {
  const { speak, speaking } = useTTS()

  const handleHearQuestion = () => {
    speak(question.french)
  }

  return (
    <div>
      <button onClick={handleHearQuestion} disabled={speaking}>
        🔊 Hear Question
      </button>
      {/* Quiz UI */}
    </div>
  )
}
```

### Pattern 4: Comparison Mode

```typescript
import { useSlowTTS } from '../hooks/useTTS'

function ComparisonPractice({ word }) {
  const { speakSlow, speakNormal, isSlowMode, speaking } = useSlowTTS()

  return (
    <div>
      <h2>{word.french}</h2>
      <div className="controls">
        <button onClick={() => speakSlow(word.french)}>
          🐢 Slow {isSlowMode && speaking && '●'}
        </button>
        <button onClick={() => speakNormal(word.french)}>
          🏃 Native {!isSlowMode && speaking && '●'}
        </button>
      </div>
    </div>
  )
}
```

## Adding to Pages

### Add to HomePage

```typescript
// src/pages/HomePage.tsx
import { AudioPlayer } from '../components/AudioPlayer'

function HomePage() {
  return (
    <div>
      <h1>Welcome to FastFrench</h1>
      <div className="quick-practice">
        <h2>Quick Practice</h2>
        <AudioPlayer
          text="Bienvenue! Comment allez-vous?"
          showSpeedControl
        />
      </div>
    </div>
  )
}
```

### Add to LessonsPage

```typescript
// src/pages/LessonsPage.tsx
import { AudioPlayer } from '../components/AudioPlayer'
import { getPronunciationTips } from '../lib/phonetics'

function LessonItem({ phrase }) {
  const tips = getPronunciationTips(phrase.french)

  return (
    <div className="lesson-card">
      <h3>{phrase.french}</h3>
      <p>{phrase.english}</p>

      <AudioPlayer
        text={phrase.french}
        variant="compact"
        showSpeedControl
      />

      {tips.length > 0 && (
        <div className="tips">
          {tips.map(tip => (
            <div key={tip.sound}>
              <strong>[{tip.sound}]</strong>: {tip.description}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Add Pronunciation Practice Link

```typescript
// In navigation
import { Link } from 'react-router-dom'

<Link to="/pronunciation">
  🗣️ Pronunciation Practice
</Link>
```

## Adding Voice Settings

### Add to ProfilePage

```typescript
// src/pages/ProfilePage.tsx
import { VoiceSelector } from '../components/VoiceSelector'

function ProfilePage() {
  return (
    <div>
      <h1>Profile Settings</h1>

      <section className="settings-section">
        <h2>Audio Settings</h2>
        <VoiceSelector
          onVoiceChange={(voice) => {
            console.log('Voice changed to:', voice)
            // Save preference to localStorage/database
          }}
        />
      </section>
    </div>
  )
}
```

### Save Voice Preference

```typescript
import { useEffect } from 'react'
import { useTTS } from '../hooks/useTTS'

function VoicePreference() {
  const { selectedVoice, setVoice } = useTTS()

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('preferredVoice')
    if (saved) {
      setVoice(saved)
    }
  }, [])

  // Save when changed
  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('preferredVoice', selectedVoice)
    }
  }, [selectedVoice])

  return null // or your settings UI
}
```

## Pronunciation Tips Integration

### Add Tips to Any Word Display

```typescript
import {
  getPronunciationTips,
  getDifficultSounds,
  getDifficultyLevel
} from '../lib/phonetics'

function WordWithTips({ word }) {
  const tips = getPronunciationTips(word.french)
  const difficult = getDifficultSounds(word.french)
  const difficulty = getDifficultyLevel(word.french)

  return (
    <div className={`word-card difficulty-${difficulty}`}>
      <h3>{word.french}</h3>

      {difficult.length > 0 && (
        <div className="warning">
          ⚠️ Contains {difficult.length} challenging sound(s)
        </div>
      )}

      <details>
        <summary>Pronunciation Help</summary>
        <div className="tips">
          {tips.map(tip => (
            <div key={tip.sound} className="tip">
              <strong>[{tip.sound}]</strong>
              <p>{tip.description}</p>
              {tip.lipPosition && <p>👄 {tip.lipPosition}</p>}
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
```

## Advanced Features

### Create Custom Practice Session

```typescript
import { useState } from 'react'
import { useTTS } from '../hooks/useTTS'
import { getDifficultyLevel } from '../lib/phonetics'

function CustomPractice({ words, difficulty = 'all' }) {
  const { speak, speaking } = useTTS()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter by difficulty
  const filteredWords = difficulty === 'all'
    ? words
    : words.filter(w => getDifficultyLevel(w.french) === difficulty)

  const currentWord = filteredWords[currentIndex]

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
      // Auto-play next word
      speak(filteredWords[currentIndex + 1].french)
    }
  }

  return (
    <div>
      <div className="progress">
        {currentIndex + 1} / {filteredWords.length}
      </div>

      <div className="word-display">
        <h2>{currentWord.french}</h2>
        <button
          onClick={() => speak(currentWord.french)}
          disabled={speaking}
        >
          {speaking ? 'Playing...' : 'Play'}
        </button>
      </div>

      <button onClick={handleNext}>Next →</button>
    </div>
  )
}
```

### Add TTS to Existing Modal

```typescript
import { AudioPlayer } from '../components/AudioPlayer'

function WordDetailModal({ word, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{word.french}</h2>
      <p className="phonetic">{word.phonetic}</p>

      {/* Add audio player */}
      <AudioPlayer
        text={word.french}
        showSpeedControl
        showRepeat
      />

      <p>{word.english}</p>

      {word.exampleSentence && (
        <div className="example">
          <p>{word.exampleSentence}</p>
          <AudioPlayer
            text={word.exampleSentence}
            variant="compact"
          />
        </div>
      )}
    </Modal>
  )
}
```

## Styling Tips

### Add Visual Feedback

```css
/* Make speaking elements pulse */
.speaking {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Difficulty indicators */
.difficulty-easy {
  border-left: 4px solid #10b981;
}

.difficulty-medium {
  border-left: 4px solid #f59e0b;
}

.difficulty-hard {
  border-left: 4px solid #ef4444;
}
```

### Dark Mode Support

All TTS components support dark mode out of the box using Tailwind's `dark:` variants.

## Testing Checklist

When integrating TTS:

- [ ] Test on Chrome (Google voices)
- [ ] Test on Safari/macOS (Amélie voice)
- [ ] Test on Firefox
- [ ] Test on mobile devices
- [ ] Verify slow mode works
- [ ] Check speed controls
- [ ] Test voice selection
- [ ] Verify offline functionality
- [ ] Check with network offline
- [ ] Test error handling

## Performance Best Practices

### 1. Preload Voices Early

```typescript
// In App.tsx or main component
import { preloadVoices } from './lib/tts'

useEffect(() => {
  preloadVoices()
}, [])
```

### 2. Stop Previous Audio

```typescript
const { speak, stop } = useTTS()

const handlePlay = (text: string) => {
  stop() // Stop any playing audio
  speak(text)
}
```

### 3. Debounce Rapid Clicks

```typescript
import { debounce } from 'lodash'

const debouncedSpeak = debounce((text: string) => {
  speak(text)
}, 300)
```

## Troubleshooting

### No Audio Playing

```typescript
// Check support
const { supported } = useTTS()
if (!supported) {
  return <div>Audio not supported</div>
}
```

### Wrong Voice Selected

```typescript
// Force specific voice
const { speak, frenchVoices } = useTTS()

const bestVoice = frenchVoices[0]?.voice.name
speak('Bonjour', { voice: bestVoice })
```

### Audio Cuts Off

```typescript
// Wait for completion
await speak('First phrase')
await speak('Second phrase')
```

## Next Steps

1. Test the pronunciation page: `/pronunciation`
2. Add audio to your lesson plans
3. Customize voice preferences in profile
4. Create practice modes with different difficulties
5. Add recording comparison (future enhancement)

## Resources

- **Main Files**: See `TTS_README.md` for complete documentation
- **Examples**: Check `/src/examples/tts-usage-examples.tsx`
- **Components**: Browse `/src/components/AudioPlayer.tsx` and `/src/components/VoiceSelector.tsx`
