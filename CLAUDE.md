# FastFrench - Claude Code Context

## Project Overview

FastFrench is a French language learning PWA built for a Paris trip countdown (~100 days). The goal is to help the user learn essential travel French through phrase memorization, flashcards, and pronunciation practice.

**Live URL:** https://fastfrench.vercel.app
**Deployment:** Auto-deploys to Vercel on push to `main`

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4 (dark theme)
- Zustand for state (persisted to localStorage)
- Supabase for auth + cloud sync
- Framer Motion for animations
- Lucide React for icons

## Architecture

### State Management
- **Main store** (`/src/lib/store.ts`) - XP, levels, streaks, daily progress
- **Phrase store** (`/src/features/phrases/phraseStore.ts`) - Phrase progress
- **Vocabulary store** (`/src/features/vocabulary/vocabularyStore.ts`) - Flashcard words

All stores use Zustand with `persist` middleware to localStorage, and sync to Supabase when online.

### Key Hooks
- `useAuth()` - Authentication state and profile
- `useGamification()` - XP, levels, achievements, streaks
- `useSync()` - Cloud synchronization

### Data
- **Phrases** (`/src/data/phrases.ts`) - 79 phrases across 10 categories + 8 scenarios
- **Achievements** (`/src/lib/achievements.ts`) - 60+ achievements

## Design System

### Colors (Dark Theme)
```
Background:  zinc-950 (#09090b)
Cards:       zinc-900 (#18181b)
Borders:     zinc-700
Text:        white / zinc-400 (secondary)
Accent:      Gold gradient (CTAs)
             Indigo-500 (interactive elements)
```

### Spacing Standards (IMPORTANT)
These were established to fix "1999 website" cramped appearance:

| Element | Minimum |
|---------|---------|
| Card padding | `p-6` (24px) |
| Grid gaps | `gap-6` or `style={{ gap: '1.5rem' }}` |
| Button padding | `px-4 py-2.5` |
| Badge/pill | `px-3 py-1.5` |
| Icons | `w-4 h-4` minimum (preferably `w-5 h-5` or larger) |

### Shadow Standards
```
Cards:      shadow-lg shadow-black/20
Hover:      hover:shadow-xl hover:shadow-black/30
Pills:      shadow-md shadow-black/10
```

## Known Issues / Areas Needing Work

### Visual/UX Issues (reported by user)
- [ ] Spacing still needs improvement in some areas
- [ ] Some elements may still appear cramped
- [ ] Touch targets need to be comfortable (min 44px)
- [ ] Visual hierarchy needs to be clearer through elevation

### Functionality
- [ ] LessonsPage exists but is not linked (was intentionally removed from nav)
- [ ] Pronunciation page could use more content
- [ ] Scenario mode could be expanded

## File Structure

```
src/
├── components/          # Shared components (ProtectedRoute, etc.)
├── data/
│   └── phrases.ts       # THE source of all 79 phrases + scenarios
├── features/
│   ├── phrases/
│   │   ├── PhraseCard.tsx      # Individual phrase card
│   │   ├── CategoryDetails.tsx  # Category drill-down view
│   │   ├── PhrasePractice.tsx   # Practice mode
│   │   ├── ScenarioMode.tsx     # Scenario practice
│   │   └── phraseStore.ts       # Zustand store
│   ├── pronunciation/
│   │   └── PronunciationPractice.tsx
│   └── vocabulary/
│       ├── Flashcard.tsx
│       ├── FlashcardDeck.tsx
│       └── vocabularyStore.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useGamification.ts
│   └── useSync.ts
├── lib/
│   ├── achievements.ts  # All achievement definitions
│   ├── phonetics.ts     # Pronunciation helpers, liaison detection
│   ├── store.ts         # Main gamification store
│   ├── streaks.ts       # Streak calculation logic
│   ├── supabase.ts      # Supabase client
│   ├── sync.ts          # Sync functions
│   └── xp.ts            # XP/level formulas
├── pages/
│   ├── HomePage.tsx     # Main dashboard
│   ├── PhrasesPage.tsx  # Phrase library (main learning hub)
│   ├── PracticePage.tsx # Flashcard practice
│   ├── ProgressPage.tsx # Stats & achievements
│   ├── ProfilePage.tsx  # Settings
│   ├── PronunciationPage.tsx
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   └── AuthCallbackPage.tsx
├── types/
│   ├── gamification.ts
│   ├── phrases.ts
│   └── database.ts
├── App.tsx              # Routes + bottom navigation
├── main.tsx
└── index.css            # Tailwind config + custom classes
```

## Routes

| Path | Component | Protected |
|------|-----------|-----------|
| `/` | HomePage | Yes |
| `/phrases` | PhrasesPage | Yes |
| `/practice` | PracticePage | Yes |
| `/progress` | ProgressPage | Yes |
| `/profile` | ProfilePage | Yes |
| `/pronunciation` | PronunciationPage | Yes |
| `/login` | LoginPage | No |
| `/signup` | SignUpPage | No |
| `/auth/callback` | AuthCallbackPage | No |

## Navigation

Bottom nav (mobile) / Top nav (desktop) with 4 items:
- Home (`/`)
- Phrases (`/phrases`)
- Practice (`/practice`)
- Progress (`/progress`)

Profile is accessible from HomePage user icon, not nav.

## Common Tasks

### Adding new phrases
Edit `/src/data/phrases.ts` - add to the `PHRASES` array with proper category and difficulty.

### Changing colors/theme
Edit `/src/index.css` for custom classes, or update Tailwind classes directly in components.

### XP/Level formula
In `/src/lib/xp.ts`:
```typescript
level = floor(sqrt(xp / 100)) + 1
```

### Testing locally
```bash
npm run dev
# Opens http://localhost:5173
```

### Deploying
```bash
git add . && git commit -m "message" && git push
# Vercel auto-deploys
```

## Important Notes

1. **Never use Haiku model** - User preference is Opus/Sonnet only
2. **Push to GitHub for deployment** - Fastest way to test on mobile
3. **Dark theme is intentional** - Don't change to light theme
4. **Gold accent is the brand color** - Used for primary CTAs
5. **Mobile-first** - Test on mobile viewport, nav is bottom-fixed
