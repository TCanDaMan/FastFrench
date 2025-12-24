# Text-to-Speech System for FastFrench

A robust, offline-first TTS system with authentic French pronunciation support.

## Features

### Core Capabilities
- **Offline Support**: Uses Web Speech API for offline text-to-speech
- **Premium Quality**: Optional Azure Speech Services integration
- **Smart Voice Selection**: Automatically selects the best French voice
- **Speed Control**: Adjustable playback speed (0.5x to 1.25x)
- **Slow Mode**: Perfect for learning difficult pronunciations
- **Voice Preferences**: User-selectable French voices

### French Pronunciation
- **Authentic Voices**: Prioritizes native French voices
- **Phonetic Guidance**: IPA notation with pronunciation tips
- **Difficult Sound Detection**: Identifies challenging sounds for English speakers
- **Lip Position Hints**: Visual cues for mouth positioning
- **Syllable Breakdown**: Helps with proper word segmentation

## Files Created

### Core Libraries
- **`src/lib/tts.ts`**: Main TTS library with Web Speech API and Azure integration
- **`src/lib/phonetics.ts`**: French phonetics helper with pronunciation tips

### React Hooks
- **`src/hooks/useTTS.ts`**: Main TTS hook for React components
  - `useTTS()`: Basic TTS functionality
  - `useSlowTTS()`: Specialized hook for slow pronunciation
  - `useVoiceSelection()`: Voice picker with preview

### Components
- **`src/components/AudioPlayer.tsx`**: Beautiful audio player with variants
  - `default`: Full-featured player with waveform animation
  - `compact`: Smaller player with speed control
  - `minimal`: Icon-only player

- **`src/components/VoiceSelector.tsx`**: Voice selection UI
  - `VoiceSelector`: Full modal voice picker
  - `VoiceSelectorCompact`: Dropdown selector for settings

### Features
- **`src/features/pronunciation/PronunciationPractice.tsx`**: Dedicated pronunciation practice mode
  - Slow/normal speed toggle
  - Pronunciation tips
  - Difficulty indicators
  - Example sentences

### Pages
- **`src/pages/PronunciationPage.tsx`**: Full pronunciation practice page
  - Category filtering
  - Difficulty filtering
  - Voice settings

### Updates
- **`src/features/vocabulary/Flashcard.tsx`**: Enhanced with new TTS system
  - Slow/normal pronunciation buttons
  - Better voice selection
  - Example sentence audio

## Usage

### Basic TTS

```typescript
import { useTTS } from '../hooks/useTTS'

function MyComponent() {
  const { speak, speaking, stop } = useTTS()

  const handlePlay = async () => {
    await speak('Bonjour', { rate: 0.9 })
  }

  return (
    <button onClick={handlePlay} disabled={speaking}>
      {speaking ? 'Stop' : 'Play'}
    </button>
  )
}
```

### Audio Player Component

```typescript
import { AudioPlayer } from '../components/AudioPlayer'

function Example() {
  return (
    <div>
      {/* Full player */}
      <AudioPlayer
        text="Bonjour, comment allez-vous?"
        showSpeedControl
        showRepeat
      />

      {/* Compact player */}
      <AudioPlayer
        text="Merci"
        variant="compact"
        showSpeedControl
      />

      {/* Minimal player */}
      <AudioPlayer
        text="Au revoir"
        variant="minimal"
      />
    </div>
  )
}
```

### Pronunciation Practice

```typescript
import { PronunciationPractice } from '../features/pronunciation'

function Practice() {
  const words = useVocabularyStore((state) => state.words)

  return (
    <PronunciationPractice
      words={words}
      category="greetings"
      onComplete={() => console.log('Practice complete!')}
    />
  )
}
```

### Phonetics Helper

```typescript
import {
  getPronunciationTips,
  getDifficultSounds,
  getDifficultyLevel
} from '../lib/phonetics'

const word = "rouge"
const tips = getPronunciationTips(word)
const difficult = getDifficultSounds(word)
const difficulty = getDifficultyLevel(word) // 'easy' | 'medium' | 'hard'

console.log(tips) // Array of pronunciation tips
console.log(difficult) // Difficult sounds for English speakers
console.log(difficulty) // 'medium'
```

## French Voice Priority

The system automatically selects the best French voice in this order:

1. **Amélie** (macOS) - 100 priority - Excellent quality
2. **Thomas** (macOS) - 95 priority - Excellent quality
3. **Microsoft Hortense** (Windows) - 90 priority - Excellent quality
4. **Google français** (Chrome) - 85 priority - Good quality
5. **Microsoft Julie** (Windows) - 80 priority - Good quality
6. Other French voices - Lower priority

Female voices are preferred as they're generally clearer for learners.

## Azure Speech Services (Optional)

For premium quality TTS, configure Azure Speech Services:

### 1. Get Azure Credentials
Sign up at: https://azure.microsoft.com/services/cognitive-services/text-to-speech/

### 2. Configure Environment
Add to `.env`:
```env
VITE_AZURE_SPEECH_KEY=your_key_here
VITE_AZURE_SPEECH_REGION=your_region_here
```

### 3. Use Azure TTS
```typescript
import { speakWithAzure, isAzureConfigured } from '../lib/tts'

if (isAzureConfigured()) {
  await speakWithAzure('Bonjour', {
    voice: 'fr-FR-DeniseNeural', // Premium neural voice
    rate: 0.9
  })
}
```

The system automatically falls back to Web Speech API if Azure is unavailable.

## Browser Compatibility

### Web Speech API Support
- ✅ Chrome/Edge: Excellent (Google/Microsoft voices)
- ✅ Safari/macOS: Excellent (Amélie, Thomas voices)
- ✅ Firefox: Good (Limited voices)
- ⚠️ Mobile: Varies by device

### Best Experience
- **macOS**: Use Safari for Amélie voice (highest quality)
- **Windows**: Use Chrome/Edge for Microsoft Hortense
- **Linux**: Chrome with Google voices
- **Mobile**: Native browser for best voice selection

## French Pronunciation Features

### Sounds Covered
- **Vowels**: u, ou, eu, oi, ai, ei
- **Nasal Vowels**: on, an, en, in, un
- **Consonants**: r (guttural), j, gn, ch
- **Common Patterns**: Silent letters, liaisons, final consonants

### Difficulty Detection
The system automatically detects:
- Guttural 'r'
- French 'u' sound
- Nasal vowels
- Silent letters
- Challenging combinations

### Visual Cues
Each sound gets an emoji for lip positioning:
- 😗 Round lips forward (u)
- 😮 Rounded lips (ou, on)
- 😯 Slightly rounded (eu)
- 😲 Open mouth (an)
- 😤 Throat sound (r)

## Performance Tips

### Preload Voices
```typescript
import { preloadVoices } from '../lib/tts'

// On app start
useEffect(() => {
  preloadVoices()
}, [])
```

### Stop Previous Speech
The system automatically stops previous speech before starting new audio.

### Check Support
```typescript
const { supported } = useTTS()

if (!supported) {
  return <div>TTS not supported in this browser</div>
}
```

## Customization

### Speed Presets
```typescript
const SPEEDS = {
  VERY_SLOW: 0.5,  // 🐢 For very difficult words
  SLOW: 0.6,       // 🚶 Learning speed
  NORMAL: 0.9,     // 🏃 Natural speaking
  FAST: 1.25       // 🚀 Native speed
}
```

### Custom Voice Selection
```typescript
const { speak, setVoice, frenchVoices } = useTTS()

// List available voices
frenchVoices.forEach(v => {
  console.log(v.name, v.priority, v.gender)
})

// Set specific voice
setVoice('Amélie')
await speak('Bonjour')
```

## Testing

### Test Voice Availability
Navigate to pronunciation page and check voice selector.

### Test Different Speeds
Use the AudioPlayer with `showSpeedControl` enabled.

### Test Difficult Words
Use words with: r, u, nasal vowels (bon, dans, vin)

## Troubleshooting

### No Voices Available
- **Chrome**: Reload page (voices load async)
- **Safari**: Voices should load immediately
- **Firefox**: May have limited French voices

### Voice Doesn't Sound French
- Check voice selector settings
- Verify browser language settings
- Try different browser

### Audio Cuts Off
- Don't call `speak()` rapidly
- Use `stop()` before new speech
- Check for conflicting audio

### Azure Not Working
- Verify API key and region
- Check network connection
- System falls back to Web Speech API

## Future Enhancements

Potential improvements:
- [ ] Recording and comparison with native pronunciation
- [ ] Speech recognition for pronunciation verification
- [ ] More detailed mouth/tongue position diagrams
- [ ] Pronunciation scoring system
- [ ] Offline voice packs
- [ ] Custom pronunciation drills
- [ ] Integration with lessons

## License

Part of the FastFrench project.
