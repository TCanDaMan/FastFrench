# FastFrench

A modern French language learning Progressive Web App (PWA) built for a Paris trip countdown.

**Live:** https://fastfrench.vercel.app

## Features

### Core Learning
- **Phrase Library** - 79+ travel-essential French phrases across 10 categories
- **Flashcard Practice** - Spaced repetition vocabulary review
- **Pronunciation Tools** - Slow/normal audio playback with phonetic guides
- **Scenario Mode** - Real-world practice situations (café, metro, hotel, etc.)

### Gamification
- XP and level progression (1-50)
- Rank system (Débutant → Maître)
- Daily streak tracking with freeze protection
- 60+ achievements across multiple categories
- Daily progress goals (10/20/50 XP)

### Technical
- Offline-first with localStorage + Supabase sync
- PWA with install-to-homescreen
- Mobile-first responsive design
- Authentication via Supabase

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: Zustand (persisted)
- **Backend**: Supabase (auth + database)
- **PWA**: vite-plugin-pwa
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone and install
npm install

# Set up environment
cp .env.example .env
# Add your Supabase credentials to .env

# Start dev server
npm run dev
```

Open http://localhost:5173

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/          # Shared UI components
│   └── ProtectedRoute.tsx
├── data/
│   └── phrases.ts       # All 79 phrases + scenarios
├── features/
│   ├── phrases/         # Phrase cards, practice, scenarios
│   ├── pronunciation/   # Pronunciation practice
│   └── vocabulary/      # Flashcards, word lists
├── hooks/
│   ├── useAuth.ts       # Authentication hook
│   ├── useGamification.ts
│   └── useSync.ts       # Cloud sync hook
├── lib/
│   ├── achievements.ts  # 60+ achievements
│   ├── phonetics.ts     # Pronunciation helpers + liaison detection
│   ├── store.ts         # Main Zustand store
│   ├── streaks.ts       # Streak logic
│   ├── supabase.ts      # Supabase client
│   └── xp.ts            # XP/level calculations
├── pages/
│   ├── HomePage.tsx     # Dashboard with stats
│   ├── PhrasesPage.tsx  # Phrase library browser
│   ├── PracticePage.tsx # Flashcard practice
│   ├── ProgressPage.tsx # Stats & achievements
│   └── ProfilePage.tsx  # User settings
├── types/
│   ├── gamification.ts
│   ├── phrases.ts
│   └── database.ts
├── App.tsx              # Routes + navigation
├── main.tsx             # Entry point
└── index.css            # Tailwind + custom styles
```

## Key Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Dashboard with stats, countdown, quick actions |
| `/phrases` | PhrasesPage | Browse 10 categories, 8 scenarios, all phrases |
| `/practice` | PracticePage | Flashcard review with spaced repetition |
| `/progress` | ProgressPage | XP, achievements, streak stats |
| `/profile` | ProfilePage | Account settings, daily goal |
| `/pronunciation` | PronunciationPage | Pronunciation tips and practice |

## Design System

### Colors (Dark Theme)
- **Background**: `zinc-950` (#09090b)
- **Cards**: `zinc-900` (#18181b) with `border-zinc-700`
- **Accent Gold**: Custom gradient for CTAs
- **Text**: White primary, `zinc-400` secondary

### Spacing Standards
- Card padding: `p-6` (24px)
- Grid gaps: `gap-6` (24px)
- Button padding: `px-4 py-2` minimum
- Shadows: `shadow-lg shadow-black/20`

### Typography
- Headings: `font-bold`
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- IPA phonetics: `font-ipa` (Doulos SIL)

## Documentation

- `/docs/GAMIFICATION.md` - Full gamification system docs
- `/docs/QUICK_START_GAMIFICATION.md` - Integration guide
- `/docs/SYNC_QUICK_START.md` - Cloud sync guide

## Deployment

The app auto-deploys to Vercel on push to `main`.

```bash
# Manual deploy
git push origin main
# Vercel builds automatically
```

## License

MIT
