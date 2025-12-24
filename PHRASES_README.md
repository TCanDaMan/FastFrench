# Phrase Library System - FastFrench

A comprehensive phrase library browser for learning essential French travel phrases.

## Files Created

### Types (`src/types/phrases.ts`)
- **Phrase**: Core phrase interface with French, English, phonetic (IPA), category, difficulty, usage context
- **PhraseCategory**: 10 categories (greetings, social, restaurant, directions, transportation, shopping, accommodation, emergencies, numbers, time)
- **CategoryInfo**: Category metadata with icon, color, description
- **PhraseProgress**: User progress tracking per phrase
- **PracticeSession**: Practice session metadata
- **Scenario**: Situational practice scenarios
- **CATEGORY_INFO**: Complete category configuration mapping

### Data (`src/data/phrases.ts`)
- **79+ Essential Phrases** organized by category:
  - Greetings (13 phrases)
  - Social/Conversation (10 phrases)
  - Restaurant (8 phrases)
  - Directions (10 phrases)
  - Transportation (10 phrases)
  - Shopping (10 phrases)
  - Accommodation (4 phrases)
  - Emergencies (4 phrases)
  - Numbers (5 phrases)
  - Time (5 phrases)
- **8 Practice Scenarios**: Real-world situations (café, metro, market, directions, hotel, restaurant, emergency, boutique)

### Store (`src/features/phrases/phraseStore.ts`)
Zustand store with localStorage persistence:
- Phrase queries by category, difficulty, ID
- Progress tracking (practiced count, comfort level, learned status)
- Smart recommendations (unpracticed, low comfort)
- Session management
- Category progress statistics

### Components

#### `PhraseCard.tsx`
Beautiful phrase display card with:
- Front: French phrase, English, phonetic, audio playback
- Back (flip): Usage context, comfort level, mark as learned
- Category badge and difficulty stars
- Practice count display

#### `CategoryDetails.tsx`
Category overview page:
- Category icon, name, description
- Progress bar and statistics
- All phrases in category
- "Practice This Category" button

#### `PhrasePractice.tsx`
Interactive practice mode:
- Show English → user recalls French → reveal answer
- Audio playback of correct pronunciation
- Self-rating: Easy / Knew It / Didn't Know
- Progress tracking
- End-of-session summary with accuracy stats

#### `ScenarioMode.tsx`
Situational practice:
- Real-world scenarios (café, metro, shopping, etc.)
- Multiple choice: select appropriate French phrase
- Audio playback for all options
- Immediate feedback (correct/incorrect)
- Score tracking and summary

#### `PhrasesPage.tsx`
Main phrase browser:
- Category pills with progress indicators
- Search phrases (French, English, phonetic)
- Filter by category
- Sort by difficulty, alphabetical, most practiced
- Practice scenarios section
- All phrases grid view
- Navigate to category details or start practice

### Features

#### Audio Pronunciation
- Uses Web Speech API (`speechSynthesis`)
- French voice (`fr-FR`)
- Slower rate (0.85x) for learners
- Available on all phrase cards

#### Progress Tracking
- Practiced count per phrase
- Last practiced date
- Comfort level (1-5 scale)
- Learned status
- Auto-adjustment based on practice performance

#### Smart Recommendations
- Prioritizes unpracticed phrases
- Suggests easier phrases first
- Identifies low-comfort phrases for review

#### Navigation
- Bottom nav: Home, Lessons, **Phrases** (new), Practice, Progress
- Deep navigation: Browse → Category Details → Practice
- Scenario selection and practice flow

## Usage

### Browse Phrases
1. Navigate to `/phrases`
2. Browse by category or search
3. Click category pill to see all phrases in that category
4. Click phrase card to flip and see details

### Practice by Category
1. Select a category
2. Click "Practice This Category"
3. Practice shows English → recall French → rate yourself
4. View session summary with accuracy

### Practice Scenarios
1. Scroll to "Practice Scenarios"
2. Select a scenario (café, metro, etc.)
3. Choose correct French phrase for each situation
4. Get immediate feedback
5. View final score

### Track Progress
- Green progress bars show learned phrases per category
- Comfort level indicators on phrase cards
- Session statistics after practice

## Design Highlights

- **Category Colors**: Each category has unique color scheme
  - Greetings: Blue
  - Social: Purple
  - Restaurant: Amber
  - Directions: Green
  - Transportation: Indigo
  - Shopping: Pink
  - Accommodation: Teal
  - Emergencies: Red
  - Numbers: Slate
  - Time: Orange

- **Smooth Animations**: Framer Motion for card flips, transitions
- **Mobile-First**: Optimized for phone use while traveling
- **Offline-Ready**: LocalStorage persistence of progress
- **Accessible**: Audio playback, clear phonetics, usage contexts

## Future Enhancements

- [ ] Integration with Supabase database (phrases table already seeded)
- [ ] Spaced repetition algorithm
- [ ] Native audio recordings (vs. TTS)
- [ ] Offline audio download
- [ ] Phrase favorites/bookmarks
- [ ] Custom phrase lists
- [ ] Community phrase contributions
- [ ] Conversation builder (string phrases together)

## Database Integration

The Supabase database already has 60+ phrases seeded in `/supabase/migrations/005_seed_phrases.sql`.

To sync with database:
1. Fetch phrases from Supabase in `phraseStore.ts`
2. Merge with local progress data
3. Sync progress back to database
4. Enable cross-device progress sync
