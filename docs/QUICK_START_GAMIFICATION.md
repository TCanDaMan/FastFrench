# Gamification Quick Start Guide

## 5-Minute Integration

### Step 1: Initialize on User Login

```typescript
// In your login/auth component
import { loadUserData, initializeNewUser } from '@/lib/sync'

async function handleLogin(user: User) {
  try {
    // Try to load existing data
    await loadUserData(user.id)
  } catch (error) {
    // If user doesn't exist, initialize them
    await initializeNewUser(user.id, user.username)
  }
}
```

### Step 2: Add Gamification to Word Practice

```typescript
// In your word practice component
import { useGamification } from '@/hooks/useGamification'

function WordPracticeCard({ word }) {
  const { practiceWord, learnWord } = useGamification()

  const handleAnswer = async (isCorrect: boolean) => {
    // Award XP based on answer
    const result = await practiceWord(isCorrect)

    // Show XP gained
    toast.success(`+${result.xpEarned} XP!`)

    // Show level up if it happened
    if (result.levelUpResult?.didLevelUp) {
      showLevelUpModal(result.levelUpResult)
    }

    // Show new achievements
    result.achievementsUnlocked.forEach(achievement => {
      toast.success(`🏆 ${achievement.name}`)
    })
  }

  return (
    <div>
      <h3>{word.french}</h3>
      <button onClick={() => handleAnswer(true)}>I know this</button>
      <button onClick={() => handleAnswer(false)}>I don't know</button>
    </div>
  )
}
```

### Step 3: Add Stats Display

```typescript
// In your profile or navbar
import { useGamification, useLevelProgress } from '@/hooks/useGamification'
import { RankLabels } from '@/types/gamification'

function UserStatsWidget() {
  const { stats, dailyProgress } = useGamification()
  const levelProgress = useLevelProgress()

  return (
    <div className="stats-widget">
      {/* Level */}
      <div>
        <h3>Level {stats.current_level}</h3>
        <p>{RankLabels[stats.current_rank]}</p>
        <div className="progress-bar">
          <div style={{ width: `${levelProgress.percentage}%` }} />
        </div>
      </div>

      {/* Daily Goal */}
      <div>
        <p>Daily Goal</p>
        <div className="progress-bar">
          <div style={{ width: `${dailyProgress.percentage}%` }} />
        </div>
        <p>{dailyProgress.current} / {dailyProgress.goal} XP</p>
      </div>

      {/* Streak */}
      <div>
        <p>🔥 {stats.current_streak} day streak</p>
      </div>
    </div>
  )
}
```

### Step 4: Add Quiz Completion

```typescript
// In your quiz component
import { useGamification } from '@/hooks/useGamification'

function QuizComplete({ correctAnswers, totalQuestions }) {
  const { completeQuiz } = useGamification()

  useEffect(() => {
    const awardXP = async () => {
      const result = await completeQuiz(correctAnswers, totalQuestions)

      // Show results
      console.log(`+${result.xpEarned} XP earned!`)

      if (result.levelUpResult) {
        console.log('Level up!')
      }
    }

    awardXP()
  }, [correctAnswers, totalQuestions])

  return <div>Quiz Complete!</div>
}
```

### Step 5: Display Achievements

```typescript
// Achievement gallery component
import { useGamification } from '@/hooks/useGamification'
import { formatRequirement, achievementProgress } from '@/lib/achievements'

function AchievementGallery() {
  const { achievements, stats } = useGamification()

  return (
    <div className="achievement-grid">
      {achievements.map(achievement => {
        const progress = achievementProgress(achievement, stats)

        return (
          <div
            key={achievement.id}
            className={achievement.unlocked ? 'unlocked' : 'locked'}
          >
            <div className="icon">{achievement.icon_name}</div>
            <h4>{achievement.name}</h4>
            <p>{achievement.description}</p>

            {achievement.unlocked ? (
              <p className="date">
                Unlocked {achievement.earned_at?.toLocaleDateString()}
              </p>
            ) : (
              <>
                <p>{formatRequirement(achievement)}</p>
                <div className="progress-bar">
                  <div style={{ width: `${progress}%` }} />
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

## Common Patterns

### Pattern 1: Award XP for Any Activity

```typescript
const { stats } = useGamification()
const store = useStore()

// Add XP directly
const levelUpResult = store.addXp(10)

// Check for level up
if (levelUpResult.didLevelUp) {
  console.log(`Leveled up to ${levelUpResult.newLevel}!`)
}

// Check for rank up
if (levelUpResult.newRank !== levelUpResult.oldRank) {
  console.log(`New rank: ${levelUpResult.newRank}!`)
}
```

### Pattern 2: Track Practice Session

```typescript
const { startPracticeSession, endPracticeSession } = useGamification()

function PracticeFlow() {
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
    console.log(`Session complete: ${minutes} minutes`)
    console.log(`Achievements: ${result.achievementsUnlocked.length}`)
  }

  return (
    <>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleEnd}>Finish</button>
    </>
  )
}
```

### Pattern 3: Change Daily Goal

```typescript
const { setDailyGoal, stats } = useGamification()

<select
  value={stats.daily_xp_goal}
  onChange={(e) => setDailyGoal(Number(e.target.value) as 10 | 20 | 50)}
>
  <option value={10}>Casual (10 XP/day)</option>
  <option value={20}>Regular (20 XP/day)</option>
  <option value={50}>Serious (50 XP/day)</option>
</select>
```

### Pattern 4: Manual Sync

```typescript
const { syncWithDatabase, needsSync } = useGamification()

{needsSync && (
  <button onClick={syncWithDatabase}>
    Sync Changes
  </button>
)}
```

### Pattern 5: Use Streak Freeze

```typescript
const { stats } = useGamification()
const store = useStore()

{stats.streak_freeze_available && (
  <button onClick={() => {
    const success = store.useStreakFreeze()
    if (success) {
      toast.success('Streak freeze used!')
    }
  }}>
    ❄️ Use Streak Freeze
  </button>
)}
```

## Utility Functions

### Check XP to Next Level

```typescript
import { xpToNextLevel } from '@/lib/xp'

const xpNeeded = xpToNextLevel(stats.total_xp)
console.log(`${xpNeeded} XP until next level`)
```

### Get Streak Message

```typescript
import { getStreakMessage } from '@/lib/streaks'

const message = getStreakMessage(stats.current_streak)
// "7 days! You're building momentum!"
```

### Format Achievement Requirements

```typescript
import { formatRequirement } from '@/lib/achievements'

const requirement = formatRequirement(achievement)
// "Learn 50 words" or "Maintain a 7-day streak"
```

### Calculate Level from XP

```typescript
import { calculateLevel, calculateRank } from '@/lib/xp'

const level = calculateLevel(8100)  // 10
const rank = calculateRank(level)    // 'touriste'
```

## Tips

1. **Always await gamification actions** to catch level-ups and achievements
2. **Use optimistic updates** - the store updates immediately
3. **Let auto-sync handle saving** - runs every 5 minutes
4. **Check achievements after XP-gaining activities**
5. **Show visual feedback** for XP gains, level-ups, and achievements

## Troubleshooting

### XP not updating?
- Check that you're calling the gamification hook methods
- Verify user is logged in
- Check browser console for errors

### Streak not incrementing?
- Ensure `updatePracticeStreak()` is called on first practice of day
- Check `last_practice_date` in localStorage
- Verify system date is correct

### Achievements not unlocking?
- Call `checkForNewAchievements()` after XP-gaining activities
- Verify achievement requirements in database
- Check user stats match requirements

### Data not syncing?
- Check network connection
- Verify Supabase credentials
- Look for sync errors in console
- Try manual sync with `syncWithDatabase()`

## Complete Example Component

```typescript
import { useGamification, useLevelProgress } from '@/hooks/useGamification'
import { RankLabels } from '@/types/gamification'

export function PracticeScreen() {
  const {
    stats,
    dailyProgress,
    practiceWord,
    achievements
  } = useGamification()

  const levelProgress = useLevelProgress()

  const handlePractice = async (correct: boolean) => {
    const result = await practiceWord(correct)

    // Show XP toast
    toast.success(`+${result.xpEarned} XP`)

    // Level up?
    if (result.levelUpResult?.didLevelUp) {
      toast.success(`🎉 Level ${result.levelUpResult.newLevel}!`)
    }

    // Achievements?
    result.achievementsUnlocked.forEach(a => {
      toast.success(`🏆 ${a.name}`)
    })

    // Streak?
    if (result.streakUpdated) {
      toast.info(`🔥 ${result.newStreak} day streak!`)
    }
  }

  return (
    <div>
      {/* Header Stats */}
      <div className="stats-header">
        <div>
          <h2>Level {stats.current_level}</h2>
          <p>{RankLabels[stats.current_rank]}</p>
        </div>
        <div>
          <p>🔥 {stats.current_streak}</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="progress-section">
        <div>
          <p>Level Progress</p>
          <div className="bar">
            <div style={{ width: `${levelProgress.percentage}%` }} />
          </div>
        </div>

        <div>
          <p>Daily Goal</p>
          <div className="bar">
            <div style={{ width: `${dailyProgress.percentage}%` }} />
          </div>
        </div>
      </div>

      {/* Practice Area */}
      <div className="practice-area">
        <button onClick={() => handlePractice(true)}>
          Correct
        </button>
        <button onClick={() => handlePractice(false)}>
          Incorrect
        </button>
      </div>

      {/* Recent Achievements */}
      <div className="recent-achievements">
        {achievements
          .filter(a => a.unlocked)
          .slice(0, 3)
          .map(a => (
            <div key={a.id}>
              {a.icon_name} {a.name}
            </div>
          ))}
      </div>
    </div>
  )
}
```

---

That's it! The gamification system is now integrated and ready to motivate your users to learn French! 🇫🇷
