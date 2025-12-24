# FastFrench Vocabulary Flashcard System

## Overview

A complete vocabulary learning system with SM-2 spaced repetition algorithm, beautiful flashcard UI, and gamification features.

## Features

### 1. SM-2 Spaced Repetition Algorithm
- **Scientifically proven** learning algorithm for optimal retention
- **Adaptive intervals** based on recall difficulty
- **Easiness factor** tracking for personalized scheduling
- **Mastery tracking** to identify fully learned words

### 2. Beautiful Flashcard Interface
- **3D flip animations** with Framer Motion
- **Swipe gestures** for quick reviews (left = again, right = easy)
- **Keyboard shortcuts** (arrow keys) for desktop users
- **Text-to-speech** pronunciation using Web Speech API
- **IPA phonetic notation** for accurate pronunciation
- **Progress indicators** showing session progress
- **Category badges** with color-coded gradients

### 3. Multiple Practice Modes
- **Review Due Words**: Practice vocabulary due for review
- **Learn New Words**: Add 10 new words at a time
- **Category Practice**: Focus on specific topics (restaurant, directions, etc.)

### 4. Vocabulary Management
- **Browse all vocabulary** with filtering and sorting
- **Search functionality** across French and English
- **Category filters** with visual badges
- **Mastery progress bars** for each word
- **Add custom words** with phonetic pronunciation

### 5. Gamification
- **XP rewards** for correct answers (10 base + bonuses)
- **Bonus XP** for perfect recall, first-time correct, difficult words
- **Session summaries** with accuracy and XP earned
- **Daily stats** tracking progress

## File Structure

```
src/
├── lib/
│   └── spacedRepetition.ts       # SM-2 algorithm implementation
├── types/
│   └── vocabulary.ts              # TypeScript types
├── data/
│   └── initialVocabulary.ts       # 110+ pre-loaded travel words
├── features/vocabulary/
│   ├── vocabularyStore.ts         # Zustand state management
│   ├── Flashcard.tsx              # Interactive flashcard component
│   ├── FlashcardDeck.tsx          # Card stack with swipe gestures
│   ├── VocabularyList.tsx         # Browse and manage vocabulary
│   ├── AddWordModal.tsx           # Add custom vocabulary
│   └── index.ts                   # Barrel export
└── pages/
    └── PracticePage.tsx           # Main practice interface
```

## How It Works

### SM-2 Algorithm

The SM-2 algorithm schedules reviews based on recall quality:

```typescript
Quality Ratings:
- 0 (Again): Complete failure → Reset to 1 day
- 3 (Hard): Correct with difficulty → 1 day
- 4 (Good): Correct with hesitation → 3-6 days
- 5 (Easy): Perfect recall → 6+ days

Formula:
EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

Where:
- EF = Easiness Factor (min 1.3)
- q = Quality rating (0-5)
- Interval increases exponentially based on EF
```

### Word Lifecycle

```
New Word (repetitions: 0)
    ↓
First Review (interval: 1 day)
    ↓
Second Review (interval: 6 days)
    ↓
Subsequent Reviews (interval: previous × EF)
    ↓
Mastered (5+ reps, 90%+ success, EF > 2.0)
```

### XP System

```typescript
Base XP: 10 per correct answer

Bonuses:
- First-time correct: +10 XP
- Perfect recall (quality 5): +5 XP
- Difficult word (EF < 2.0): +5 XP

Maximum per word: 30 XP
```

## Usage

### Starting a Practice Session

```typescript
// Navigate to /practice
import PracticePage from './pages/PracticePage'

// Three practice modes:
1. Review Due Words - study overdue vocabulary
2. Learn New Words - add 10 new words
3. Category Practice - focus on specific topics
```

### Adding Custom Vocabulary

```typescript
// Click "Add Word" button
{
  french: 'Bonjour',
  english: 'Hello',
  phonetic: 'bɔ̃.ʒuʁ',  // IPA notation
  category: 'greetings',
  exampleSentence: 'Bonjour, comment allez-vous?'
}
```

### Reviewing Words

```typescript
// Swipe or use rating buttons
- Again (Red): Reset progress, review tomorrow
- Hard (Orange): Minimal interval increase
- Good (Green): Standard interval increase
- Easy (Blue): Maximum interval increase

// Keyboard shortcuts
- Left Arrow: Again
- Right Arrow: Easy
- Space: Flip card
```

## Pre-loaded Vocabulary

110+ essential Paris travel words across 10 categories:

- **Greetings & Basics** (20): Hello, thank you, please, etc.
- **Restaurant & Food** (20): Menu, coffee, bill, etc.
- **Directions & Places** (15): Where is, left, right, etc.
- **Shopping** (15): How much, expensive, credit card, etc.
- **Transportation** (10): Metro, bus, taxi, ticket, etc.
- **Numbers** (10): One through one hundred
- **Time & Dates** (10): Today, tomorrow, hour, etc.
- **Emergency** (10): Help, police, hospital, etc.
- **Accommodation**: Hotel-related vocabulary
- **Common Words**: High-frequency vocabulary

Each word includes:
- French text
- English translation
- IPA phonetic pronunciation
- Category classification
- Example sentence (where appropriate)

## Stats & Analytics

The system tracks:
- Total words learned
- Words due for review
- Mastered words
- Words reviewed today
- Accuracy rate
- XP earned per session
- Session duration

## Persistence

All data is persisted to localStorage:
- Vocabulary words and progress
- SM-2 scheduling parameters
- Review history
- Session statistics

## Customization

### Adding New Categories

```typescript
// In src/types/vocabulary.ts
export type VocabularyCategory =
  | 'greetings'
  | 'restaurant'
  | 'your_new_category'  // Add here

export const CATEGORY_INFO: Record<VocabularyCategory, CategoryInfo> = {
  your_new_category: {
    id: 'your_new_category',
    name: 'Your Category Name',
    icon: '🎯',
    description: 'Category description',
    color: 'from-blue-500 to-blue-600',
  },
}
```

### Adjusting SM-2 Parameters

```typescript
// In src/lib/spacedRepetition.ts

// Change initial easiness factor (default: 2.5)
easinessFactor: 2.5

// Change minimum EF (default: 1.3)
if (newEF < 1.3) newEF = 1.3

// Change first interval (default: 1 day)
if (newReps === 1) newInterval = 1

// Change second interval (default: 6 days)
else if (newReps === 2) newInterval = 6
```

### Customizing XP Rewards

```typescript
// In src/features/vocabulary/vocabularyStore.ts

// Base XP for correct answer
xpEarned = 10

// Bonus for difficult words
if (word.easinessFactor < 2.0) xpEarned += 5

// Bonus for perfect recall
if (quality === 5) xpEarned += 5

// Bonus for first-time correct
if (word.timesCorrect === 0) xpEarned += 10
```

## Accessibility

- **Keyboard navigation**: Full keyboard support
- **Screen reader friendly**: Semantic HTML and ARIA labels
- **Text-to-speech**: Native Web Speech API
- **High contrast**: Dark mode support
- **Touch-friendly**: Large tap targets (48px+)
- **Responsive**: Works on mobile, tablet, desktop

## Performance

- **Lazy loading**: Components loaded on demand
- **Optimized animations**: GPU-accelerated transforms
- **Efficient state**: Zustand with selective subscriptions
- **Minimal re-renders**: React.memo and useMemo where appropriate
- **LocalStorage**: Fast client-side persistence

## Future Enhancements

Potential improvements:
- [ ] Audio recordings by native speakers
- [ ] Image associations for visual learning
- [ ] Sentence construction exercises
- [ ] Conjugation practice
- [ ] Spaced repetition analytics dashboard
- [ ] Import/export vocabulary lists
- [ ] Collaborative vocabulary sets
- [ ] Advanced filtering (difficulty, frequency)
- [ ] Review history charts
- [ ] Offline mode with service worker

## Credits

- **SM-2 Algorithm**: Created by Piotr Woźniak (SuperMemo)
- **IPA Pronunciations**: Based on Wiktionary data
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Styling**: Tailwind CSS v4

## License

Part of the FastFrench application.
