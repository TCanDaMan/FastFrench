# TTS Quick Reference Card

## 🚀 Fastest Way to Add Audio

```tsx
import { AudioPlayer } from './components/AudioPlayer'

<AudioPlayer text="Bonjour" />
```

## 📚 Common Imports

```tsx
// Components
import { AudioPlayer, VoiceSelector } from './components'

// Hooks
import { useTTS, useSlowTTS, useVoiceSelection } from './hooks/useTTS'

// Utilities
import { getPronunciationTips, getDifficultSounds, getDifficultyLevel } from './lib/phonetics'
```

## 🎨 AudioPlayer Variants

```tsx
// Full featured (default)
<AudioPlayer text="Bonjour" showSpeedControl showRepeat />

// Compact with speed control
<AudioPlayer text="Merci" variant="compact" showSpeedControl />

// Minimal icon only
<AudioPlayer text="Au revoir" variant="minimal" />
```

## 🎤 useTTS Hook

```tsx
const { speak, speaking, stop, supported } = useTTS()

// Play
await speak("Bonjour")

// Play with options
await speak("Comment allez-vous?", {
  rate: 0.9,      // Speed (0.5 - 2.0)
  pitch: 1.0,     // Pitch (0 - 2)
  voice: "Amélie" // Specific voice
})

// Stop
stop()

// Check if playing
if (speaking) { /* ... */ }

// Check support
if (!supported) return <div>Not supported</div>
```

## 🐢 Slow TTS

```tsx
const { speakSlow, speakNormal, isSlowMode } = useSlowTTS()

<button onClick={() => speakSlow("rouge")}>🐢 Slow</button>
<button onClick={() => speakNormal("rouge")}>🏃 Normal</button>
```

## 🔊 Voice Selection

```tsx
const { frenchVoices, selectedVoice, setVoice } = useTTS()

// Show all French voices
{frenchVoices.map(v => (
  <button onClick={() => setVoice(v.voice.name)}>
    {v.name} ({v.priority})
  </button>
))}

// Or use component
<VoiceSelector onVoiceChange={(voice) => console.log(voice)} />
```

## 💡 Pronunciation Tips

```tsx
import {
  getPronunciationTips,
  getDifficultSounds,
  getDifficultyLevel
} from './lib/phonetics'

const word = "rouge"

// Get all tips
const tips = getPronunciationTips(word)
// [{ sound: "r", description: "Guttural...", example: "rouge" }, ...]

// Get difficult sounds only
const difficult = getDifficultSounds(word)

// Get difficulty level
const difficulty = getDifficultyLevel(word)
// "easy" | "medium" | "hard"
```

## 🎯 Common Patterns

### Word Card with Audio
```tsx
function WordCard({ word }) {
  return (
    <div>
      <h3>{word.french}</h3>
      <p>{word.phonetic}</p>
      <AudioPlayer text={word.french} variant="minimal" />
      <p>{word.english}</p>
    </div>
  )
}
```

### Interactive Practice
```tsx
function Practice({ word }) {
  const { speak, speaking } = useTTS()

  return (
    <div>
      <h2>{word.french}</h2>
      <button onClick={() => speak(word.french, { rate: 0.6 })}>
        🐢 Slow
      </button>
      <button onClick={() => speak(word.french, { rate: 0.9 })}>
        🏃 Normal
      </button>
    </div>
  )
}
```

### With Pronunciation Tips
```tsx
function WordWithTips({ word }) {
  const tips = getPronunciationTips(word.french)

  return (
    <div>
      <h3>{word.french}</h3>
      <AudioPlayer text={word.french} />

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

## ⚙️ Speed Options

```tsx
const SPEEDS = {
  VERY_SLOW: 0.5,   // 🐢 Beginners
  SLOW: 0.6,        // 🚶 Learning
  SLOW_NORMAL: 0.75,// 🚶‍♂️ Practice
  NORMAL: 0.9,      // 🏃 Natural
  FAST: 1.0,        // 🏃‍♂️ Native
  VERY_FAST: 1.25   // 🚀 Advanced
}

await speak("Bonjour", { rate: SPEEDS.SLOW })
```

## 🎨 Styling Classes

```tsx
// Built-in Tailwind classes work
<AudioPlayer
  text="Bonjour"
  className="mb-4 shadow-lg"
/>

// Dark mode is automatic
// Uses dark:bg-gray-800, dark:text-white, etc.
```

## 🔍 Error Handling

```tsx
const { speak, error } = useTTS()

try {
  await speak("Bonjour", {
    onError: (err) => {
      console.error('TTS Error:', err)
    }
  })
} catch (err) {
  // Handle error
}

{error && <div className="error">{error.message}</div>}
```

## 🌐 Azure (Optional)

```bash
# .env
VITE_AZURE_SPEECH_KEY=your_key
VITE_AZURE_SPEECH_REGION=eastus
```

```tsx
import { speakWithAzure, isAzureConfigured } from './lib/tts'

if (isAzureConfigured()) {
  await speakWithAzure("Bonjour", {
    voice: 'fr-FR-DeniseNeural',
    rate: 0.9
  })
}
```

## 📱 Browser Support

| Browser | Quality | Best Voice |
|---------|---------|------------|
| Safari (macOS) | ⭐⭐⭐ | Amélie |
| Chrome | ⭐⭐⭐ | Google français |
| Edge | ⭐⭐⭐ | Microsoft Hortense |
| Firefox | ⭐⭐ | Limited |
| Mobile | ⭐⭐ | Device voices |

## 🎯 Voice Priority Order

1. **Amélie** (macOS) - Best quality
2. **Thomas** (macOS)
3. **Microsoft Hortense** (Windows)
4. **Google français** (Chrome)
5. **Microsoft Julie** (Windows)
6. Other French voices

## 🔧 Common Issues

### No audio?
```tsx
const { supported } = useTTS()
if (!supported) return <div>TTS not available</div>
```

### No French voice?
```tsx
const { frenchVoices } = useTTS()
if (frenchVoices.length === 0) {
  // Fallback to any voice
  await speak("Bonjour", { lang: 'fr-FR' })
}
```

### Audio cuts off?
```tsx
// Wait for completion
await speak("First")
await speak("Second")
```

## 📂 File Locations

```
src/
├── lib/
│   ├── tts.ts              # Core TTS library
│   └── phonetics.ts        # Pronunciation helpers
├── hooks/
│   └── useTTS.ts           # React hooks
├── components/
│   ├── AudioPlayer.tsx     # Audio player component
│   └── VoiceSelector.tsx   # Voice selector
├── features/
│   └── pronunciation/
│       └── PronunciationPractice.tsx
└── pages/
    └── PronunciationPage.tsx
```

## 📖 Documentation

- **Complete docs**: `TTS_README.md`
- **Integration guide**: `TTS_INTEGRATION_GUIDE.md`
- **Examples**: `src/examples/tts-usage-examples.tsx`
- **Summary**: `TTS_SUMMARY.md`

## 🎓 Learn More

```bash
# Read complete documentation
cat TTS_README.md

# See integration examples
cat TTS_INTEGRATION_GUIDE.md

# Check implementation status
cat TTS_CHECKLIST.md
```

---

**Need help?** Check the full documentation or example files!
