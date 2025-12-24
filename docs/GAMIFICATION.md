# FastFrench Gamification System

Complete documentation for the gamification system implementation.

## Overview

The FastFrench gamification system provides a comprehensive progression framework with:
- XP and level progression (1-50)
- Rank system (Debutant → Maitre)
- Daily streak tracking with freeze mechanism
- 60+ achievements across multiple categories
- Daily progress goals and tracking
- Offline-first with Supabase sync

## Architecture

### Core Files

```
src/
├── types/
│   ├── gamification.ts          # Type definitions
│   └── database.ts               # Supabase types
├── lib/
│   ├── store.ts                  # Zustand state management
│   ├── xp.ts                     # XP calculations
│   ├── streaks.ts                # Streak logic
│   ├── achievements.ts           # Achievement system
│   ├── practice.ts               # Practice session management
│   └── sync.ts                   # Supabase synchronization
├── hooks/
│   └── useGamification.ts        # Main gamification hook
└── examples/
    └── gamification-usage.tsx    # Usage examples
```

## Level & XP System

### Formula
```typescript
level = floor(sqrt(xp / 100)) + 1
```

This creates a smooth progression curve where:
- Level 1: 0 XP
- Level 10: 8,100 XP
- Level 20: 36,100 XP
- Level 30: 84,100 XP
- Level 40: 152,100 XP
- Level 50: 240,100 XP (max)

### XP Rewards

| Activity | XP |
|----------|-----|
| Word Learned | 5 |
| Word Reviewed (Correct) | 3 |
| Word Reviewed (Incorrect) | 1 |
| Phrase Practiced | 10 |
| Quiz Correct | 3 |
| Quiz Perfect | 20 (bonus) |
| Daily Goal Reached | 10 |
| Streak Milestone | 25 |
| Lesson Completed | 15 |
| Challenge Completed | 50 |

### Rank System

| Rank | Level Range | Description |
|------|-------------|-------------|
| Débutant | 1-9 | Just starting |
| Touriste | 10-19 | Basic skills |
| Voyageur | 20-29 | Comfortable traveler |
| Parisien | 30-39 | Advanced fluency |
| Maître | 40-50 | Master of French |

## Streak System

### How Streaks Work

1. **Practice today** → Streak continues
2. **Practice yesterday** → Streak increments
3. **Missed one day** → Can use freeze
4. **Missed 2+ days** → Streak resets to 1

### Streak Freeze

- Awarded every 7 days of streaking
- Automatically protects your streak if you miss exactly one day
- Only one freeze stored at a time

### Streak Milestones

Bonus XP awarded at: 3, 7, 14, 30, 60, 100 days

## Achievement System

### Categories

1. **Beginner** - First steps (1-10 activities)
2. **XP** - Total XP milestones
3. **Vocabulary** - Words and phrases learned
4. **Streak** - Consecutive practice days
5. **Practice** - Practice session count
6. **Time** - Total time spent
7. **Special** - Paris-themed and unique achievements

### Example Achievements

```typescript
{
  name: "Premier Pas",
  description: "Complete your first practice session",
  xp_reward: 50,
  requirement_type: "practice_sessions",
  requirement_value: 1
}

{
  name: "Tour Eiffel",
  description: "Reach Level 10",
  xp_reward: 250,
  requirement_type: "xp_earned",
  requirement_value: 8100
}
```

## Daily Progress Tracking

### Metrics Tracked

- XP Earned
- Words Learned
- Words Reviewed
- Phrases Practiced
- Time Spent (minutes)
- Practice Sessions
- Perfect Lessons

### Daily Goals

Users can choose from three difficulty levels:
- **Casual**: 10 XP/day
- **Regular**: 20 XP/day (default)
- **Serious**: 50 XP/day

## Usage Examples

### Basic Usage

```typescript
import { useGamification } from '@/hooks/useGamification'

function MyComponent() {
  const { stats, practiceWord, learnWord } = useGamification()

  const handlePractice = async () => {
    const result = await practiceWord(true)

    if (result.levelUpResult) {
      // Show level up animation
      console.log(`Level ${result.levelUpResult.newLevel}!`)
    }

    if (result.achievementsUnlocked.length > 0) {
      // Show achievement notifications
      result.achievementsUnlocked.forEach(a => {
        console.log(`🏆 ${a.name}`)
      })
    }
  }

  return (
    <div>
      <h2>Level {stats.current_level}</h2>
      <p>{stats.total_xp} XP</p>
      <button onClick={handlePractice}>Practice Word</button>
    </div>
  )
}
```

### Level Progress Bar

```typescript
import { useLevelProgress } from '@/hooks/useGamification'

function LevelProgressBar() {
  const { percentage, xpInCurrentLevel, xpNeededForLevel } = useLevelProgress()

  return (
    <div className="progress-bar">
      <div
        className="fill"
        style={{ width: `${percentage}%` }}
      />
      <span>{xpInCurrentLevel} / {xpNeededForLevel} XP</span>
    </div>
  )
}
```

### Streak Display

```typescript
import { useStreakStatus } from '@/hooks/useGamification'

function StreakDisplay() {
  const { stats } = useGamification()
  const streakStatus = useStreakStatus()

  return (
    <div className="streak">
      {streakStatus.isOnFire && <span>🔥</span>}
      <span>{stats.current_streak} day streak</span>
      {streakStatus.canUseFreeze && (
        <button onClick={() => store.useStreakFreeze()}>
          ❄️ Use Freeze
        </button>
      )}
    </div>
  )
}
```

### Achievement Progress

```typescript
import {
  achievementProgress,
  formatRequirement
} from '@/lib/achievements'

function AchievementCard({ achievement }) {
  const { stats } = useGamification()
  const progress = achievementProgress(achievement, stats)

  return (
    <div className={achievement.unlocked ? 'unlocked' : 'locked'}>
      <h3>{achievement.name}</h3>
      <p>{achievement.description}</p>
      {!achievement.unlocked && (
        <>
          <p>{formatRequirement(achievement)}</p>
          <div className="progress" style={{ width: `${progress}%` }} />
        </>
      )}
    </div>
  )
}
```

### Practice Session

```typescript
function PracticeSession() {
  const { startPracticeSession, endPracticeSession } = useGamification()
  const [startTime, setStartTime] = useState<Date | null>(null)

  const handleStart = () => {
    startPracticeSession()
    setStartTime(new Date())
  }

  const handleEnd = async () => {
    if (!startTime) return

    const minutes = Math.floor(
      (Date.now() - startTime.getTime()) / (1000 * 60)
    )

    const result = await endPracticeSession(minutes)

    // Show session summary
    console.log(`Session complete: ${minutes} minutes`)
    console.log(`Achievements: ${result.achievementsUnlocked.length}`)
  }

  return (
    <>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleEnd}>End Session</button>
    </>
  )
}
```

## Database Sync

### Loading User Data

```typescript
import { loadUserData } from '@/lib/sync'

useEffect(() => {
  if (user?.id) {
    loadUserData(user.id)
  }
}, [user?.id])
```

### Saving Data

```typescript
import { saveUserData } from '@/lib/sync'

const handleSync = async () => {
  if (user?.id) {
    const result = await saveUserData(user.id)
    if (result.success) {
      console.log('Synced successfully')
    }
  }
}
```

### Auto-Sync

The `useGamification` hook automatically syncs every 5 minutes when changes are detected.

## State Management

### Zustand Store

The store persists to localStorage automatically:

```typescript
// Access store directly
import { useStore } from '@/lib/store'

const totalXp = useStore(state => state.totalXp)
const addXp = useStore(state => state.addXp)

// Or use selectors
import { selectUserStats, selectDailyProgress } from '@/lib/store'

const stats = useStore(selectUserStats)
const dailyProgress = useStore(selectDailyProgress)
```

### Store Actions

```typescript
const store = useStore.getState()

// Add XP (returns level up result)
const levelUpResult = store.addXp(10)

// Update streak
const streakResult = store.updatePracticeStreak()

// Unlock achievement
const achievement = store.unlockAchievement(achievementId)

// Update stats
store.incrementStats({
  wordsLearned: 5,
  phrasesPracticed: 2,
  timeSpentMinutes: 15
})
```

## Offline Support

The system is designed to work offline:

1. **All calculations happen locally** - No network required for XP, levels, streaks
2. **localStorage persistence** - State survives page reloads
3. **Optimistic updates** - UI updates immediately
4. **Background sync** - Syncs to Supabase when online
5. **Conflict resolution** - Local state takes precedence

## Best Practices

### 1. Always await gamification actions

```typescript
// ✅ Good
const result = await practiceWord(true)
if (result.levelUpResult) {
  showLevelUpAnimation()
}

// ❌ Bad
practiceWord(true) // Misses level up detection
```

### 2. Check for achievements after XP-gaining activities

```typescript
const result = await learnWord()
if (result.achievementsUnlocked.length > 0) {
  showAchievementToast(result.achievementsUnlocked)
}
```

### 3. Handle streak updates

```typescript
const result = await practiceWord(true)
if (result.streakUpdated) {
  if (result.newStreak === 1) {
    showStreakLostMessage()
  } else {
    showStreakIncreasedMessage(result.newStreak)
  }
}
```

### 4. Sync regularly but not excessively

```typescript
// ✅ Good - Let auto-sync handle it
useGamification() // Auto-syncs every 5 minutes

// ❌ Bad - Manual sync after every action
const result = await practiceWord(true)
await syncWithDatabase() // Unnecessary
```

### 5. Display progress visually

```typescript
// Show users their progress, not just numbers
const { percentage } = useLevelProgress()
<ProgressBar percentage={percentage} />

const progress = achievementProgress(achievement, stats)
<ProgressCircle percentage={progress} />
```

## Testing

### Test XP Calculations

```typescript
import { calculateLevel, xpForLevel, xpToNextLevel } from '@/lib/xp'

// Level 1 = 0 XP
expect(calculateLevel(0)).toBe(1)

// Level 10 = 8,100 XP
expect(xpForLevel(10)).toBe(8100)
expect(calculateLevel(8100)).toBe(10)

// XP to next level
expect(xpToNextLevel(0)).toBe(100) // Level 1 → 2
```

### Test Streaks

```typescript
import { updateStreak, hasPracticedToday } from '@/lib/streaks'

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

// Practiced yesterday → increment
const result = updateStreak(5, yesterday, false)
expect(result.newStreak).toBe(6)
expect(result.streakIncreased).toBe(true)
```

### Test Achievement Unlocking

```typescript
import { checkAchievementProgress } from '@/lib/achievements'

const achievement = {
  requirement_type: 'xp_earned',
  requirement_value: 100
}

const stats = { total_xp: 150 }

expect(checkAchievementProgress(achievement, stats)).toBe(true)
```

## Performance Considerations

1. **Memoize selectors** - Use `useMemo` for computed values
2. **Batch updates** - Update multiple stats together
3. **Debounce sync** - Don't sync on every action
4. **Lazy load achievements** - Load achievement details on demand
5. **Virtualize lists** - Use virtual scrolling for achievement lists

## Future Enhancements

- [ ] Multiplayer leaderboards
- [ ] Weekly/monthly challenges
- [ ] Social features (friends, competitions)
- [ ] Streak multiplier bonuses
- [ ] Special event achievements
- [ ] Custom achievement creation
- [ ] Achievement rarity tiers
- [ ] Badge collections
- [ ] Progress sharing
- [ ] Achievement notifications via push

## Support

For issues or questions about the gamification system:
1. Check the examples in `/src/examples/gamification-usage.tsx`
2. Review this documentation
3. Check the TypeScript types for available options
4. Test in isolation using the provided utility functions
